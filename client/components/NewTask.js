import React from 'react'

export default function NewTask({ newTask, setNewTask, handleSubmit, error }) {
  return (
    <div className="flex flex-col h-6 justify-center mx-auto sm:flex-row my-10">
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col mx-1 rounded overflow-hidden sm:flex-row">
          <input
            type="text"
            name="newTaskTitle"
            placeholder="New task"
            className="px-4 py-2 text-xs sm:text-sm font-semibold bg-gray-200 text-gray-800 border-gray-300 border-1 outline-none placeholder-gray-500 focus:bg-gray-100"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-4 py-2 text-xs sm:text-sm font-semibold bg-gray-700 text-gray-100 hover:bg-indigo-500 active:bg-indigo-700 transition duration-150 ease-in-out"
          >
            Add new task
          </button>
        </div>
        {error && (
          <span className="flex flex-col items-center text-xs sm:text-sm text-red-600">
            Task title cannot be empty
          </span>
        )}
      </form>
    </div>
  )
}
