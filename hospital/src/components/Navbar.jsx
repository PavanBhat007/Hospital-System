import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function Navbar({ isLoggedIn, logout }) {
  return (
    <header>
      <nav>
        <ul>
          <div className='left-section'>
            <li className='nav-brand'>
                <Link to="/"><h2 className='brand'>Medico Center</h2></Link>
            </li>
          </div>
          <div className='right-section'>
            {isLoggedIn ? (
              <>
                <li className="nav-links"><Link to="/">Home</Link></li>
                <li className="nav-links"><Link to="/services">Services</Link></li>
                <li className="nav-links"><Link to="/about">About</Link></li>
                <li className="nav-links"><Link to="/contact">Contact</Link></li>
                <li><button className='btn btn-logout' onClick={logout}>Log Out</button></li>
              </>
            ) : (
              <>
                <li className="btn btn-login"><Link to="/login">Login</Link></li>
                <li className="btn btn-signup"><Link to="/signup">Sign Up</Link></li>
              </>
            )}
          </div>
        </ul>
      </nav>
    </header>
  );
}

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
};