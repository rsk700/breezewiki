import React from 'react'
import './PageContainerView.css'
import MenuView from './MenuView'

const PageContainerView = ({children}) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="menu-column">
            <div className="row">
              <div className="col-md-12">
                <MenuView />
              </div>
            </div>
          </div>
          <div className="page-column">
            <div className="row">
              <div className="col-md-12">
                { children }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="footer-wrapper">
            <footer>
              <div className="text-center footer-text">
                <a href="https://github.com/rsk700/breezewiki">BreezeWiki</a>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageContainerView;
