import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/store";


const Header = () => {


  const authState = useAppSelector((state) => state.auth);

const userDetails = authState.user
  
  console.log('Auth state:', userDetails);
  
  const handleLogout = () => {
    
    navigate('/');
  };
  

  const navigate = useNavigate();

  return (
    <header className="bg-white px-8 py-2 flex items-center justify-between shadow-md w-full mx-auto">
      <div className="text-2xl font-bold text-sky-500">
        2Wheleeee
      </div>

      <div className="flex items-center space-x-8">
        <nav>
          <ul className="flex space-x-8">
            <li><a href="/" className="text-black hover:text-sky-500">Home</a></li>
            <li><a href="/about" className="text-black hover:text-sky-500">About Us</a></li>
            <li><a href="/services" className="text-black hover:text-sky-500">Services</a></li>
            <li><a href="/contact" className="text-black hover:text-sky-500">Contact Us</a></li>
          </ul>
        </nav>

        {userDetails ? (
          <div className="flex items-center space-x-4">
            {/* Optional: Display user's name or email */}
            <span className="text-gray-700">
              Welcome, {userDetails.name || userDetails.email}
            </span>
            <button 
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        ) : (
          <button 
            className="bg-sky-500 text-white py-2 px-4 rounded hover:bg-sky-600" 
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
