import React from 'react'
import { Link } from 'react-router-dom'
// import PropTypes from 'prop-types'

export const PageNotFound = props => {
  return (
    <div className='page-not-found'>
      <h1>ops it seems that this page does not exists</h1>
      <Link className='link' to='/'> Go To Home Instead</Link>
    </div>
  )
}

PageNotFound.propTypes = {}
