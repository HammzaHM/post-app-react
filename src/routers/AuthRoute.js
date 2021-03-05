import React, { useContext } from 'react'
import { elementType } from 'prop-types'
import { Redirect, Route } from 'react-router-dom'

import { AuthContext } from '../contexts/auth'

export const AuthRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext)

  return (
    <Route
      {...rest}
      render={props => user ? <Redirect to='/' /> : <Component {...props} />}
    />
  )
}

AuthRoute.propTypes = {
  component: elementType.isRequired
}
