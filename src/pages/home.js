// frontend/src/pages/Home.js
// This is the public home/landing page (unauthenticated).
// It serves as a "Get Started" page, with info about the platform and buttons to login/register.
// Place it at root '/' in App.js routing (unprotected).

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to Social Coding Platform</h1>
      <p>A place to share, view, like, and collaborate on coding projects.</p>
      <p>Get started by creating an account or logging in.</p>
      <Link to="/register">
        <button style={{ marginRight: '10px' }}>Get Started (Register)</button>
      </Link>
      <Link to="/login">
        <button>Login</button>
      </Link>
    </div>
  );
};

export default Home;