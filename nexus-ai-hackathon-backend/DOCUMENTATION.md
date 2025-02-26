# API Documentation

## Mood Routes

### Get Mood History

GET /api/moods

Retrieves paginated mood history for the user.

**Query Parameters:**

- `page` (optional): Page number, defaults to 1
- `limit` (optional): Items per page, defaults to 10
- `startDate` (optional): Filter moods from this date (inclusive), format: YYYY-MM-DD
- `endDate` (optional): Filter moods until this date (inclusive), format: YYYY-MM-DD

**Example Requests:**

POST http://localhost:3000/api/moods
body: {
"rating": 7,
"description": "Feeling good today",
"tags": ["productive", "energetic"]
}

GET /api/moods // Gets first page with default limit (10)
GET /api/moods?page=2 // Gets second page
GET /api/moods?limit=20 // Gets first page with 20 items
GET /api/moods?page=2&limit=15 // Gets second page with 15 items per page

### Get Specific Mood Entry

GET /api/moods/:moodId

Retrieves a specific mood entry by its ID.

**URL Parameters:**

- `moodId`: The ID of the mood entry to retrieve

### Update Mood Entry

PUT /api/moods/:moodId

Updates a specific mood entry. All fields are optional, but at least one must be provided.

**URL Parameters:**

- `moodId`: The ID of the mood entry to update

**Request Body:**

json
{
"rating": 8, // Optional: number between 1-10
"description": "Updated feeling better now", // Optional: string max 500 chars
"tags": ["relaxed", "peaceful"] // Optional: array of strings
}

### Delete Mood Entry

DELETE /api/moods/:moodId

Deletes a specific mood entry.

**URL Parameters:**

- `moodId`: The ID of the mood entry to delete

### Get Mood Statistics

GET /api/moods/stats

Retrieves mood statistics and trends for the user.

**Response (200):**

### Submit Daily Check-in

POST /api/checkins

Creates a comprehensive daily check-in entry with predefined options. Limited to one check-in per day.

**Request Body:**

{
"mood": {
"rating": 8,
"description": "Happy"
},
"activities": [
"Exercise",
"Meditation",
"Work"
],
"thoughts": "Had some great insights during meditation today. Feeling focused and clear about my goals.",
"gratitude": [
{
"category": "Health",
"detail": "Feeling energetic after maintaining a consistent exercise routine"
},
{
"category": "Career",
"detail": "Grateful for the supportive team at work"
}
],
"goals": {
"completed": [
"Complete project presentation",
"30-minute workout"
],
"upcoming": [
"Start learning TypeScript",
"Plan weekend activities"
]
},
"sleep": {
"hours": 7.5,
"quality": 8
}
}

**Validation Rules:**

- Mood rating must be between 1 and 10
- Mood description must be one of the predefined options
- Select 1-5 activities from the predefined list
- Include 1-3 gratitude items, each with a category and detail
- Sleep hours must be between 0 and 24
- Sleep quality must be between 1 and 10

**Success Response (201):**

### Get Today's Check-in

GET /api/checkins/today

Retrieves the user's check-in for today if it exists.

**Success Response (200):**

### Get Check-in History

GET /api/checkins/history

Retrieves paginated check-in history for the user.

**Query Parameters:**

- `page` (optional): Page number, defaults to 1
- `limit` (optional): Items per page, defaults to 10
- `startDate` (optional): Filter check-ins from this date (inclusive), format: YYYY-MM-DD
- `endDate` (optional): Filter check-ins until this date (inclusive), format: YYYY-MM-DD

GET /api/checkins/history // Gets all check-ins
GET /api/checkins/history?page=2 // Gets second page
GET /api/checkins/history?limit=20 // Gets first page with 20 items
GET /api/checkins/history?startDate=2024-03-01 // Gets check-ins from March 1st, 2024
GET /api/checkins/history?endDate=2024-03-15 // Gets check-ins until March 15th, 2024
GET /api/checkins/history?startDate=2024-03-01&endDate=2024-03-15 // Gets check-ins within date range

### Update Check-in Entry

PUT /api/checkins/:id

Updates a specific check-in entry. All fields are optional, but at least one must be provided.

**URL Parameters:**

- `id`: The ID of the check-in entry to update

**Request Body:**

{
"mood": {
"rating": 9,
"description": "Happy"
},
"activities": [
"Exercise",
"Meditation",
"Work"
],
"thoughts": "Had a productive day with good balance of work and self-care",
"gratitude": [
{
"category": "Health",
"detail": "Maintained my exercise routine and feeling stronger"
},
{
"category": "Career",
"detail": "Completed a challenging project successfully"
}
],
"goals": {
"completed": [
"Finish project presentation",
"Morning workout"
],
"upcoming": [
"Start new learning course",
"Plan weekend activities"
]
},
"sleep": {
"hours": 7.5,
"quality": 8
}
}

### valid categories

'Family','Friends','Health','Career','Personal Growth','Nature','Home','Learning','Experiences','Basic Needs'

### valid activities

'Exercise','Reading','Meditation','Work','Study','Social Activity','Hobby','Entertainment','Outdoor Activity','Rest'

### valid moods

'Very Happy','Happy','Content','Neutral','Anxious','Stressed','Sad','Very S

### Delete Check-in Entry

DELETE /api/checkins/:id

Deletes a specific check-in entry.

**URL Parameters:**

- `id`: The ID of the check-in entry to delete

**Success Response (200):**

### Voice Chat API

#### Process Voice Input

POST /api/voice/chat

Processes transcribed voice input and returns an AI response.

**Request Body:**
json
{
"text": "I'm feeling anxious about my upcoming presentation",
"context": [
{
"role": "user",
"content": "Hi, I need some advice"
},
{
"role": "assistant",
"content": "Hello! I'm here to help. What's on your mind?"
}
]
}

### New Voice Session

POST /api/voice/session/start

### Use the session for chat

POST /api/voice/chat

Headers: X-Session-ID: <session-id>
{
"text": "I'm feeling anxious about my upcoming presentation"
}

### # End a session

POST /api/voice/session/end
Headers: X-Session-ID: <session-id>

## Emotion Detection API

### Detect User Emotion

POST /api/expression/detect

Analyzes user text input to determine the primary emotion expressed.

**Request Body:**
json
{
"text": "I'm feeling really frustrated with my progress lately"
}

**Success Response (200):**
json
{
"success": true,
"emotion": "angry",
"confidence": 0.85,
"details": "The message expresses frustration, which falls under the anger emotion category"
}

**Possible Emotions:**
[happy,sad,angry,anxious,neutral,confused,excited,fearful]

**Error Response (400):**

json
{
"success": false,
"error": "Text input is required"
}
