import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import Header from '../components/Header'
import CategoryCard from '../components/CategoryCard'
import NewTask from '../components/NewTask'

export default function Category() {
  const { category } = useParams()
  const [taskList, setTaskList] = useState([])
  const [newTask, setNewTask] = useState('')
  const [refresh, setRefresh] = useState(false)
  const [errorName, setErrorName] = useState(false)

  useEffect(() => {
    fetch(`http://localhost:8090/api/v1/tasks/${category}`)
      .then((response) => response.json())
      // eslint-disable-next-line no-console
      .catch((e) => console.error(e))
      .then(setTaskList)
    setRefresh(false)
  }, [category, refresh])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (newTask.length === 0) {
      setErrorName(true)
      return
    }
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({ title: `${newTask}` })

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

    setNewTask('')
    setRefresh(true)
    setErrorName(false)
  }

  return (
    <div>
      <Header category={category} />
      <NewTask
        newTask={newTask}
        setNewTask={setNewTask}
        handleSubmit={handleSubmit}
        error={errorName}
      />
      <div className="w-full flex flex-wrap flex-col items-center bg-white sm:flex-row sm:justify-around">
        {taskList.map((task) => {
          return (
            <CategoryCard
              key={task.taskId}
              task={task}
              category={category}
              setRefresh={setRefresh}
            />
          )
        })}
      </div>
      <NewTask
        newTask={newTask}
        setNewTask={setNewTask}
        handleSubmit={handleSubmit}
        error={errorName}
      />
    </div>
  )
}
