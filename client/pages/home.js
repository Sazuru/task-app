import React, { useState, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'

import Categories from './Categories'
import Category from './Category'
import NotFound from './404'

const Home = () => {
  const [categories, setCategories] = useState([])
  const [refresh, setRefresh] = useState(false)

  // fetch list of categories
  useEffect(() => {
    fetch(`/api/v2/categories`)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then(setCategories)
  }, [refresh])

  return (
    <div className="background w-full h-full">
      <Switch>
        <Route
          exact
          path="/"
          component={() => <Categories categories={categories} setRefresh={setRefresh} />}
        />
        <Route
          exact
          path={['/:category/:timespan', '/:category']}
          component={() => <Category refresh={refresh} setRefresh={setRefresh} />}
        />
        <Route component={() => <NotFound />} />
      </Switch>
    </div>
  )
}

Home.propTypes = {}

export default Home
