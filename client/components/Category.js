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
            <div key={task.taskId} className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
              <article className="overflow-hidden rounded-lg shadow-lg">
                <span>
                  <img
                    alt="Placeholder"
                    className="block w-full"
                    src="https://picsum.photos/600/300/?random"
                  />
                </span>
                <header className="flex items-center justify-between leading-tight p-2 md:p-4">
                  <h1 className="text-lg">
                    <a className="no-underline hover:underline text-black" href="#">
                      {task.title}
                    </a>
                  </h1>
                  <p className="text-grey-darker text-sm">11/1/19</p>
                </header>
                <footer className="flex items-center justify-between leading-none p-2 md:p-4">
                  <TaskButton task={task} />
                </footer>
              </article>
            </div>
          )
        })}
      </div>
    </div>
  )
}
