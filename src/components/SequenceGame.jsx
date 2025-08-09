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
import { EVENTS, CORRECT_ORDER, shuffleArray, checkGuess, getFeedback } from '../utils/gameData';

const SequenceGame = ({ onWelcomeChange }) => {
  const [items, setItems] = useState([]);
  const [triesLeft, setTriesLeft] = useState(3);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'revealing', 'finished'
  const [feedback, setFeedback] = useState([]);
  const [revealedIndices, setRevealedIndices] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);

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

  // Initialize game
  useEffect(() => {
    resetGame();
  }, []);

  // Notify parent about welcome state if provided
  useEffect(() => {
    if (typeof onWelcomeChange === 'function') {
      onWelcomeChange(gameState === 'welcome');
    }
  }, [gameState, onWelcomeChange]);

  const resetGame = () => {
    setItems(shuffleArray([...EVENTS]));
    setTriesLeft(3);
    setGameState('playing');
    setFeedback([]);
    setRevealedIndices([]);
    setIsCorrect(false);
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

    const currentFeedback = getFeedback(items);
    const correct = checkGuess(items);
    
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
      } else {
        setTriesLeft(prev => prev - 1);
        setGameState('playing');
        setRevealedIndices([]);
      }
    }, currentFeedback.length * 400 + 1000);
  };

  const getMessage = () => {
    if (isCorrect) return "Well done! You got it right! 🎉";
    if (gameState === 'finished') return "Here's the correct order:";
    return "Put these events in chronological order";
  };

  return (
    <div className="min-h-screen p-4 flex flex-col bg-gradient-to-br from-purple-600 to-blue-600">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Sequence</h1>
        <p className="text-white/90 text-lg">{getMessage()}</p>
        {gameState === 'playing' && (
          <p className="text-white/80 text-sm mt-2">Tries left: {triesLeft}</p>
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
            {CORRECT_ORDER.map((item, index) => (
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
    </div>
  );
};

export default SequenceGame; 