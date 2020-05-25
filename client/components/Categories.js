import React, { useState, useEffect } from 'react'
import shortid from 'shortid'

export default function Categories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch(`http://localhost:8090/api/v1/categories`)
      .then((response) => response.json())
      // eslint-disable-next-line no-console
      .catch((e) => console.error(e))
      .then(setCategories)
  }, [])

  return (
    <div>
      {categories.map((category) => {
        return <div key={shortid.generate()}>{category}</div>
      })}
    </div>
  )
}
