/* eslint-disable prettier/prettier */
import React from 'react'

export default function TaskButton({ status, setStatus }) {
  if (status === 'new') {
    return (
      <button
        type="button"
        onClick={() => setStatus('in progress')}
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      >
        In progress
      </button>
    )
  }
  if (status === 'in progress') {
    return (
      <>
        <button
          type="button"
          onClick={() => setStatus('blocked')}
          className="bg-transparent hover:bg-red-500 text-gray-900 border border-red-500 hover:border-transparent font-semibold py-2 px-4 rounded"
        >
          Block
        </button>
        <button
          type="button"
          onClick={() => setStatus('done')}
          className="bg-transparent hover:bg-green-500 text-gray-900 border border-green-500 hover:border-transparent font-semibold py-2 px-4 rounded"
        >
          Done
        </button>
      </>
    )
  }
  if (status === 'blocked') {
    return (
      <button
        type="button"
        onClick={() => setStatus('in progress')}
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      >
        In progress
      </button>
    )
  }
  return (
    <div className="flex justify-between w-full bg-teal-100 rounded text-teal-900 px-4 py-2 shadow-md font-semibold">
      Task completed
      <button type="button" onClick={() => setStatus('in progress')}>
        <img className="h-3" src="images/back.svg" alt="return back" />
      </button>
    </div>
  )
}
