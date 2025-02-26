export const MOOD_DESCRIPTIONS = [
  'Very Happy',
  'Happy',
  'Content',
  'Neutral',
  'Anxious',
  'Stressed',
  'Sad',
  'Very Sad'
] as const;

export const ACTIVITIES = [
  'Exercise',
  'Reading',
  'Meditation',
  'Work',
  'Study',
  'Social Activity',
  'Hobby',
  'Entertainment',
  'Outdoor Activity',
  'Rest'
] as const;

export const GRATITUDE_CATEGORIES = [
  'Family',
  'Friends',
  'Health',
  'Career',
  'Personal Growth',
  'Nature',
  'Home',
  'Learning',
  'Experiences',
  'Basic Needs'
] as const;

export type MoodDescription = typeof MOOD_DESCRIPTIONS[number];
export type Activity = typeof ACTIVITIES[number];
export type GratitudeCategory = typeof GRATITUDE_CATEGORIES[number]; 