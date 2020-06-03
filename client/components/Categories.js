import React, { useState, useEffect } from 'react'
import shortid from 'shortid'
import { Link } from 'react-router-dom'

import Header from './Header'

export default function Categories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch(`http://localhost:8090/api/v1/tasks/categories`)
      .then((response) => response.json())
      // eslint-disable-next-line no-console
      .catch((e) => console.error(e))
      .then(setCategories)
  }, [])

  return (
    <div>
      <Header />
      <div className="h-screen w-full flex flex-wrap flex-col items-center bg-white sm:flex-row sm:justify-around">
        {categories.map((category) => {
          return (
            <div
              key={shortid.generate()}
              className="relative max-w-lg bg-white w-full mb-4 mr-4 shadow-xl sm:w-5/12 lg:w-3/12"
            >
              <img
                className="w-full"
                src="https://source.unsplash.com/random/600x300"
                alt="Sunset in the mountains"
              />
              <div className="px-6 py-4">
                <div className="flex justify-between overflow-hidden px-3 py-4">
                  <div className="font-bold text-xl mb-2">{category}</div>
                  <div>
                    <Link to={`/${category}`}>Open category</Link>
                  </div>
                </div>
              </div>
              <p className="text-grey-darker text-base">Preview of tasks in this list</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
