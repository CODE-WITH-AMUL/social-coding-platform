// frontend/src/pages/Index.js
// This is the public get started/landing page (unauthenticated).
// It serves as the root '/' page, with info about the platform and buttons to login/register.
// I've made it similar to the previous Home.js you had for the landing page.

import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
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

export default Index;