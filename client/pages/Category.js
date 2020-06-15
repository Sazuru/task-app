import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import Header from '../components/Header'
import CategoryCard from '../components/CategoryCard'
import CategorySort from '../components/CategorySort'
import NewTask from '../components/NewTask'

export default function Category() {
  const { category } = useParams()
  const [taskList, setTaskList] = useState([])
  const [newTask, setNewTask] = useState('')
  const [refresh, setRefresh] = useState(false)
  const [errorName, setErrorName] = useState(false)

  useEffect(() => {
    fetch(`/api/v2/tasks/${category}`)
      .then((response) => response.json())
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

    fetch(`/api/v2/tasks/${category}`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error))

    setNewTask('')
    setRefresh(true)
    setErrorName(false)
  }

  // const handleSort = (timespan, event) => {
  //   fetch(`/api/v2/tasks/${category}/${timespan}`)
  //     .then((response) => response.json())
  //     .catch((e) => console.error(e))
  //     .then(setTaskList)
  //   setRefresh(false)
  //   // eslint-disable-next-line no-param-reassign
  //   event.target.className = addClassName
  // }

  return (
    <div>
      <Header category={category} />
      <CategorySort category={category} />
      <NewTask
        newTask={newTask}
        setNewTask={setNewTask}
        handleSubmit={handleSubmit}
        error={errorName}
      />
      {taskList.length === 0 ? (
        <p className="w-full h-10 text-xl flex flex-wrap flex-col my-8 items-center bg-white sm:flex-row sm:justify-around">
          Nothing here, add new task
        </p>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
