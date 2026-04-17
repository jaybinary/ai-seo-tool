import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img src="/logo.png" alt="PageIQ" className="footer-logo-img" />
            <span className="footer-logo-fallback">PageIQ</span>
          </Link>
          <p className="footer-tagline">AI-powered SEO intelligence for the modern web.</p>
          <div className="footer-badges">
            <span className="footer-badge">11 AI Skills</span>
            <span className="footer-badge">E-E-A-T Analysis</span>
            <span className="footer-badge">Schema Generator</span>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4 className="footer-col-heading">Product</h4>
            <Link to="/audit" className="footer-link">Free Audit</Link>
            <Link to="/pricing" className="footer-link">Pricing</Link>
            <Link to="/dashboard" className="footer-link">Dashboard</Link>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-heading">Company</h4>
            <a href="#" className="footer-link">About</a>
            <a href="#" className="footer-link">Blog</a>
            <a href="#" className="footer-link">Contact</a>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-heading">Legal</h4>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} PageIQ. All rights reserved.</p>
        <p>Powered by Claude AI</p>
      </div>
    </footer>
  );
}
