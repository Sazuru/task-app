import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Categories from './Categories'
import Category from './Category'
import NotFound from './404'

const Home = () => {
  return (
    <div>
      <Switch>
        <Route exact path={'/' || '/categories'} component={() => <Categories />} />
        <Route exact path="/:category" component={() => <Category />} />
        <Route component={() => <NotFound />} />
      </Switch>
    </div>
  )
}

Home.propTypes = {}

export default Home
