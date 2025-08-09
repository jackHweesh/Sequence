import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // service role key required for inserts
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const inputPath = process.argv[2] || 'scripts/questions_input.json';
const startDateArg = process.argv.find(a => a.startsWith('--start='))?.split('=')[1] || 'today';

function formatYMD(date, tz = 'America/Denver') {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const y = parts.find(p => p.type === 'year').value;
  const m = parts.find(p => p.type === 'month').value;
  const d = parts.find(p => p.type === 'day').value;
  return `${y}-${m}-${d}`;
}

function parseStartDate() {
  if (startDateArg === 'today') {
    const now = new Date();
    const ymd = formatYMD(now);
    return new Date(`${ymd}T00:00:00Z`);
  }
  // YYYY-MM-DD
  return new Date(`${startDateArg}T00:00:00Z`);
}

function addDays(date, days) {
  const d = new Date(date.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

(async () => {
  let raw;
  try {
    raw = fs.readFileSync(inputPath, 'utf8');
  } catch (e) {
    console.error(`Could not read ${inputPath}:`, e.message);
    process.exit(1);
  }

  let items;
  try {
    items = JSON.parse(raw);
  } catch (e) {
    console.error('Invalid JSON:', e.message);
    process.exit(1);
  }

  if (!Array.isArray(items)) {
    console.error('Input JSON must be an array of { question_text, correct_order }');
    process.exit(1);
  }

  const base = parseStartDate();
  console.log(`Importing ${items.length} questions starting ${formatYMD(base)} (America/Denver)…`);

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (!it?.question_text || !Array.isArray(it?.correct_order) || it.correct_order.length < 2) {
      console.warn(`Skipping index ${i}: missing question_text or correct_order[]`);
      continue;
    }

    const correct_order = it.correct_order.map(s => String(s)); // preserve exact strings
    const events = [...correct_order]; // events = correct order (game shuffles at runtime)
    const show_date = formatYMD(addDays(base, i)); // sequential days

    const row = {
      question_text: String(it.question_text),
      events,
      correct_order,
      show_date
    };

    try {
      const { error } = await supabase.from('questions').insert(row);
      if (error) {
        console.error(`Failed (${show_date}): ${error.message}`);
      } else {
        console.log(`Added ${show_date}: ${row.question_text}`);
      }
    } catch (e) {
      console.error(`Error (${show_date}):`, e.message);
    }
  }

  console.log('Done.');
})();


