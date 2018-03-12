import UrlPattern from 'url-pattern';

export function getMatchedRoute(url, routes) {
  let matched = null;
  let params = null;

  routes.some(route => {
    let pattern = new UrlPattern(route.path);
    params = pattern.match(url);
    if (params !== null) {
      matched = route;
      return true;
    }
    else {
      return false;
    }
  });

  if (matched === null) {
    return null;
  }
  else {
    return {
      route: matched,
      params: params
    }
  }
}

export function getUrlFromRoute(path, params) {
  let pattern = new UrlPattern(path);
  return pattern.stringify(params);
}
