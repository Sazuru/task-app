import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function Category() {
  const { category } = useParams()
  const [taskList, setTaskList] = useState([])
  console.log(taskList)

  useEffect(() => {
    fetch(`http://localhost:8090/api/v1/tasks/${category}`)
      .then((response) => response.json())
      // eslint-disable-next-line no-console
      .catch((e) => console.error(e))
      .then(setTaskList)
  }, [category])
  return (
    <div>
      {taskList.map((task) => {
        return (
          <div key={task.taskId}>
            {task.title}
            {task.status}
          </div>
        )
      })}
    </div>
  )
}
