import React from "react";

const Home = () => {
  return (
    <div>
      {/* CSS PART INSIDE */}
      <style>{`
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: linear-gradient(to right, #4facfe, #00f2fe);
        }

        .container {
          text-align: center;
          padding: 50px;
          color: white;
        }

        h1 {
          font-size: 3rem;
          margin-bottom: 20px;
        }

        p {
          font-size: 1.2rem;
          margin-bottom: 30px;
        }

        .btn {
          padding: 10px 20px;
          background: white;
          color: #4facfe;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn:hover {
          background: #4facfe;
          color: white;
          transform: scale(1.05);
        }
      `}</style>

      {/* PAGE CONTENT */}
      <div className="container">
        <h1>Welcome to My Simple React Website</h1>
        <p>This is a React component with CSS written inside.</p>
        <button className="btn">Click Me</button>
      </div>
    </div>
  );
};

export default Home;
