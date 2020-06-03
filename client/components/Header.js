import React from 'react'
import { history } from '../redux'

export default function Header() {
  return (
    <div>
      <div className="flex max-w-screen-xl px-8 py-4 mx-auto md:items-center md:justify-between md:flex-row">
        <nav className="flex-grow pb-4 md:pb-0 flex justify-end flex-row">
          <button
            type="button"
            id="go-back"
            className="px-4 py-2 mt-2 mr-2 text-sm font-semibold text-gray-900 bg-gray-200 rounded-lg dark-mode:bg-gray-700 dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-white hover:bg-indigo-500 focus:text-white focus:bg-indigo-600 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
            onClick={() => history.push('/')}
          >
            back to Home
          </button>{' '}
        </nav>
      </div>
    </div>
  )
}
