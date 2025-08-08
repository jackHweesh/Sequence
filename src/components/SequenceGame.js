import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableItem from './DraggableItem';
import ShareResults from './ShareResults';
import { EVENTS, CORRECT_ORDER, shuffleArray, checkGuess, getFeedback, getTodaysQuestion, getDayNumber, getTodaysDate } from '../utils/gameData';

const SequenceGame = () => {
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
  const [currentDay, setCurrentDay] = useState(0);

  // Compute today's key for localStorage
  const todayKey = `sequence-${new Date().toISOString().slice(0, 10)}`;

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

  // Load today's question from Supabase
  useEffect(() => {
    const loadTodaysQuestion = async () => {
      try {
        const dayNumber = getDayNumber();
        setCurrentDay(dayNumber);
        const data = await getTodaysQuestion();
        setQuestionData(data);
        setCorrectOrder(data.correct_order);
        setItems(shuffleArray([...data.events]));
      } catch (error) {
        console.error('Error loading question:', error);
        // Fallback to static data
        setQuestionData({
          question_text: 'Put these events in chronological order',
          events: EVENTS,
          correct_order: CORRECT_ORDER
        });
        setCorrectOrder(CORRECT_ORDER);
        setItems(shuffleArray([...EVENTS]));
      }
    };

    loadTodaysQuestion();
  }, []);

  // Load saved state on mount
  useEffect(() => {
    const saved = localStorage.getItem(todayKey);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setItems(state.items);
        setTriesLeft(state.triesLeft);
        setFeedback(state.feedback);
        setRevealedIndices(state.revealedIndices);
        setGameState(state.gameState);
        setIsCorrect(state.isCorrect);
        setGameHistory(state.gameHistory || []);
        return;
      } catch (error) {
        console.error('Error loading saved state:', error);
        // If saved state is corrupted, continue with normal flow
      }
    }
    // Only show welcome screen if no saved state exists
    if (questionData) {
      setGameState('welcome');
    }
  }, [questionData, todayKey]);

  // Persist state after any change
  useEffect(() => {
    if (gameState !== 'loading' && gameState !== 'welcome') {
      localStorage.setItem(
        todayKey,
        JSON.stringify({ 
          items, 
          triesLeft, 
          feedback, 
          revealedIndices, 
          gameState, 
          isCorrect,
          gameHistory 
        })
      );
    }
  }, [items, triesLeft, feedback, revealedIndices, gameState, isCorrect, gameHistory, todayKey]);

  const startGame = () => {
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

  const resetGame = () => {
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

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSubmit = () => {
    if (gameState !== 'playing') return;

    const currentFeedback = getFeedback(items, correctOrder);
    const correct = checkGuess(items, correctOrder);
    
    // Add current guess to game history
    setGameHistory(prev => [...prev, currentFeedback]);
    
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
              src="/SequenceLogoFinal.png" 
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
        
        {/* Share Button */}
        {gameState === 'finished' && (
          <button
            onClick={() => setShowShareResults(true)}
            className="absolute top-0 right-12 bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors duration-200"
            title="Share Results"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </button>
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

        {/* Try Again Button */}
        {gameState === 'finished' && (
          <button
            onClick={resetGame}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200"
          >
            Play Again
          </button>
        )}
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
          onClose={() => setShowShareResults(false)}
        />
      )}

      <div className="mt-8 text-center text-white/70 text-xs">© 2025 BlueOak Enterprises. All rights reserved.</div>
    </div>
  );
};

export default SequenceGame; 