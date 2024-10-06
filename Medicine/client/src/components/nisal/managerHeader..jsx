import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './header.css';  // Ensure this points to where your CSS is stored

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="nav"> 
      <div className='navbardetails'>
        <Link to='/nisal'><h1 className='twebpagename'>Admin</h1></Link> 
        <ul className='other-topics'>
          <Link to='/'><li>Home</li></Link>  
          <Link to='/Nmanager-sign-up'><li>manager-sign-up</li></Link>  
          <Link to='/Nabout'><li>About</li></Link>
          <Link to='/Nprofile'>
            {currentUser ? (
              <img src={currentUser.profilePicture} alt='Profile' className='h-7 w-7 rounded-full object-cover'></img>
            ) : (
              <li>Staff Sign In</li>
            
            )}
          </Link>  
        </ul>
      </div>   
    </div>
  );
}
