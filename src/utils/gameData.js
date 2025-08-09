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

// Get today's date in user's timezone for debugging/logging and querying (YYYY-MM-DD)
export const getTodaysDate = () => {
  const now = new Date();
  return now.toLocaleDateString('en-CA', {
    timeZone: 'America/Denver'
  });
};

// Fetch today's question from Supabase using show_date
export const getTodaysQuestion = async () => {
  try {
    const showDate = getTodaysDate();
    console.log(`Fetching question for show_date ${showDate}`);

    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('show_date', showDate)
      .maybeSingle();

    if (error || !data) {
      if (error) {
        console.warn('Could not fetch question from Supabase (falling back to static data):', error.message || error);
      } else {
        console.warn('No question found for show_date; falling back to static data');
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