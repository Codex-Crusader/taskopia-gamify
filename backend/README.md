
# TaskLevels Backend API

This is a Flask-based backend API for the TaskLevels gamified productivity application.

## Setup

1. Make sure you have Python 3.7+ installed
2. Install dependencies: `pip install -r requirements.txt`
3. Run the server: `python app.py`

The server will start on http://localhost:5000

## API Endpoints

### Data
- `GET /api/data` - Get all user data
- `POST /api/data` - Update all user data

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/<task_id>` - Update a task
- `DELETE /api/tasks/<task_id>` - Delete a task

### Progress
- `GET /api/progress` - Get user progress
- `PUT /api/progress` - Update user progress

### Rewards
- `GET /api/rewards` - Get all rewards
- `PUT /api/rewards/<reward_id>` - Update a reward status

## Data Structure

All data is stored in a JSON file (`data.json`).
