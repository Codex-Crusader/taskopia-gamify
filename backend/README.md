
# Super Simple Task Manager Backend

This is a very basic task manager that uses simple Python classes. It's designed to be easy to understand for beginners!

## What does it do?

This code shows how to:
- Create classes in Python
- Use inheritance
- Save data to files
- Load data from files

## How the code works

1. We have a base class called `Saveable` that defines common methods
2. The `Task` class represents a single task with properties like title and description
3. The `TaskManager` class handles all tasks and saving/loading from a file

## How to run it

1. Make sure you have Python installed
2. Run the example:
   ```
   python app.py
   ```
3. It will create a file called `tasks.json` with your tasks

## How to use it in your code

```python
# Create the task manager
manager = TaskManager()

# Add a task
new_task = Task("1", "Learn Python", "Study Python basics", "high")
manager.add_task(new_task)

# Get all tasks
all_tasks = manager.get_all_tasks()

# Delete a task
manager.delete_task("1")
```

That's it! Super simple task management with no API or web server.
