import React from 'react'

import { push } from 'connected-react-router'
import { useDispatch } from 'react-redux'

const NotFound = () => {
  const dispatch = useDispatch()
  return (
    <div className="container h-screen flex items-center justify-center m-auto">
      <div className="aligner-item text-center ">
        <h1 className="text-6xl">404</h1>
        <p className="lead text-gray-800 mb-5">Page Not Found</p>
        <p className="text-gray-500 mb-0">It looks like you found a glitch in the matrix...</p>
        <br />
        <button
          className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-900 bg-gray-200 rounded md:mt-0 hover:text-white hover:bg-indigo-500 active:bg-indigo-700 transition duration-150 ease-in-out"
          type="button"
          tabIndex="0"
          onClick={() => {
            dispatch(push('/'))
          }}
        >
          {' '}
          Back to Home
        </button>
      </div>
    </div>
  )
}

NotFound.propTypes = {}

NotFound.defaultProps = {}

export default NotFound
