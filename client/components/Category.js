import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Header from './Header'
import TaskButton from './TaskButton'

export default function Category() {
  const { category } = useParams()
  const [taskList, setTaskList] = useState([])

  useEffect(() => {
    fetch(`http://localhost:8090/api/v1/tasks/${category}`)
      .then((response) => response.json())
      // eslint-disable-next-line no-console
      .catch((e) => console.error(e))
      .then(setTaskList)
  }, [category])
  return (
    <div>
      <Header category={category} />
      <div className="h-screen w-full flex flex-wrap flex-col items-center bg-white sm:flex-row sm:justify-around">
        {taskList.map((task) => {
          return (
            <div
              key={task.taskId}
              className="card relative h-32 max-w-lg bg-teal-200 w-full mb-4 mr-4 shadow-xl sm:w-5/12 lg:w-3/12"
            >
              <div className="flex justify-between overflow-hidden px-3 py-4">
                <div className="font-bold text-base tracking-widest">{task.title}</div>
                <div className="font-bold text-base tracking-widest">{task.status}</div>
                <TaskButton task={task} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
