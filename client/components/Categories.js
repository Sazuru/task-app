import React, { useState, useEffect } from 'react'
import shortid from 'shortid'

import Header from './Header'
import CategoriesCard from './CategoriesCard'

export default function Categories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch(`http://localhost:8090/api/v1/tasks/categories`)
      .then((response) => response.json())
      // eslint-disable-next-line no-console
      .catch((e) => console.error(e))
      .then(setCategories)
  }, [])

  return (
    <div>
      <Header />
      <div className="flex flex-wrap flex-col items-center bg-white mb-4 mx-4 sm:flex-row sm:justify-around">
        {categories.map((category) => {
          return <CategoriesCard key={shortid.generate()} category={category} />
        })}
      </div>
    </div>
  )
}
