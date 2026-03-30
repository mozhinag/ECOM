import React from 'react'
import {Spinner} from 'react-bootstrap'
const Loader = () => {
  return (
      <Spinner animation='border' status='role'
          style={{
              hieght: '100',
              width: '100',
              margin: 'auto',
              display:'block'

          }}></Spinner>
  )
}

export default Loader
