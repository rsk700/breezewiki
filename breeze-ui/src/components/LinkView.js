import React from 'react'
import _ from 'lodash'

const LinkView = ({route, params, navigate, children, onClick}) => {
  function navigateToRoute(e) {
    if (_.isFunction(onClick)) {
      onClick();
    }
    navigate(route, params);
    e.preventDefault();
    e.stopPropagation();
  }
  return (
    <a href="" onClick={navigateToRoute}>
     { children }
    </a>
  )
}

export default LinkView
