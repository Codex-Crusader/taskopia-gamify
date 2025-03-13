
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Path to the data file
DATA_FILE = 'data.json'

# Helper functions for data operations
def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {"progress": {}, "tasks": [], "rewards": []}

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f)

# API Routes
@app.route('/api/data', methods=['GET'])
def get_data():
    """Get all user data"""
    return jsonify(load_data())

@app.route('/api/data', methods=['POST'])
def update_data():
    """Update all user data"""
    data = request.json
    save_data(data)
    return jsonify({"message": "Data saved successfully"})

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks"""
    data = load_data()
    return jsonify(data.get("tasks", []))

@app.route('/api/tasks', methods=['POST'])
def create_task():
    """Create a new task"""
    task = request.json
    data = load_data()
    
    # Handle date string conversion for storage
    if "dueDate" in task and task["dueDate"]:
        task["dueDate"] = task["dueDate"]  # Keep as string for JSON storage
    
    task["createdAt"] = datetime.now().isoformat()
    
    data["tasks"].append(task)
    save_data(data)
    return jsonify(task)

@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    """Update a task"""
    updated_task = request.json
    data = load_data()
    
    for i, task in enumerate(data["tasks"]):
        if task["id"] == task_id:
            data["tasks"][i] = updated_task
            save_data(data)
            return jsonify(updated_task)
    
    return jsonify({"error": "Task not found"}), 404

@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a task"""
    data = load_data()
    
    data["tasks"] = [task for task in data["tasks"] if task["id"] != task_id]
    save_data(data)
    return jsonify({"message": "Task deleted"})

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

@app.route('/api/rewards', methods=['GET'])
def get_rewards():
    """Get all rewards"""
    data = load_data()
    return jsonify(data.get("rewards", []))

@app.route('/api/rewards/<reward_id>', methods=['PUT'])
def update_reward(reward_id):
    """Update a reward (unlock status)"""
    updated_reward = request.json
    data = load_data()
    
    for i, reward in enumerate(data["rewards"]):
        if reward["id"] == reward_id:
            data["rewards"][i] = updated_reward
            save_data(data)
            return jsonify(updated_reward)
    
    return jsonify({"error": "Reward not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
