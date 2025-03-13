
# Super Simple Task Manager Backend

This is a very basic backend for saving your tasks. It's designed to be as simple as possible for beginners!

## What does it do?

This little server saves your tasks in a file on the computer. When you add or delete tasks in the app, this server keeps track of them.

## How to run it

1. Make sure you have Python installed
2. Install what you need:
   ```
   pip install flask flask-cors
   ```
3. Start the server:
   ```
   python app.py
   ```
4. The server will run at http://localhost:5000

## How it works

- The server creates a file called `data.json` to store your tasks
- When you add or delete tasks, it updates this file
- Very simple!
