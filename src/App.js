import { useState, useEffect } from 'react' // state hook

import './App.css';

import Task from './components/Task'


function App() {
  const [tasks, setTasks] = useState([])

  // make a GET HTTP Request to /tasks and then show the data

  // 1. effect Hook
  useEffect(() => {
    // 2. fetch
    fetch('http://localhost:3030/tasks')
      // promise syntax
      .then(res => res.json())
      .then(data => setTasks(data))
  }, [])

  const handleSubmit = async (event) => {
    // prevent default behaviour of event (in this case form submission event causes page to reload)
    event.preventDefault()
    // get value from first element within element that caused submission event
    const text = event.target[0].value
    // create a new task with the correct data
    const newTask = {
      text: text,
      completed: false
    }

    // fetch() returns a Response object as a promise 
    // (asynchronous operation)
    // .json() returns the body of the response as a promise

    // make a POST HTTP request to /tasks to add the new task
    /*
      fetch('http://localhost:3030/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      })
        .then(res => res.json())
        .then(data => setTasks([...tasks, data]))
    */

    // OR using the async/await 
    
      // wait till the fetch is completed
      const response = await fetch('http://localhost:3030/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      })

      // wait till the body of the response is fetched
      const newData = await response.json()

      // add the new data to the array
      setTasks([...tasks, newData])
    
    // reset the value of the inpuy field
    event.target[0].value = ''
  }

  const updateTasks = async (taskId, value) => {
    // update the task in the db.json
    // make a PATCH HTTP request to update the 
    // completed property of the task with an 
    // id equal to taskId

    await fetch(`http://localhost:3030/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        completed: value
      })
    })

    // then make a GET HTTP request to get the updated data
    const getRes = await fetch('http://localhost:3030/tasks')
    const newData = await getRes.json()

    setTasks(newData)
  }

  const deleteTask = async (taskId) => {
    // make a DELETE HTTP request to delete the task
    // with an id equal to taskId

    await fetch(`http://localhost:3030/tasks/${taskId}`, {
      method: 'DELETE'
    })

    // make a GET HTTP request to get the updated tasks
    const getRes = await fetch('http://localhost:3030/tasks')
    const newData = await getRes.json()

    setTasks(newData)
  }

  return (

    <div className='App'>
      <form onSubmit={handleSubmit}>
        <input type="text" name="task"/>
        <button>add task</button>
      </form>

      {
        tasks.map(item => {
          return (
            <Task
              task={item}
              key={item.id}
              updateTasks={updateTasks}
              deleteTask={deleteTask}
            />
          )})
      }

    </div>

  )
}

export default App;
