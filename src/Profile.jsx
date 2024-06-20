import React from 'react'
import Todo from './Todo'
import Airports from './Airports'

const Profile = () => {
  return (
    <div className='flex flex-row'>
      <Todo/>
      <Airports/>
    </div>
  )
}

export default Profile
