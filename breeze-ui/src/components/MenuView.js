import React from 'react'
import './MenuView.css'
import Link from '../containers/Link'

const MenuView = () => {
  return (
    <div className="menu-icon">
      <Link route="/">
        <span className="glyphicon glyphicon-home"></span>
      </Link>
    </div>
  )
}

export default MenuView;
