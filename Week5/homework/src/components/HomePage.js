import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Box,
  Grid,
} from "@mui/material";
import Header from "./Header";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from "react";

import { getAuth } from 'firebase/auth';


export default function HomePage() {
  const navigate = useNavigate();
  const {currentUser} = useAuth()

  // State to hold the list of tasks.
  const [taskList, setTasks] = useState([]);

  // State for the task name being entered by the user.
  const [newTaskName, setNewTaskName] = useState("");
  const BASE_URL = process.env.REACT_APP_BACKEND_URL

  // TODO: Support retrieving your todo list from the API.
  // Currently, the tasks are hardcoded. You'll need to make an API call
  // to fetch the list of tasks instead of using the hardcoded data.

  // useEffect(() => {
  //   if(!currentUser){
  //     navigate('/login')
  //   }
  //   else{
  //     console.log(currentUser.getIdToken())
  //     fetch(BASE_URL + `/tasks/${currentUser.uid}`, {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${currentUser.getIdToken()}`
  //       }
  //     })
  //     .then((response) => response.json())
  //     .then((data) => setTasks(data))
  //   }
  // }, [currentUser])

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        navigate('/login');
      } else {
        try {
          const tokenId = await currentUser.getIdToken();  // Await the promise to get the actual token
          const response = await fetch(BASE_URL + `/tasks/${currentUser.uid}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${tokenId}`  // Use the resolved token
            }
          });
          const data = await response.json();
          setTasks(data);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      }
    };
    fetchData();
  }, [currentUser]);
  

  function handleAddTask() {
    // Check if task name is provided and if it doesn't already exist.
    if (newTaskName && !taskList.some((task) => task.name === newTaskName)) {

      // TODO: Support adding todo items to your todo list through the API.
      // In addition to updating the state directly, you should send a request
      // to the API to add a new task and then update the state based on the response.
      fetch(BASE_URL + '/tasks', {
        method:'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          user: currentUser.uid,
          name: newTaskName,
          finished: false})})
        .then((response) => response.json())
        .then((data) => {
        setTasks([...taskList, data]);
        setNewTaskName('')}
      )}
      else if (taskList.some((task) => task.name === newTaskName)) {
      alert("Task already exists!");
    }
  }

  // Function to toggle the 'finished' status of a task.
  function toggleTaskCompletion(newTask) {
    setTasks(
      taskList.map((task) =>
        task.name === newTask.name ? { ...task, finished: !task.finished } : task
      )
    );

    // TODO: Support removing/checking off todo items in your todo list through the API.
    // Similar to adding tasks, when checking off a task, you should send a request
    // to the API to update the task's status and then update the state based on the response.
    fetch(BASE_URL + `/tasks/${newTask.id}`, {
      method: "DELETE"
    })
    .then((response) => response.json())
    .then(() => {
      const updatedTaskList = taskList.filter((existingTask) => existingTask.id !== newTask.id);

      setTasks(updatedTaskList)
    })
  }


  // Function to compute a message indicating how many tasks are unfinished.
  function getUnfinishedTaskMessage() {
    const unfinishedTasks = taskList.filter((task) => !task.finished).length;
    return unfinishedTasks === 1
      ? `You have 1 unfinished task`
      : `You have ${unfinishedTasks} tasks left to do`;
  }

  return (
    <>
      <Header />
      <Container component="main" maxWidth="sm">
        {/* Main layout and styling for the ToDo app. */}
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Display the unfinished task summary */}
          <Typography variant="h4" component="div" fontWeight="bold">
            {getUnfinishedTaskMessage()}
          </Typography>
          <Box
            sx={{
              width: "100%",
              marginTop: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Input and button to add a new task */}
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small" // makes the textfield smaller
                  value={newTaskName}
                  placeholder="Type your task here"
                  onChange={(event) => setNewTaskName(event.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddTask}
                  fullWidth
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            {/* List of tasks */}
            <List sx={{ marginTop: 3 }}>
              {taskList.map((task) => (
                <ListItem
                  key={task.id}
                  dense
                  onClick={() => toggleTaskCompletion(task)}
                >
                  <Checkbox
                    checked={task.finished}
                    onChange={() => toggleTaskCompletion(task)}
                  />
                  <ListItemText primary={task.name} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Container>
    </>
  );
}