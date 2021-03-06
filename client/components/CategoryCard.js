import React, { useState, useEffect, useRef } from 'react'

import TaskButton from './TaskButton'
import InlineEdit from './InlineEdit'

export default function CategoryCard({ task, category, setRefresh }) {
  const [status, setStatus] = useState(task.status)
  const [storedTitle, setStoredTitle] = useState(task.title)

  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false // it's no longer the first render
      return // skip the code below
    }

    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({ status, title: storedTitle })

    const requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    }

    fetch(`/api/v2/tasks/${category}/${task.taskId}`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error))
  }, [category, status, task.taskId, storedTitle])

  const handleDelete = (e) => {
    e.preventDefault()

    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    }

    fetch(`/api/v2/tasks/${category}/${task.taskId}`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error))
    setRefresh(true)
  }

  return (
    <div className="my-1 px-1 w-full sm:w-2/3 md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
      <article className="relative overflow-hidden rounded-lg shadow-lg">
        <span className="flex block w-full h-48 placeholder-image">
          <h2 className="font-bold md:text-3xl lg:text-4xl text-white m-auto">
            <InlineEdit text={storedTitle} onSetText={(text) => setStoredTitle(text)} />
          </h2>
        </span>
        <header className="flex items-center justify-between leading-tight p-2 md:p-4">
          <p className="m-auto text-grey-darker text-sm">status: {status}</p>
        </header>
        <footer className="flex items-center justify-between h-16 leading-none p-2 md:p-4">
          <TaskButton status={status} setStatus={setStatus} handleDelete={handleDelete} />
        </footer>
        <button
          type="button"
          onClick={(e) => handleDelete(e)}
          className="button-transform absolute top-0 right-0 my-2 mx-3"
        >
          <span role="img" aria-label="Delete task button">
            ❌
          </span>
        </button>
      </article>
    </div>
  )
}
