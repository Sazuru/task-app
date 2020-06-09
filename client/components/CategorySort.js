import React from 'react'

export default function CategorySort() {
  return (
    <div className="flex flex-wrap flex-col w-full items-end bg-white">
      <ul className="flex w-full justify-center sm:justify-end">
        <li className="mr-6">
          <a className="text-blue-500 hover:text-blue-800" href="#">
            All
          </a>
        </li>
        <li className="mr-6">
          <a className="text-blue-500 hover:text-blue-800" href="#">
            Day
          </a>
        </li>
        <li className="mr-6">
          <a className="text-blue-500 hover:text-blue-800" href="#">
            Week
          </a>
        </li>
        <li className="mr-6">
          <a className="text-blue-500 hover:text-blue-800" href="#">
            Month
          </a>
        </li>
      </ul>
    </div>
  )
}
