import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { AuthContext } from '../contexts/auth'

export const MenuBar = () => {
  const { user, logout } = useContext(AuthContext)

  const pathname = window.location.pathname
  const path = pathname === '/' ? 'home' : pathname.substr(1)

  const [activeItem, setActiveItem] = useState(path)

  const handleItemClick = (_, { name }) => setActiveItem(name)

  const menuBar = user
    ? (
      <Menu pointing secondary size='massive' color='teal'>
        <Menu.Item
          name={user.username}
          as={Link}
          to='/'
          active
        />
        <Menu.Menu position='right'>
          <Menu.Item
            name='logout'
            active={activeItem === 'logout'}
            onClick={logout}
            as={Link}
            to='/'
          />
        </Menu.Menu>
      </Menu>
      )
    : (
      <Menu pointing secondary size='massive' color='teal'>
        <Menu.Item
          name='home'
          active={activeItem === 'home'}
          as={Link}
          to='/'
          onClick={handleItemClick}
        />
        <Menu.Menu position='right'>
          <Menu.Item
            name='login'
            active={activeItem === 'login'}
            onClick={handleItemClick}
            as={Link}
            to='/login'
          />
          <Menu.Item
            name='register'
            active={activeItem === 'register'}
            onClick={handleItemClick}
            as={Link}
            to='/register'
          />
        </Menu.Menu>
      </Menu>
      )

  return menuBar
}
