
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # Enable cross-origin requests

# Path to our data file
DATA_FILE = 'data.json'

# Simple functions to read and write data
def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {"tasks": [], "progress": {"level": 1, "xp": 0}, "rewards": []}

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f)

# Basic routes
@app.route('/api/data', methods=['GET'])
def get_all_data():
    """Get all app data at once"""
    return jsonify(load_data())

@app.route('/api/data', methods=['POST'])
def update_all_data():
    """Save all app data at once"""
    data = request.json
    save_data(data)
    return jsonify({"message": "Data saved successfully"})

# Task routes
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks"""
    data = load_data()
    return jsonify(data.get("tasks", []))

@app.route('/api/tasks', methods=['POST'])
def add_task():
    """Add a new task"""
    task = request.json
    data = load_data()
    data["tasks"].append(task)
    save_data(data)
    return jsonify(task)

@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def remove_task(task_id):
    """Delete a task"""
    data = load_data()
    data["tasks"] = [task for task in data["tasks"] if task["id"] != task_id]
    save_data(data)
    return jsonify({"message": "Task deleted"})

# Progress route
@app.route('/api/progress', methods=['GET'])
def get_progress():
    """Get user progress"""
    data = load_data()
    return jsonify(data.get("progress", {}))

@app.route('/api/progress', methods=['PUT'])
def update_progress():
    """Update user progress"""
    progress = request.json
    data = load_data()
    data["progress"] = progress
    save_data(data)
    return jsonify(progress)

# Start the server
if __name__ == '__main__':
    app.run(debug=True, port=5000)
