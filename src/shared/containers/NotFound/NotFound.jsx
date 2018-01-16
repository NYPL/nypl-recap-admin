import React from 'react';
import { Link } from 'react-router';

const NotFound = () => (
  <section className="page--not-found">
    <div>
      <h1>404</h1>
      <h2>We can't seem to find the page you are looking for.</h2>
      <h3>Here are some helpful links:</h3>
      <p>
        <Link to="/dashboard">Dashboard</Link>
      </p>
    </div>
  </section>
);

export default NotFound;
