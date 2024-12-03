// Importing required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Creating an instance of Express
const app = express();

// Loading environment variables from a .env file into process.env
require("dotenv").config();

// Importing the Firestore database instance from firebase.js
const db = require("./firebase");

// Middlewares to handle cross-origin requests and to parse the body of incoming requests to JSON
app.use(cors());
app.use(bodyParser.json());

// Your API routes will go here...

// GET: Endpoint to retrieve all tasks
app.get("/tasks", async (req, res) => {
  try {
    // Fetching all documents from the "tasks" collection in Firestore
    const snapshot = await db.collection("tasks").get();
    console.log(snapshot.docs)
    let tasks = [];
    // Looping through each document and collecting data
    snapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,  // Document ID from Firestore
        ...doc.data(),  // Document data
      });
    });

    // Sending a successful response with the tasks data
    res.status(200).send(tasks);
  } catch (error) {
    // Sending an error response in case of an exception
    res.status(500).send(error.message);
  }
});

// GET: Endpoint to retrieve all tasks for a user
app.get('/tasks/:user', async (req, res) => {
  const user = req.params.user;
  const tasksSnapshot = await db.collection("tasks").where("user", "==", user).get();
  const tasks = tasksSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  res.json(tasks);
});

const validateInput = (req, res, next) => {
  const { user, task } = req.body;
  if (user && task) {
    next();
  } else {
    res.status(400).json({ error: 'Incomplete task' });
  }
};

// POST: Endpoint to add a new task
app.post('/tasks', validateInput, async (req, res) => {
  const newTask = {
    user: req.body.user,
    task: req.body.task,
    finished: false
  };
  const taskRef = await db.collection("tasks").add(newTask);
  res.json({ id: taskRef.id, ...newTask });
});

// DELETE: Endpoint to remove a task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const taskRef = db.collection("tasks").doc(id);
  const taskSnapshot = await taskRef.get();

  if (!taskSnapshot.exists) {
    res.status(404).json({ error: "Task not found" });
  } else {
    await taskRef.delete();
    res.json({ id, ...taskSnapshot.data() });
  }
});

// Setting the port for the server to listen on
const PORT = process.env.PORT || 3001;
// Starting the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});