import React from 'react';
import PropTypes from 'prop-types';
import './Navbar.scss';

function Navbar(props: any) {
  return (
    <div id="navbar-component">
      <nav className="navbar">
        <ul className="navbar__list">
          <li className="navbar__item">
            <div>
              Swap Modules
            </div>
          </li>
        </ul>
      </nav>
    </div>
  )
}

Navbar.propTypes = {}

export default Navbar
