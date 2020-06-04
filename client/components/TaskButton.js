import React from 'react'
import { useParams } from 'react-router-dom'

export default function TaskButton({ task }) {
  const { category } = useParams()

  const changeStatus = async () => {
    const response = await fetch(`http://localhost:8090/api/v1/tasks/${category}/${task.taskId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'blocked' })
    })
    // eslint-disable-next-line no-return-await
    return await response.json()
  }

  return (
    <button type="button" onClick={() => changeStatus()}>
      {task.status === 'new' ? 'in progress' : task.status}
    </button>
  )
}
