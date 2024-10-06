import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Custom CSS for styling

function Home() {
  return (
    <div className="home-container">
      {/* Main Content Section */}
      <div className="home-content">
        <h2>Welcome to Wellness Ayurveda Hospital</h2>
        <p>
          At Wellness Ayurveda Hospital, we offer traditional Ayurvedic
          treatments and therapies to rejuvenate your body and mind. Our expert
          practitioners ensure personalized care that restores the balance
          between your body, mind, and spirit.
        </p>

        {/* Three Column Section with Links */}
        <div className="home-buttons">
          <div className="button-column">
            <Link to="/savinda" className="home-btn service-btn">
            Savinda
            </Link>
            <p>Explore our range of Ayurvedic therapies and treatments.</p>
          </div>
          <div className="button-column">
            <Link to="/hiruni" className="home-btn about-btn">
            Hiruni
            </Link>
            <p>
              Learn more about our hospital, our values, and our team of
              experts.
            </p>
          </div>
          <div className="button-column">
            <Link to="/nisal" className="home-btn contact-btn">
            nisal
            </Link>
            <p>Get in touch with us for consultations or inquiries.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
