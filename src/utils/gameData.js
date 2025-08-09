import { supabase } from './supabaseClient';

// Game data and utilities
export const EVENTS = [
  "Invention of the Wheel",
  "Renaissance", 
  "Industrial Revolution",
  "World War I",
  "Ice Age"
];

export const CORRECT_ORDER = [
  "Ice Age",
  "Invention of the Wheel", 
  "Renaissance",
  "Industrial Revolution",
  "World War I"
];

// Get the day number based on user's timezone (like Wordle)
export const getDayNumber = () => {
  // Use today as day 0, so we start with the existing question
  const startDate = new Date('2025-08-06T00:00:00');
  
  // Get current date in user's timezone
  const now = new Date();
  
  // Calculate days since start date
  // This ensures the day changes at midnight in the user's local timezone
  const timeDiff = now.getTime() - startDate.getTime();
  const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
  return dayDiff;
};

// Get today's date in user's timezone for debugging/logging
export const getTodaysDate = () => {
  const now = new Date();
  return now.toLocaleDateString('en-CA', { 
    timeZone: 'America/Denver' // You can change this to any timezone or remove for user's local timezone
  });
};

// Fetch today's question from Supabase
export const getTodaysQuestion = async () => {
  try {
    const dayNumber = getDayNumber();
    console.log(`Fetching question for day ${dayNumber} (${getTodaysDate()})`);
    
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('day_number', dayNumber)
      .maybeSingle(); // avoid 406 when zero rows

    if (error || !data) {
      // Graceful fallback if no row for today or any error
      if (error) {
        console.warn('Could not fetch question from Supabase (falling back to static data):', error.message || error);
      } else {
        console.warn('No question found for today; falling back to static data');
      }
      return {
        question_text: 'Put these events in chronological order',
        events: EVENTS,
        correct_order: CORRECT_ORDER
      };
    }
    
    return data;
  } catch (error) {
    console.warn('Error fetching question (falling back to static data):', error);
    // Return fallback data if there's any error
    return {
      question_text: 'Put these events in chronological order',
      events: EVENTS,
      correct_order: CORRECT_ORDER
    };
  }
};

// Shuffle array function
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Check if guess is correct (now takes correct order as parameter)
export const checkGuess = (guess, correctOrder) => {
  return guess.every((item, index) => item === correctOrder[index]);
};

// Get feedback for each position (now takes correct order as parameter)
export const getFeedback = (guess, correctOrder) => {
  return guess.map((item, index) => ({
    item,
    isCorrect: item === correctOrder[index]
  }));
}; 