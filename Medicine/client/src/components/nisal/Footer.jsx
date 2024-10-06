import { Link } from 'react-router-dom';

import './footer.css';  // Ensure to create a CSS file for the footer

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <Link to='/'>Home</Link>
          <Link to='/about'>About</Link>
          <Link to='/contact'>Contact</Link>
          <Link to='/privacy'>Privacy Policy</Link>
          <Link to='/terms'>Terms of Service</Link>
        </div>
        <div className="footer-info">
          <p>&copy; {new Date().getFullYear()} Home Inc. All rights reserved.</p>
          <p>Follow us on 
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"> Facebook</a>, 
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"> Twitter</a>, 
            and <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"> Instagram</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
