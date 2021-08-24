import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
      
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
        >
          Weighted Voting System
        </a>
        <ul className="navbar-nav mr-auto" style={{marginLeft: 30}}>
          <li className="navbar-item">
            <Link to="/" className="nav-link">Chairman's Page</Link>
          </li>
          <li className="navbar-item">
            <Link to="/votersloginpage" className="nav-link">Voter's Page</Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white"><span id="account">{this.props.account}</span></small>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;