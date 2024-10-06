import React from 'react';
import { Link } from 'react-router-dom';
import './css/Home.css'; // Custom CSS file for styling
import homepageImage from './images/homepage-image.jpg'; // Corrected import

function Home() {
  return (
    <div className="home-container">
      <div className="home-image">
        <img src={homepageImage} alt="Topic" />
      </div>
      <div className="home-content">
      
        
        <div className="home-buttons">
          <Link to="/Nmanager-sign-in" className="home-btn manage-staff-btn">Manage Staff</Link>
     
        </div>
      </div>
    </div>
  );
}

export default Home;