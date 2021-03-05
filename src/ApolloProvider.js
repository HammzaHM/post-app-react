import React from 'react'
import { ApolloClient, InMemoryCache, ApolloProvider as Provider, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import App from './App'

const authLink = setContext((_, { headers }) => {
  // eslint-disable-next-line no-undef
  const token = localStorage.getItem('token')

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const appLink = createHttpLink({
  uri: 'https://shrouded-refuge-21262.herokuapp.com'
})

const client = new ApolloClient({
  link: authLink.concat(appLink),
  cache: new InMemoryCache()
})

const ApolloProvider = () => (
  <Provider client={client}>
    <App />
  </Provider>
)

export default ApolloProvider
