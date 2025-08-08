import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DraggableItem = ({ item, index, isCorrect, isRevealed, isDisabled }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item,
    disabled: isDisabled,
  });

  const getBackgroundColor = () => {
    if (!isRevealed) return 'bg-white';
    if (isCorrect) return 'bg-green-500';
    return 'bg-white';
  };

  const getTextColor = () => {
    if (!isRevealed) return 'text-gray-800';
    if (isCorrect) return 'text-white';
    return 'text-gray-800';
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
             className={`
         draggable-item
         ${getBackgroundColor()}
         ${getTextColor()}
         p-4 rounded-lg shadow-sm mb-3 cursor-grab active:cursor-grabbing
         transition-all duration-200 ease-out
         ${isDragging ? 'scale-105 shadow-lg z-50' : 'hover:scale-102 hover:shadow-md'}
         ${isDisabled ? 'cursor-not-allowed opacity-75' : ''}
         ${isRevealed ? 'animate-wiggle' : ''}
         touch-manipulation
       `}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm sm:text-base select-none">{item}</span>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 select-none">#{index + 1}</span>
        </div>
      </div>
    </div>
  );
};

export default DraggableItem; 