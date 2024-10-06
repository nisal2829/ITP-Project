import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './header.css'; // Ensure this points to where your CSS is stored

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="header-nav">
      <div className="header-details">
        <Link to="/">
          <h1 className="header-page-name"> Wellness Ayurveda Hospital</h1>
        </Link>

        <ul className="header-menu">
          <li>
            <Link to="/savinda">Home</Link>
          </li>
          <li>
            <Link to="/sabout">About</Link>
          </li>
          <li>
            <Link to="/sCreateInvoice">Create Invoice</Link>
          </li>
          <li>
            <Link to="/sprofile">
              {currentUser ? (
                <img
                  src={currentUser.profilePicture}
                  alt="Profile"
                  className="header-profile-pic"
                />
              ) : (
                'Sign In'
              )}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
