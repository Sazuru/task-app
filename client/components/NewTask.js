import React from 'react'

export default function NewTask({ newTask, setNewTask, handleSubmit }) {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Новая задача"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit">Добавить</button>
      </form>
    </div>
  )
}
