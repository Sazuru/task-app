import React from 'react'
import { Link, useParams } from 'react-router-dom'

export default function CategorySort({ category }) {
  const { timespan } = useParams()
  return (
    <div className="flex flex-wrap flex-col w-full items-end bg-white">
      <ul className="flex w-full justify-center sm:justify-end">
        <li className="mr-6">
          <Link
            to={`/${category}/all`}
            className={`${timespan === 'all' ? 'text-blue-900' : 'text-blue-500'} `}
          >
            All
          </Link>
        </li>
        <li className="mr-6">
          <Link
            to={`/${category}/day`}
            className={`${timespan === 'day' ? 'text-blue-900' : 'text-blue-500'} `}
          >
            Day
          </Link>
        </li>
        <li className="mr-6">
          <Link
            to={`/${category}/week`}
            className={`${timespan === 'week' ? 'text-blue-900' : 'text-blue-500'} `}
          >
            Week
          </Link>
        </li>
        <li className="mr-6">
          <Link
            to={`/${category}/month`}
            className={`${timespan === 'month' ? 'text-blue-900' : 'text-blue-500'} `}
          >
            Month
          </Link>
        </li>
      </ul>
    </div>
  )
}
