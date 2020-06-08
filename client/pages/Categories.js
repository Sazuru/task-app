import React from 'react'
import shortid from 'shortid'

import Header from '../components/Header'
import CategoriesCard from '../components/CategoriesCard'

export default function Categories({ categories }) {
  return (
    <div>
      <Header />
      <div className="h-full flex flex-wrap flex-col items-center mb-4 mx-4 sm:flex-row sm:justify-around">
        {categories.map((category) => {
          return <CategoriesCard key={shortid.generate()} category={category} />
        })}
      </div>
    </div>
  )
}
