import React from 'react'

export default function CategorySort({ handleSort }) {
  return (
    <div className="flex flex-wrap flex-col w-full items-end bg-white">
      <ul className="flex w-full justify-center sm:justify-end">
        <li className="mr-6">
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700"
            onClick={(e) => handleSort('all', e)}
          >
            All
          </button>
        </li>
        <li className="mr-6">
          <button
            type="button"
            className="text-blue-500 hover:text-blue-800"
            onClick={(e) => handleSort('day', e)}
          >
            Day
          </button>
        </li>
        <li className="mr-6">
          <button
            type="button"
            className="text-blue-500 hover:text-blue-800"
            onClick={(e) => handleSort('week', e)}
          >
            Week
          </button>
        </li>
        <li className="mr-6">
          <button
            type="button"
            className="text-blue-500 hover:text-blue-800"
            onClick={(e) => handleSort('month', e)}
          >
            Month
          </button>
        </li>
      </ul>
    </div>
  )
}
