import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import Header from './Header'
import CategoryCard from './CategoryCard'
import NewTask from './NewTask'

export default function Category() {
  const { category } = useParams()
  const [taskList, setTaskList] = useState([])
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    fetch(`http://localhost:8090/api/v1/tasks/${category}`)
      .then((response) => response.json())
      // eslint-disable-next-line no-console
      .catch((e) => console.error(e))
      .then(setTaskList)
  }, [category])

  const handleSubmit = (e) => {
    e.preventDefault()

    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({ title: `${newTask}` })
    console.log(newTask)
    console.log(raw)

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    }

    fetch(`http://localhost:8090/api/v1/tasks/${category}`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error))
  }

  return (
    <div>
      <Header category={category} />
      <NewTask newTask={newTask} setNewTask={setNewTask} handleSubmit={handleSubmit} />
      <div className="w-full flex flex-wrap flex-col items-center bg-white sm:flex-row sm:justify-around">
        {taskList.map((task) => {
          return <CategoryCard key={task.taskId} task={task} category={category} />
        })}
      </div>
      <NewTask newTask={newTask} setNewTask={setNewTask} handleSubmit={handleSubmit} />
    </div>
  )
}
