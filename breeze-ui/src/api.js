import { Observable } from 'rxjs';

function serverError() {
  return Promise.reject({'error': 'Server connection error'});
}

function parseJson(response) {
  return response.json()
    .catch(() => Promise.reject({'error': 'Error parsing json data'}))
    .then(data => {
      if (response.ok) {
        return data;
      }
      else {
        return Promise.reject(data);
      }
    })
    ;
}

function postAuthToken(email, password) {
  // {token, user} - on success
  // {error} - on fail
  return fetch('/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })
    .catch(serverError)
    .then(parseJson)
    ;
}

function logout(token) {
  // {} - on success
  // {error} - on fail
  let encodedToken = encodeURIComponent(token);
  return fetch(`/api/auth/logout?token=${encodedToken}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: ''
    })
    .catch(serverError)
    .then(parseJson)
    ;
}

function getMe(token) {
  // user - on success
  // {error} - on fail
  let encodedToken = encodeURIComponent(token);
  return fetch(`/api/me?token=${encodedToken}`)
    .catch(serverError)
    .then(parseJson)
    ;
}

function getPagesById(token, id) {
  // page - on success
  // {error} - on fail
  let encodedToken = encodeURIComponent(token);
  let encodedId = encodeURIComponent(id);
  return fetch(`/api/pages/${encodedId}?token=${encodedToken}`)
    .catch(serverError)
    .then(parseJson)
    ;
}

function getPagesByTitle(token, title) {
  // page - on success
  // {error} - on fail
  let encodedToken = encodeURIComponent(token);
  let encodedTitle = encodeURIComponent(title);
  return fetch(`/api/pages/title/${encodedTitle}?token=${encodedToken}`)
    .catch(serverError)
    .then(parseJson)
    ;
}

function getPagesByIdDiffs(token, id, cursor) {
  // { diffs, next } - on success
  // { error } - on fail
  let encodedToken = encodeURIComponent(token);
  let encodedId = encodeURIComponent(id);
  let url;
  if (cursor === null) {
    url = `/api/pages/${encodedId}/diffs?token=${encodedToken}`;
  }
  else {
    let encodedCursor = encodeURIComponent(cursor);
    url = `/api/pages/${encodedId}/diffs?token=${encodedToken}&next=${encodedCursor}`;
  }
  return fetch(url)
    .catch(serverError)
    .then(parseJson)
    ;
}

function putPagesById(token, id, diffId, text) {
  // page - on success
  // {error} - on fail
  let encodedToken = encodeURIComponent(token);
  let encodedId = encodeURIComponent(id);
  return fetch(`/api/pages/${encodedId}?token=${encodedToken}`, {
    // todo: check REST recomendations, maybe use PATCH instead of PUT
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({diff_id: diffId, text: text})
    })
    .catch(serverError)
    .then(parseJson)
    ;
}

function postPages(token, title, text) {
  // page - on success
  // {error} - on fail
  let encodedToken = encodeURIComponent(token);
  return fetch(`/api/pages?token=${encodedToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title: title, text: text})
    })
    .catch(serverError)
    .then(parseJson)
    ;
}

export default {
  postAuthToken$: (email, password) => Observable.fromPromise(postAuthToken(email, password)),
  logout$: token => Observable.fromPromise(logout(token)),
  getMe$: (token) => Observable.fromPromise(getMe(token)),
  getPagesById$: (token, id) => Observable.fromPromise(getPagesById(token, id)),
  getPagesByTitle$: (token, title) => Observable.fromPromise(getPagesByTitle(token, title)),
  getPagesByIdDiffs$: (token, id, cursor) => Observable.fromPromise(getPagesByIdDiffs(token, id, cursor)),
  putPagesById$: (token, id, diffId, text) => Observable.fromPromise(putPagesById(token, id, diffId, text)),
  postPages$: (token, title, text) => Observable.fromPromise(postPages(token, title, text))
};
