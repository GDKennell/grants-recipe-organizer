/* eslint-disable react/prop-types */
import React from 'react';
import {Link, Outlet} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import {recipeConversionRoute, routeToTitle} from '../App';

// Docs for all Bootstrap Navbar stuff:
// https://getbootstrap.com/docs/5.3/components/navbar/
export default function Layout({allRoutes}) {
  return (
    <>
      <nav className="navbar navbar-expand-md bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand text-white" aria-current="page" to={`/${recipeConversionRoute}`}>Recipe Converter</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {allRoutes.map((routeName) =>
                <li key={routeName} className="nav-item">
                  <Link className="nav-link active text-white" aria-current="page" to={`/${routeName}`}>{routeToTitle[routeName]}</Link>
                </li>,
              )}
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
