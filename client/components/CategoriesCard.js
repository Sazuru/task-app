import React from 'react'
import { Link } from 'react-router-dom'

export default function CategoriesCard({ category }) {
  return (
    <div className="relative max-w-lg bg-white w-full mb-4 mr-4 rounded shadow-xl sm:w-5/12 lg:w-3/12">
      <article className="overflow-hidden rounded shadow bg-white">
        <span className="placeholder-image block w-full h-48" />
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
