import React from 'react';
import './css/about.css'; // Create a CSS file for the About page styling

export default function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>About Us</h1>
        <p>
          Welcome to <strong>Wellness Ayurveda Hospital </strong>, your trusted platform for [describe your service or product here]. We are dedicated to providing you with the best service, with a focus on reliability, customer satisfaction, and transparency.
        </p>
        <h2>Our Mission</h2>
        <p>
          We ensure a seamless experience that caters to your needs.
        </p>
        <h2>Why Choose Us?</h2>
        <ul>
          <li>High-quality products and services</li>
          <li>Dedicated customer support</li>
          <li>Competitive pricing</li>
          <li>Trusted by thousands of users</li>
        </ul>
        <h2>Contact Us</h2>
        <p>
          If you have any questions or need assistance, feel free to reach out to us at:
        </p>
        <p>Email: support@Wellnessayurvedahospital.com</p>
        <p>Phone: +123 456 7890</p>
        <p>Follow us on our social media channels for the latest updates!</p>
      </div>
    </div>
  );
}
