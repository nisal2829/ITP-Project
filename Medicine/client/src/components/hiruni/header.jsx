import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './header.css'; // Ensure this points to where your CSS is stored

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="nav"> 
      <div className='nav-details'>
        <Link to='/'>
          <h1 className='page-title'>Topic</h1>
        </Link> 

        <ul className='nav-menu'>
          <li>
            <Link to='/hiruni'>Home</Link>
          </li>  
          <li>
            <Link to='/about'>About</Link>
          </li>
          <li>
            <Link to='/profile'>
              {currentUser ? (
                <img 
                  src={currentUser.profilePicture} 
                  alt='Profile' 
                  className='profile-image' 
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
