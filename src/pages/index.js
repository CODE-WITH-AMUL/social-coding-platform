import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Index = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="landing-page">
      {/* Enhanced CSS with Modern Animations */}
      <style>{`
        .landing-page {
          min-height: 100vh;
          background: 
            linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f172a 75%, #000 100%);
          color: white;
          font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* Animated Background Elements */
        .landing-page::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.03) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        /* Floating Orbs */
        .floating-orbs {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.05));
          backdrop-filter: blur(1px);
          animation: float-orb 20s infinite ease-in-out;
        }

        .orb:nth-child(1) {
          width: 300px;
          height: 300px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .orb:nth-child(2) {
          width: 200px;
          height: 200px;
          top: 60%;
          right: 10%;
          animation-delay: 7s;
        }

        .orb:nth-child(3) {
          width: 150px;
          height: 150px;
          bottom: 20%;
          left: 20%;
          animation-delay: 14s;
        }

        /* Navigation Bar with Glassmorphism */
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          padding: 1rem 2rem;
          background: ${isScrolled ? 'rgba(0, 0, 0, 0.8)' : 'transparent'};
          backdrop-filter: ${isScrolled ? 'blur(20px) saturate(180%)' : 'none'};
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          z-index: 1000;
          border-bottom: ${isScrolled ? '1px solid rgba(255,255,255,0.1)' : 'none'};
        }

        .nav-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
          position: relative;
          transition: all 0.3s ease;
        }

        .logo::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transition: width 0.3s ease;
        }

        .logo:hover::after {
          width: 100%;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .nav-link {
          color: #e2e8f0;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          padding: 0.5rem 1rem;
          border-radius: 12px;
          position: relative;
          overflow: hidden;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .nav-link:hover::before {
          left: 100%;
        }

        .nav-link:hover {
          color: #3b82f6;
          transform: translateY(-2px);
        }

        /* Enhanced Buttons */
        .btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          padding: 1rem 2.5rem;
          border-radius: 16px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s ease;
        }

        .btn-primary:hover::before {
          left: 100%;
        }

        .btn-primary:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.4);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          color: #e2e8f0;
          padding: 1rem 2.5rem;
          border-radius: 16px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border: 2px solid rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .btn-secondary:hover {
          border-color: #3b82f6;
          color: #3b82f6;
          transform: translateY(-4px) scale(1.05);
          background: rgba(59, 130, 246, 0.1);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2);
        }

        /* Hero Section with Advanced Animations */
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 6rem 2rem 2rem;
          position: relative;
          z-index: 10;
        }

        .hero-content {
          max-width: 900px;
          z-index: 2;
          animation: fadeInUp 1.2s ease-out;
        }

        .hero-title {
          font-size: 5rem;
          font-weight: 900;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #ffffff 0%, #3b82f6 25%, #8b5cf6 50%, #10b981 75%, #ffffff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 300% 300%;
          animation: gradient-shift 8s ease infinite, titleGlow 2s ease-in-out infinite alternate;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .hero-subtitle {
          font-size: 1.4rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin-bottom: 3rem;
          animation: fadeInUp 1.2s ease-out 0.3s both;
          font-weight: 400;
        }

        .cta-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          margin-bottom: 4rem;
          animation: fadeInUp 1.2s ease-out 0.6s both;
        }

        /* Features Section with Staggered Animations */
        .features-section {
          padding: 8rem 2rem;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          position: relative;
          z-index: 10;
        }

        .section-title {
          text-align: center;
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #ffffff 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: ${isVisible.features ? '1' : '0'};
          transform: ${isVisible.features ? 'translateY(0)' : 'translateY(50px)'};
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .section-subtitle {
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.3rem;
          margin-bottom: 5rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          opacity: ${isVisible.features ? '1' : '0'};
          transform: ${isVisible.features ? 'translateY(0)' : 'translateY(30px)'};
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 3rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem 2rem;
          text-align: center;
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
          opacity: ${isVisible.features ? '1' : '0'};
          transform: ${isVisible.features ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.9)'};
        }

        .feature-card:nth-child(1) { transition-delay: 0.1s; }
        .feature-card:nth-child(2) { transition-delay: 0.3s; }
        .feature-card:nth-child(3) { transition-delay: 0.5s; }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 24px;
        }

        .feature-card:hover::before {
          opacity: 1;
        }

        .feature-card:hover {
          transform: translateY(-20px) scale(1.05);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
        }

        .feature-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          display: inline-block;
          animation: bounce 2s ease-in-out infinite;
          position: relative;
          z-index: 1;
        }

        .feature-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .feature-description {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
          font-size: 1.1rem;
          position: relative;
          z-index: 1;
        }

        /* Stats Section with Counter Animation */
        .stats-section {
          padding: 6rem 2rem;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
          backdrop-filter: blur(10px);
          position: relative;
          z-index: 10;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .stat-item {
          padding: 2rem;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.4s ease;
        }

        .stat-item:hover {
          transform: translateY(-10px);
          background: rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .stat-item h3 {
          font-size: 4rem;
          font-weight: 900;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
          animation: countUp 2s ease-out;
        }

        .stat-item p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.3rem;
          font-weight: 500;
        }

        /* Footer Enhancement */
        .footer {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(20px);
          padding: 6rem 2rem 3rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          z-index: 10;
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 4rem;
          margin-bottom: 3rem;
        }

        .footer-section h3 {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1.5rem;
          font-size: 1.4rem;
          font-weight: 700;
        }

        .footer-links {
          list-style: none;
          padding: 0;
        }

        .footer-links li {
          margin-bottom: 1rem;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
        }

        .footer-links a::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transition: width 0.3s ease;
        }

        .footer-links a:hover::after {
          width: 100%;
        }

        .footer-links a:hover {
          color: #3b82f6;
          transform: translateX(10px);
        }

        /* Advanced Animations and Keyframes */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes titleGlow {
          0% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          100% { text-shadow: 0 0 30px rgba(139, 92, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.3); }
        }

        @keyframes float-orb {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes countUp {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          50% { box-shadow: 0 0 0 20px rgba(59, 130, 246, 0); }
        }

        /* Mobile Responsive Enhancements */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 3rem;
          }
          
          .hero-subtitle {
            font-size: 1.1rem;
          }
          
          .nav-links {
            display: none;
          }
          
          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .btn-primary, .btn-secondary {
            width: 100%;
            max-width: 320px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .feature-card {
            margin: 0 1rem;
          }
        }

        /* Performance Optimizations */
        * {
          box-sizing: border-box;
        }

        .feature-card, .stat-item, .btn-primary, .btn-secondary {
          will-change: transform;
        }
      `}</style>

      {/* Floating Orbs */}
      <div className="floating-orbs">
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-content">
          <Link to="/" className="logo">ProjectHub</Link>
          
          <div className="nav-links">
            <Link to="/#features" className="nav-link">Features</Link>
            <Link to="/#community" className="nav-link">Community</Link>
            <Link to="/#about" className="nav-link">About</Link>
            
            {user ? (
              <div className="auth-buttons">
                <Link to="/dashboard" className="btn-primary">Dashboard</Link>
                <button onClick={handleLogout} className="btn-secondary">Logout</button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn-secondary">Login</Link>
                <Link to="/register" className="btn-primary">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Where Creators Share & Collaborate
          </h1>
          <p className="hero-subtitle">
            A social platform where developers, designers, and innovators upload and showcase 
            their projects. Get feedback, find collaborators, and grow together in a community 
            built for makers, by makers.
          </p>
          
          <div className="cta-buttons">
            {user ? (
              <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary">Start Creating</Link>
                <Link to="/projects" className="btn-secondary">Explore Projects</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <h2 className="section-title">Why Choose ProjectHub?</h2>
        <p className="section-subtitle">
          Everything you need to showcase your work and connect with like-minded creators
        </p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3 className="feature-title">Showcase Your Work</h3>
            <p className="feature-description">
              Upload apps, tools, digital art, or code solutions with beautiful project pages. 
              Let the world see what you're building in a visually appealing format.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3 className="feature-title">Get Real Feedback</h3>
            <p className="feature-description">
              Receive constructive comments, likes, and suggestions from experienced developers 
              and designers to improve your projects and skills.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3 className="feature-title">Build Connections</h3>
            <p className="feature-description">
              Find collaborators, mentors, and friends. Join a network of passionate creators 
              who share your interests and ambitions.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" id="stats">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>10K+</h3>
            <p>Active Creators</p>
          </div>
          <div className="stat-item">
            <h3>25K+</h3>
            <p>Projects Shared</p>
          </div>
          <div className="stat-item">
            <h3>500K+</h3>
            <p>Community Interactions</p>
          </div>
          <div className="stat-item">
            <h3>1M+</h3>
            <p>Lines of Code</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="features-section">
        <div className="hero-content">
          <h2 className="section-title">Ready to Share Your Genius?</h2>
          <p className="section-subtitle">
            Join thousands of creators who are already building the future together
          </p>
          
          <div className="cta-buttons">
            {user ? (
              <Link to="/upload" className="btn-primary">Upload Your First Project</Link>
            ) : (
              <Link to="/register" className="btn-primary">Join ProjectHub Today</Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>ProjectHub</h3>
            <p style={{color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6'}}>
              A community-driven platform for creators to share, collaborate, and grow together.
            </p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/projects">Explore Projects</Link></li>
              <li><Link to="/#features">Features</Link></li>
              <li><Link to="/#community">Community</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Resources</h3>
            <ul className="footer-links">
              <li><Link to="/docs">Documentation</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/support">Support</Link></li>
              <li><Link to="/api">API</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Legal</h3>
            <ul className="footer-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ProjectHub. Built with ❤️ for the creator community.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;