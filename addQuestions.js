// Script to add multiple questions to Supabase
// Run this with: node addQuestions.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbffhjyrsjjgowvwlqws.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiZmZoanlyc2pqZ293dndscXdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MjA4NTEsImV4cCI6MjA3MDA5Njg1MX0.2s-ANrsJ8HkFrW5rTA-cJnuWw5koNtHJ5-VKAGaHM1M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sample questions to add
const questions = [
  {
    question_text: "Put these inventions in chronological order",
    events: ["Printing Press", "Telephone", "Internet", "Smartphone", "Electric Light"],
    correct_order: ["Printing Press", "Electric Light", "Telephone", "Internet", "Smartphone"],
    day_number: 1
  },
  {
    question_text: "Arrange these historical periods in order",
    events: ["Ancient Egypt", "Roman Empire", "Middle Ages", "Renaissance", "Modern Era"],
    correct_order: ["Ancient Egypt", "Roman Empire", "Middle Ages", "Renaissance", "Modern Era"],
    day_number: 2
  },
  {
    question_text: "Order these space exploration milestones",
    events: ["First Satellite", "Moon Landing", "Space Station", "Mars Rover", "Commercial Spaceflight"],
    correct_order: ["First Satellite", "Moon Landing", "Space Station", "Mars Rover", "Commercial Spaceflight"],
    day_number: 3
  },
  {
    question_text: "Put these musical eras in chronological order",
    events: ["Classical", "Jazz", "Rock and Roll", "Hip Hop", "Electronic"],
    correct_order: ["Classical", "Jazz", "Rock and Roll", "Hip Hop", "Electronic"],
    day_number: 4
  },
  {
    question_text: "Arrange these transportation innovations",
    events: ["Steam Engine", "Automobile", "Airplane", "Jet Engine", "Electric Car"],
    correct_order: ["Steam Engine", "Automobile", "Airplane", "Jet Engine", "Electric Car"],
    day_number: 5
  }
];

async function addQuestions() {
  console.log('Adding questions to Supabase...');
  
  for (const question of questions) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert(question);
      
      if (error) {
        console.error(`Error adding question ${question.day_number}:`, error);
      } else {
        console.log(`✅ Added question for day ${question.day_number}`);
      }
    } catch (err) {
      console.error(`Error adding question ${question.day_number}:`, err);
    }
  }
  
  console.log('Finished adding questions!');
}

// Run the script
addQuestions(); 