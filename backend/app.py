
# A super simple task manager using just classes and inheritance
# No API, just Python classes

import json
import os

# The file where we'll save our data
DATA_FILE = 'tasks.json'

# Base class for anything we want to save to a file
class Saveable:
    def save(self):
        # This method will be used by child classes
        pass
    
    def load(self):
        # This method will be used by child classes
        pass

# Our main Task class
class Task(Saveable):
    def __init__(self, id, title, description, priority, completed=False):
        self.id = id
        self.title = title
        self.description = description
        self.priority = priority
        self.completed = completed
        
    # Convert the task to a dictionary for saving
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "priority": self.priority,
            "completed": self.completed
        }
    
    # Create a Task from a dictionary (when loading)
    @classmethod
    def from_dict(cls, data):
        return cls(
            data["id"],
            data["title"],
            data["description"],
            data["priority"],
            data["completed"]
        )

# Task manager - this handles all our tasks
class TaskManager(Saveable):
    def __init__(self):
        self.tasks = []
        # Load tasks when we create the manager
        self.load()
    
    # Add a new task
    def add_task(self, task):
        self.tasks.append(task)
        self.save()
        
    # Delete a task by id
    def delete_task(self, task_id):
        self.tasks = [task for task in self.tasks if task.id != task_id]
        self.save()
    
    # Get all tasks
    def get_all_tasks(self):
        return self.tasks
    
    # Save all tasks to our file
    def save(self):
        # Convert all tasks to dictionaries
        task_dicts = [task.to_dict() for task in self.tasks]
        # Save to file
        with open(DATA_FILE, 'w') as f:
            json.dump(task_dicts, f)
    
    # Load tasks from our file
    def load(self):
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r') as f:
                task_dicts = json.load(f)
                # Convert dictionaries back to Task objects
                self.tasks = [Task.from_dict(task_dict) for task_dict in task_dicts]

# Example of how to use this TaskManager
if __name__ == "__main__":
    # Create our task manager
    manager = TaskManager()
    
    # Example: Add a task
    new_task = Task("1", "Learn Python", "Study basic Python concepts", "high")
    manager.add_task(new_task)
    
    # Example: Show all tasks
    all_tasks = manager.get_all_tasks()
    for task in all_tasks:
        print(f"Task: {task.title} - {task.description}")
    
    # Example: Delete a task
    # manager.delete_task("1")
    
    print("Tasks saved to", DATA_FILE)
