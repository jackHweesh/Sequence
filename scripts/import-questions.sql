-- Paste this in Supabase SQL editor and run once.
-- Appends new rows starting today. Preserves your exact question/answer text.

WITH base AS (
  SELECT COALESCE(MAX(day_number), 0) AS max_day
  FROM questions
),
rows AS (
  SELECT 1 AS idx,
         'Arrange these tech companies by founding year'::text AS question_text,
         jsonb_build_array('Microsoft','Apple','Amazon','Google','Facebook') AS list
  UNION ALL SELECT 2,
         'Rank these animals by top speed',
         jsonb_build_array('Human','Horse','Greyhound','Cheetah','Peregrine Falcon')
  UNION ALL SELECT 3,
         'Place these colors in order of wavelength (shortest to longest)',
         jsonb_build_array('Violet','Blue','Green','Yellow','Red')
  UNION ALL SELECT 4,
         'Sort these objects from lightest to heaviest',
         jsonb_build_array('Feather','Paperclip','Bowling Ball','Bicycle','Car')
  UNION ALL SELECT 5,
         'Put these social media platforms in order of their launch date',
         jsonb_build_array('Myspace','Facebook','Twitter','Instagram','TikTok')
  UNION ALL SELECT 6,
         'Arrange these landmarks from shortest to tallest',
         jsonb_build_array('Statue of Liberty','Big Ben','Eiffel Tower','Empire State Building','Burj Khalifa')
  UNION ALL SELECT 7,
         'Rank these dog breeds by average height',
         jsonb_build_array('Chihuahua','Beagle','Labrador Retriever','German Shepherd','Great Dane')
  UNION ALL SELECT 8,
         'Put these wars in chronological order from earliest to latest',
         jsonb_build_array('American Civil War','World War I','World War II','Korean War','Vietnam War')
  UNION ALL SELECT 9,
         'Arrange these sports by global fan base size',
         jsonb_build_array('Rugby','Tennis','Basketball','Cricket','Soccer')
  UNION ALL SELECT 10,
         'Sort these candies from least to most sugar (grams per 100g)',
         jsonb_build_array('Dark Chocolate','Milk Chocolate','M&M’s','Skittles','Cotton Candy')
  UNION ALL SELECT 11,
         'Rank these languages by number of native speakers',
         jsonb_build_array('German','French','English','Spanish','Mandarin')
  UNION ALL SELECT 12,
         'Arrange these fireworks from quietest to loudest',
         jsonb_build_array('Sparkler','Fountain','Roman Candle','Firecracker','Aerial Shell')
  UNION ALL SELECT 13,
         'Sort these U.S. states by population (smallest to largest)',
         jsonb_build_array('Wyoming','Vermont','Alaska','Hawaii','California')
  UNION ALL SELECT 14,
         'Arrange these chess pieces by “point” value',
         jsonb_build_array('Pawn','Knight','Bishop','Rook','Queen')
  UNION ALL SELECT 15,
         'Arrange these ocean animals from shortest to longest',
         jsonb_build_array('Clownfish','Dolphin','Great White Shark','Orca','Blue Whale')
  UNION ALL SELECT 16,
         'Put these video game consoles in order of release date',
         jsonb_build_array('Atari 2600','Game Boy','Nintendo 64','Xbox 360','PlayStation 5')
  UNION ALL SELECT 17,
         'Sort these mediums by the speed of sound through them (slowest to fastest)',
         jsonb_build_array('Vacuum','Air','Water','Glass','Steel')
  UNION ALL SELECT 18,
         'Place these hit songs in order of release year',
         jsonb_build_array('Billie Jean','Smells Like Teen Spirit','Rolling in the Deep','Shape of You','As It Was')
  UNION ALL SELECT 19,
         'Arrange these vehicles by maximum speed',
         jsonb_build_array('Snowmobile','Bullet Train','NASCAR Stock Car','Formula 1 Car','Top Fuel Dragster')
  UNION ALL SELECT 20,
         'Arrange these light sources by color temperature (coolest to warmest)',
         jsonb_build_array('Candle Flame','Incandescent Bulb','Morning Sun','Noon Sunlight','Overcast Sky')
  UNION ALL SELECT 21,
         'Place these famous events in chronological order',
         jsonb_build_array('Frozen Release','Rio Summer Olympics','Pokémon GO Release','TikTok Launch','Avengers: Endgame')
)
INSERT INTO questions (question_text, events, correct_order, show_date, day_number)
SELECT r.question_text,
       r.list AS events,
       r.list AS correct_order,
       ((now() AT TIME ZONE 'America/Denver')::date + (r.idx - 1))::date AS show_date,
       (b.max_day + r.idx) AS day_number
FROM rows r
CROSS JOIN base b;


