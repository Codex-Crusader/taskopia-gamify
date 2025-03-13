
# Setting Up the Backend for TaskLevels

This project includes a Python Flask backend API to store and manage your task data.

## Prerequisites

- Python 3.7 or higher
- Node.js and npm (for the frontend)

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Start the Flask server:
   ```
   python app.py
   ```

   The server will run on http://localhost:5000

## Connecting Frontend and Backend

The frontend is configured to connect to the backend API at http://localhost:5000/api.

If the backend server is not running, the application will fall back to using localStorage for data persistence.

## API Endpoints

The backend provides these endpoints:

- `/api/data` - Get/save all application data
- `/api/tasks` - Manage tasks
- `/api/progress` - Manage user progress
- `/api/rewards` - Manage rewards

See the `backend/README.md` file for more details on the API endpoints.
