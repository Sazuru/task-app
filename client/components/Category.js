import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import Header from './Header'
import CategoryCard from './CategoryCard'

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
          return <CategoryCard key={task.taskId} task={task} category={category} />
        })}
      </div>
    </div>
  )
}
