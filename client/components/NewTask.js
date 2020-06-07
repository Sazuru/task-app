import React from 'react'

export default function NewTask({ newTask, setNewTask, handleSubmit }) {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="New task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit">Add new task</button>
      </form>
    </div>
  )
}
