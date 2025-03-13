
# Simple TaskLevels Backend

This is a basic Flask API for storing and retrieving task data.

## Setup

1. Install Python 3.7+
2. Install dependencies: `pip install -r requirements.txt`
3. Run the server: `python app.py`

The server will run at http://localhost:5000

## API Endpoints

- `GET /api/data` - Get all data
- `POST /api/data` - Save all data
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Add a new task
- `DELETE /api/tasks/<task_id>` - Delete a task
- `GET /api/progress` - Get user progress
- `PUT /api/progress` - Update user progress

## Data Storage

All data is stored in a simple JSON file (`data.json`).
