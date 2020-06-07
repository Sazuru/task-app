import React, { useState, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'

import Categories from './Categories'
import Category from './Category'
import NotFound from './404'

const Home = () => {
  const [categories, setCategories] = useState([])

  // fetch list of categories
  useEffect(() => {
    fetch(`http://localhost:8090/api/v1/tasks/categories`)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then(setCategories)
  }, [])

  return (
    <div className="background w-full h-full">
      <Switch>
        <Route
          exact
          path={'/' || '/categories'}
          component={() => <Categories categories={categories} />}
        />
        <Route exact path="/:category" component={() => <Category />} />
        <Route component={() => <NotFound />} />
      </Switch>
    </div>
  )
}

Home.propTypes = {}

export default Home
