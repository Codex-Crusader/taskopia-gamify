
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

# Create Flask application
app = Flask(__name__)
# Allow requests from any origin (for development)
CORS(app)

# File to store our data
DATA_FILE = 'data.json'

# ---- Simple data access functions ----

# Load data from file
def load_data():
    # If the file exists, read it
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    # Otherwise return empty data structure
    return {"tasks": [], "progress": {"level": 1, "xp": 0}, "rewards": []}

# Save data to file
def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f)

# ---- Routes (endpoints) ----

# Get all data at once
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    data = load_data()
    return jsonify(data.get("tasks", []))

# Add a new task
@app.route('/api/tasks', methods=['POST'])
def add_task():
    task = request.json
    data = load_data()
    data["tasks"].append(task)
    save_data(data)
    return jsonify(task)

# Delete a task
@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    data = load_data()
    data["tasks"] = [task for task in data["tasks"] if task["id"] != task_id]
    save_data(data)
    return jsonify({"message": "Task deleted"})

# Get user progress
@app.route('/api/progress', methods=['GET'])
def get_progress():
    data = load_data()
    return jsonify(data.get("progress", {"level": 1, "xp": 0}))

# Update user progress
@app.route('/api/progress', methods=['PUT'])
def update_progress():
    progress = request.json
    data = load_data()
    data["progress"] = progress
    save_data(data)
    return jsonify(progress)

# Get all rewards
@app.route('/api/rewards', methods=['GET'])
def get_rewards():
    data = load_data()
    return jsonify(data.get("rewards", []))

# Update rewards
@app.route('/api/rewards', methods=['PUT'])
def update_rewards():
    rewards = request.json
    data = load_data()
    data["rewards"] = rewards
    save_data(data)
    return jsonify(rewards)

# Start the server when this file is run directly
if __name__ == '__main__':
    app.run(debug=True, port=5000)
