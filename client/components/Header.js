import React from 'react'
import { history } from '../redux'

export default function Header({ category }) {
  return (
    <div>
      <div className="flex max-w-screen-xl px-8 py-4 mb-8 mx-auto items-center justify-between flex-row">
        {!category && (
          <div className="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg">
            Task manager
          </div>
        )}
        {category && (
          <>
            <div className="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg">
              {category}
            </div>
            <nav className="flex justify-end flex-row">
              <button
                type="button"
                id="go-back"
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-900 bg-gray-200 rounded md:mt-0 hover:text-white hover:bg-indigo-500 active:bg-indigo-700 transition duration-150 ease-in-out"
                onClick={() => history.push('/')}
              >
                back to Categories
              </button>
            </nav>
          </>
        )}
      </div>
    </div>
  )
}
