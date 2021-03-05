/* eslint-disable no-undef */
import React, { useReducer, createContext } from 'react'
import jwtDecode from 'jwt-decode'

const initialState = {
  user: null
}

if (localStorage.getItem('token')) {
  const decodedToken = jwtDecode(localStorage.getItem('token'))

  if (decodedToken.exp * 1000 < new Date()) {
    localStorage.removeItem('token')
    initialState.user = null
  } else {
    initialState.user = decodedToken
  }
}

const AuthContext = createContext({
  user: null,
  login: data => {},
  logout: () => {}
})

function authReducer (state = {}, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload }
    case 'LOGOUT':
      return { ...state, user: null }
    default:
      return state
  }
}

function AuthProvider (props) {
  const [state, dispatcher] = useReducer(authReducer, initialState)

  function login (userData) {
    // eslint-disable-next-line no-undef
    localStorage.setItem('token', userData.token)
    dispatcher({ type: 'LOGIN', payload: userData })
  }

  function logout () {
    // eslint-disable-next-line no-undef
    localStorage.removeItem('token')

    dispatcher({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  )
}

export {
  AuthContext,
  AuthProvider
}
