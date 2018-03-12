import React from 'react'

const LogoutView = ({logout}) => {
  return (
    <button className="btn btn-link" onClick={logout}>Logout</button>
  );
}

export default LogoutView;
