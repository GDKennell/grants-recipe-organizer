import React from 'react';
import {Outlet} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import {allRoutes, routeToTitle} from '../App';
// import {Outlet, Link} from 'react-router-dom';
// import {allRoutes} from '../App';

// Docs for all Bootstrap Navbar stuff:
// https://getbootstrap.com/docs/5.3/components/navbar/
export default function Layout() {
  return (
    <>
      <nav className="navbar navbar-expand-md bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Navbar</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {allRoutes.map((routeName) =>
                <li key={routeName} className="nav-item">
                  <a className="nav-link active" aria-current="page" href={`/${routeName}`}>{routeToTitle[routeName]}</a>
                </li>,
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/*
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {allRoutes.map((routeName) => <li key={routeName}>
            <Link to={`/${routeName}`}>{routeName}</Link>
          </li>)}
        </ul> */}

      <Outlet />
    </>
  );
}
