import React from 'react'
import { Link } from 'react-router-dom'

export default function CategoriesCard({ category }) {
  return (
    <div className="relative max-w-lg bg-white w-full mb-4 mr-4 shadow-xl sm:w-5/12 lg:w-3/12">
      <article className="overflow-hidden rounded shadow">
        <span>
          <img
            className="w-full h-40 bg-teal-100"
            src="https://source.unsplash.com/random/600x300"
            alt="Placeholder"
          />
        </span>
        <div className="px-6 py-4">
          <div className="flex justify-between overflow-hidden px-3 py-4">
            <div className="font-bold text-xl mb-2">{category}</div>
            <div>
              <Link to={`/${category}`}>Open category</Link>
            </div>
          </div>
        </div>
        <p className="text-grey-darker text-base">Preview of tasks in this list</p>
      </article>
    </div>
  )
}
