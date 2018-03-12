import React from 'react'
import Login from './containers/Login'
import Page from './containers/Page'
import PageContainerView from './components/PageContainerView'
import ActivePageHistory from './containers/ActivePageHistory'
import AccountInfo from './containers/AccountInfo'

function login() {
  return (
    <Login />
  )
}

function page() {
  return (
    <PageContainerView>
      <Page />
    </PageContainerView>
  );
}

function pageHistory() {
  return (
    <PageContainerView>
      <ActivePageHistory />
    </PageContainerView>
  );
}

function account() {
  return (
    <PageContainerView>
      <AccountInfo />
    </PageContainerView>
  );
}

const routes = {
  routes: [
    {path: '/login', view: login, auth: false},
    {path: '/page/:id', view: page, auth: true},
    {path: '/page/:id/history', view: pageHistory, auth: true},
    {path: '/account', view: account, auth: true},
    {path: '/', view: page, auth: true},
  ]
}

export default routes
