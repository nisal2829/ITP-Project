import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './header.css';  // Ensure this points to where your CSS is stored

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="navigation-bar"> 
      <div className='navbar-content'>
        <h1 className='website-title'>WELLNESS AYURVEDA HOSPITAL</h1>
       
        <ul className='menu-items'>
          <Link to='/nisal'><li>Home</li></Link>  
          <Link to='/Nmanager-sign-in'><li>Manager Sign In</li></Link>  
          <Link to='/Nabout'><li>About</li></Link>
          
          <Link to='/Nprofile'>
            {currentUser ? (
              <img src={currentUser.profilePicture} alt='Staff Profile' className='profile-image'></img>
            ) : (
              <li>Staff Sign In</li>
            )}
          </Link>  
        </ul>
      </div>   
    </div>
  );
}
