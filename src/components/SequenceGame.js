import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableItem from './DraggableItem';
import ShareResults from './ShareResults';
import { EVENTS, CORRECT_ORDER, shuffleArray, checkGuess, getFeedback, getTodaysQuestion, getTodaysDate } from '../utils/gameData';
import sequenceLogo from '../assets/SequenceLogoFinal.png';

const SequenceGame = ({ onWelcomeChange }) => {
  const [items, setItems] = useState([]);
  const [triesLeft, setTriesLeft] = useState(3);
  const [gameState, setGameState] = useState('welcome'); // 'welcome', 'loading', 'playing', 'revealing', 'finished'
  const [feedback, setFeedback] = useState([]);
  const [revealedIndices, setRevealedIndices] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [showShareResults, setShowShareResults] = useState(false);
  const [questionData, setQuestionData] = useState(null);
  const [correctOrder, setCorrectOrder] = useState([]);
  const [dayNumber, setDayNumber] = useState(null);
  const [storageKey, setStorageKey] = useState(null);

  // Configure sensors for better mobile and keyboard support
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Small distance to prevent accidental drags
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Single initialization flow: fetch today's puzzle, compute per-day storage key,
  // then restore saved state BEFORE initializing a new session
  useEffect(() => {
    const initialize = async () => {
      try {
        // Start in loading state until we resolve restore/init
        setGameState('loading');

        const data = await getTodaysQuestion();
        setQuestionData(data);
        setCorrectOrder(data.correct_order);
        if (data.day_number) {
          setDayNumber(data.day_number);
        }

        // Prefer server-provided show_date; fallback to UTC date
        const puzzleId = data.show_date || new Date().toISOString().slice(0, 10);
        const key = `sequence:v1:${puzzleId}`;
        setStorageKey(key);

        // Attempt restore first
        const savedRaw = localStorage.getItem(key);
        if (savedRaw) {
          try {
            const savedState = JSON.parse(savedRaw);
            // If already finished, restore finished view and block more tries
            if (savedState.isCorrect || savedState.gameState === 'finished' || savedState.triesLeft === 0) {
              setItems(savedState.items ?? data.events);
              setTriesLeft(0);
              setFeedback(savedState.feedback ?? []);
              setRevealedIndices(savedState.revealedIndices ?? []);
              setGameState('finished');
              setIsCorrect(!!savedState.isCorrect);
              setGameHistory(savedState.gameHistory || []);
              return;
            }
            // If in-progress with attempts left, restore progress
            if (savedState.gameState === 'playing' && savedState.triesLeft > 0) {
              setItems(savedState.items ?? data.events);
              setTriesLeft(savedState.triesLeft);
              setFeedback(savedState.feedback ?? []);
              setRevealedIndices(savedState.revealedIndices ?? []);
              setGameState('playing');
              setIsCorrect(!!savedState.isCorrect);
              setGameHistory(savedState.gameHistory || []);
              return;
            }
            // Otherwise fall through to fresh init
          } catch (e) {
            console.warn('Saved state parse error; starting fresh');
          }
        }

        // Fresh init for today (no restore)
        setItems(shuffleArray([...data.events]));
        setTriesLeft(3);
        setFeedback([]);
        setRevealedIndices([]);
        setIsCorrect(false);
        setGameHistory([]);
        setShowShareResults(false);
        setGameState('welcome');
      } catch (error) {
        console.error('Error initializing puzzle:', error);
        // Fallback to static data
        setQuestionData({
          question_text: 'Put these events in chronological order',
          events: EVENTS,
          correct_order: CORRECT_ORDER
        });
        setCorrectOrder(CORRECT_ORDER);
        setItems(shuffleArray([...EVENTS]));
        setTriesLeft(3);
        setFeedback([]);
        setRevealedIndices([]);
        setIsCorrect(false);
        setGameHistory([]);
        setShowShareResults(false);
        setGameState('welcome');
      }
    };

    initialize();
  }, []);

  // Notify parent about whether we're on the welcome screen
  useEffect(() => {
    if (typeof onWelcomeChange === 'function') {
      onWelcomeChange(gameState === 'welcome');
    }
  }, [gameState, onWelcomeChange]);

  // Prevent accidental refresh/close while in-progress
  useEffect(() => {
    const beforeUnload = (e) => {
      if (gameState === 'playing' && triesLeft > 0 && !isCorrect) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    const keydown = (e) => {
      const isRefreshKey = e.key === 'F5' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r');
      if (isRefreshKey && gameState === 'playing' && triesLeft > 0 && !isCorrect) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', beforeUnload);
    window.addEventListener('keydown', keydown, { capture: true });
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      window.removeEventListener('keydown', keydown, { capture: true });
    };
  }, [gameState, triesLeft, isCorrect]);

  // Save state whenever relevant values change
  useEffect(() => {
    if (!storageKey) return;
    const state = {
      items,
      triesLeft,
      feedback,
      revealedIndices,
      gameState,
      isCorrect,
      gameHistory,
    };
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [storageKey, items, triesLeft, feedback, revealedIndices, gameState, isCorrect, gameHistory]);

  const startGame = () => {
    // Check if user has already completed today's puzzle
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const state = JSON.parse(saved);
          if (state.isCorrect || state.gameState === 'finished' || state.triesLeft === 0) {
            setItems(state.items ?? items);
            setTriesLeft(0);
            setFeedback(state.feedback ?? []);
            setRevealedIndices(state.revealedIndices ?? []);
            setGameState('finished');
            setIsCorrect(!!state.isCorrect);
            setGameHistory(state.gameHistory || []);
            return;
          }
        } catch (error) {
          console.error('Error checking saved state:', error);
        }
      }
    }
    setGameState('playing');
  };

  const resetGame = () => {
    // Don't allow reset if game is already completed for today
    if (isCorrect || gameState === 'finished') {
      return;
    }
    
    if (questionData) {
      setItems(shuffleArray([...questionData.events]));
    } else {
      setItems(shuffleArray([...EVENTS]));
    }
    setTriesLeft(3);
    setGameState('playing');
    setFeedback([]);
    setRevealedIndices([]);
    setIsCorrect(false);
    setGameHistory([]);
    setShowShareResults(false);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setItems((items) => {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const handleSubmit = () => {
    if (gameState !== 'playing' || triesLeft <= 0) return;

    const currentFeedback = getFeedback(items, correctOrder);
    const correct = checkGuess(items, correctOrder);

    // Record this attempt's feedback in game history so it can be shared later
    setGameHistory((previousHistory) => [...previousHistory, currentFeedback]);

    setFeedback(currentFeedback);
    setIsCorrect(correct);
    setGameState('revealing');

    // Reveal feedback one by one
    currentFeedback.forEach((item, index) => {
      setTimeout(() => {
        setRevealedIndices(prev => [...prev, index]);
      }, index * 400);
    });

    // After all feedback is shown
    setTimeout(() => {
      if (correct || triesLeft <= 1) {
        setGameState('finished');
        // Automatically open the share modal upon puzzle completion
        setShowShareResults(true);
      } else {
        setTriesLeft(prev => prev - 1);
        setGameState('playing');
        setRevealedIndices([]);
      }
    }, currentFeedback.length * 400 + 1000);
  };

  const getMessage = () => {
    if (gameState === 'loading') return "Loading today's puzzle...";
    if (isCorrect) return "Well done! You got it right! 🎉";
    if (gameState === 'finished') return "Here's the correct order:";
    return questionData?.question_text || "Put these events in chronological order";
  };

  // Show welcome screen
  if (gameState === 'welcome') {
    return (
      <div className="min-h-screen p-4 flex flex-col bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="flex-1 flex items-center justify-center -mt-16">
          <div className="text-center">
            <img 
              src={sequenceLogo}
              alt="Sequence Logo" 
              className="w-72 h-72 mx-auto mb-2"
            />
            <h1 className="text-6xl font-bold text-white mb-6">Sequence</h1>
            <p className="text-white/90 text-xl mb-12">You get 3 tries to find the correct order.</p>
            <button
              onClick={startGame}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 px-12 rounded-lg shadow-lg transition-all duration-200 text-xl"
            >
              Play
            </button>
          </div>
        </div>
        <div className="mt-8 text-center text-white/70 text-xs">© 2025 BlueOak Enterprises. All rights reserved.</div>
      </div>
    );
  }

  // Show loading state
  if (gameState === 'loading') {
    return (
      <div className="min-h-screen p-4 flex flex-col bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Sequence</h1>
            <p className="text-white/90 text-lg">Loading today's puzzle...</p>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-white/70 text-xs">© 2025 BlueOak Enterprises. All rights reserved.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex flex-col bg-gradient-to-br from-purple-600 to-blue-600">
      {/* Share Button - fixed at top-right like the gear button (render outside header) */}
      {gameState === 'finished' && createPortal(
        (
          <button
            onClick={() => setShowShareResults(true)}
            className="absolute top-4 right-16 z-50 bg-transparent text-white hover:text-white/90 p-2 transition-colors duration-200"
            style={{ zIndex: 9999 }}
            title="Share Results"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </button>
        ),
        document.body
      )}

      {/* Header */}
      <div className="relative text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Sequence</h1>
        <p className="text-white/90 text-lg">{getMessage()}</p>
        {gameState === 'playing' && (
          <div className="text-white/80 mt-2">
            <p className="text-base font-medium">Tries left: {triesLeft}</p>
            <p className="text-xs opacity-75">{getTodaysDate()}</p>
          </div>
        )}
      </div>

      {/* Game Area */}
      <div className="flex-1 max-w-md mx-auto w-full">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {items.map((item, index) => (
                <DraggableItem
                  key={item}
                  item={item}
                  index={index}
                  isCorrect={feedback[index]?.isCorrect || false}
                  isRevealed={revealedIndices.includes(index)}
                  isDisabled={gameState !== 'playing'}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Submit Button */}
        {gameState === 'playing' && (
          <button
            onClick={handleSubmit}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200"
          >
            Submit Guess
          </button>
        )}

        {/* Play Again button removed per request */}
      </div>

      {/* Correct Order Display */}
      {gameState === 'finished' && (
        <div className="mt-6 max-w-md mx-auto w-full">
          <h3 className="text-white font-semibold mb-3 text-center">Correct Order:</h3>
          <div className="space-y-2">
            {correctOrder.map((item, index) => (
              <div
                key={item}
                className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-lg border border-white/20"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item}</span>
                  <span className="text-white/60 text-sm">#{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Results Modal */}
      {showShareResults && (
        <ShareResults
          gameHistory={gameHistory}
          isCorrect={isCorrect}
          dayNumber={dayNumber}
          onClose={() => setShowShareResults(false)}
        />
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-white/70 text-xs">© 2025 BlueOak Enterprises. All rights reserved.</div>
    </div>
  );
};

export default SequenceGame; 