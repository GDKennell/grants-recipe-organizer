import React from 'react';
import {Outlet, Link} from 'react-router-dom';
import {allRoutes} from '../App';

export default function Layout() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {allRoutes.map((routeName) => <li key={routeName}>
            <Link to={`/${routeName}`}>{routeName}</Link>
          </li>)}
        </ul>
      </nav>

      <Outlet />
    </>
  );
}
