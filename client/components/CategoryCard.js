import React, { useState, useEffect } from 'react'

import TaskButton from './TaskButton'

export default function CategoryCard({ task, category, setRefresh }) {
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

  const handleDelete = (e) => {
    e.preventDefault()

    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    }

    fetch(`http://localhost:8090/api/v1/tasks/${category}/${task.taskId}`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error))
    setRefresh(true)
  }

  return (
    <div className="my-1 px-1 w-full sm:w-2/3 md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
      <article className="overflow-hidden rounded-lg shadow-lg">
        <span>
          <img
            alt="Placeholder"
            className="block w-full h-48 bg-teal-100"
            src="https://picsum.photos/600/300/?random"
          />
        </span>
        <header className="flex items-center justify-between leading-tight p-2 md:p-4">
          <h2 className="text-lg">
            <span className="text-black">{task.title}</span>
          </h2>
          <p className="text-grey-darker text-sm">status: {status}</p>
        </header>
        <footer className="flex items-center justify-between h-16 leading-none p-2 md:p-4">
          <TaskButton status={status} setStatus={setStatus} handleDelete={handleDelete} />
        </footer>
      </article>
    </div>
  )
}
