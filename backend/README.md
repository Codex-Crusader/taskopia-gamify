
# Simple Task Manager Backend

This is a very simple backend for the TaskLevels application using Flask.

## What is this?

This is a simple server that saves your tasks, progress, and rewards to a file on the server instead of in your browser. This means your data will be saved even if you clear your browser data!

## How to run it

1. Make sure you have Python installed on your computer
2. Install the required packages:
   ```
   pip install -r requirements.txt
   ```
3. Run the server:
   ```
   python app.py
   ```
4. The server will start at http://localhost:5000

## How it works

- When you add a task, complete a task, or earn a reward, the data is sent to this server
- The server saves all data in a file called `data.json`
- When you load the app, it gets the saved data from this server

That's it! Very simple, but effective for learning purposes.
