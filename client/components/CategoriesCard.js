import React from 'react'
import { Link } from 'react-router-dom'

export default function CategoriesCard({ category }) {
  return (
    <div className="relative max-w-lg bg-white w-full m-4 rounded shadow-xl sm:w-5/12 lg:w-3/12">
      <Link to={`/${category}`} className="m-auto">
        <article className="flex flex-col overflow-hidden rounded shadow bg-white">
          <span className="flex placeholder-image block w-full h-48">
            <h2 className="font-bold md:text-3xl lg:text-4xl text-white m-auto">{category}</h2>
          </span>
          {/* <div className="px-6 py-4">
            <div className="flex justify-between items-center overflow-hidden px-3 py-4">
              Open category
            </div>
          </div> */}
          <p className="m-auto text-grey-darker text-base">Preview of tasks in this list</p>
        </article>
      </Link>
    </div>
  )
}
