
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

# Make a new web application
app = Flask(__name__)
# Allow our frontend to talk to this backend
CORS(app)

# Where we'll save our data
DATA_FILE = 'data.json'

# Function to read data from our file
def load_data():
    # Check if our data file exists
    if os.path.exists(DATA_FILE):
        # If it does, read it
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    # If file doesn't exist, start with empty data
    return {"tasks": []}

# Function to save data to our file
def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f)

# Get all tasks
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    data = load_data()
    return jsonify(data.get("tasks", []))

# Add a new task
@app.route('/api/tasks', methods=['POST'])
def add_task():
    # Get the task data from the request
    task = request.json
    # Load existing data
    data = load_data()
    # Add the new task
    data["tasks"].append(task)
    # Save the updated data
    save_data(data)
    # Return the new task
    return jsonify(task)

# Delete a task
@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    # Load existing data
    data = load_data()
    # Remove the task with the given id
    data["tasks"] = [task for task in data["tasks"] if task["id"] != task_id]
    # Save the updated data
    save_data(data)
    # Return a success message
    return jsonify({"message": "Task deleted"})

# Start the server when this file is run
if __name__ == '__main__':
    # Run in debug mode so we can see errors
    app.run(debug=True, port=5000)
