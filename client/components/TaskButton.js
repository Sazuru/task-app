/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function TaskButton({ task }) {
  const { category } = useParams()
  const [status, setStatus] = useState(task.status)

  useEffect(() => {
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({ status })

    const requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    }

    fetch(`http://localhost:8090/api/v1/tasks/${category}/${task.taskId}`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error))
  }, [category, status, task.taskId])

  if (status === 'new') {
    return (
      <button type="button" onClick={() => setStatus('in progress')}>
        In progress
      </button>
    )
  }
  if (status === 'in progress') {
    return (
      <>
        <button type="button" onClick={() => setStatus('blocked')}>
          Blocked
        </button>
        <button type="button" onClick={() => setStatus('done')}>
          Done
        </button>
      </>
    )
  }
  if (status === 'blocked') {
    return (
      <button type="button" onClick={() => setStatus('in progress')}>
        In progress
      </button>
    )
  }
}
