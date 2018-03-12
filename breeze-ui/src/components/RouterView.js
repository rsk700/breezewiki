import React from 'react'
import _ from 'lodash'
import routes from '../routes'

const RouterView = ({path, params, isAuth, initRoute}) => {
  if (path === null) {
    initRoute();
    return (
      <div>Loading...</div>
    );
  }
  // if (!isAuth) {
  //   path = 'login'
  //   params = {}
  // }
  let matchedRoute = _.find(routes.routes, r => r.path === path)
  // if (_.isUndefined(matchedRoute)) {
  //   matchedRoute = _.find(routes.routes, r => r.path === routes.default.path);
  //   params = routes.default.params;
  // }
  return matchedRoute.view(params);
}

export default RouterView
