import React from 'react'
import './PageCommon.css'
import Logout from '../containers/Logout'


class AccountInfoView extends React.Component {
  render() {
    return (
      <div>
        <div className="page-title-wrapper">
          <h1 className="page-title">
            Account Info
          </h1>
        </div>
        <div>
          <div>User: { this.props.user.name }</div>
          <div><Logout /></div>
        </div>
      </div>
    );
  }
}

export default AccountInfoView;
