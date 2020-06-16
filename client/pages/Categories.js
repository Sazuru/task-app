import React, { useState } from 'react'
import shortid from 'shortid'

import Header from '../components/Header'
import CategoriesCard from '../components/CategoriesCard'
import NewTask from '../components/NewTask'

export default function Categories({ categories, setRefresh }) {
  const [newCategory, setNewCategory] = useState('')
  const [errorName, setErrorName] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (newCategory.trim().length === 0) {
      setErrorName(true)
      return
    }
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow'
    }

    fetch(`/api/v2/tasks/${newCategory}`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error))

    setNewCategory('')
    setRefresh(true)
    setErrorName(false)
  }

  return (
    <div>
      <Header />
      <NewTask
        newTask={newCategory}
        setNewTask={setNewCategory}
        handleSubmit={handleSubmit}
        error={errorName}
        value="Category"
      />
      <div className="h-full flex flex-wrap flex-col items-center mb-4 mx-4 sm:flex-row sm:justify-around">
        {categories.map((category) => {
          return <CategoriesCard key={shortid.generate()} category={category} />
        })}
      </div>
      {categories.length > 3 && (
        <NewTask
          newTask={newCategory}
          setNewTask={setNewCategory}
          handleSubmit={handleSubmit}
          error={errorName}
          value="Category"
        />
      )}
    </div>
  )
}
