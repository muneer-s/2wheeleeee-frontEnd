import { useNavigate } from "react-router-dom";
import { useAppSelector, AppDispatch } from "../../../Apps/store";
import { useDispatch } from "react-redux";
import { userLogout } from "../../../Apps/slice/AuthSlice";
import toast from "react-hot-toast";
import { logout } from "../../../Api/user";
import { useEffect, useState, useRef } from "react";
import defaultDp from '../../../assets/defaultDP.png';
import { checkBlockedStatus } from "../../../Api/user";
import { handleApiResponse } from "../../../Utils/apiUtils";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [dropDownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const authState = useAppSelector((state) => state.auth);
  const userDetails = authState.user;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const email = userDetails.email;
    const response = await logout({ email });

    if (response?.success) {
      dispatch(userLogout());
      navigate('/');
      toast.success("Logged out successfully.");
    }
  };

  useEffect(() => {
    const checkIfBlocked = async () => {
      if (userDetails?.email) {
        try {
          const email = userDetails.email;
          const response = await checkBlockedStatus(email);
          const data = handleApiResponse(response);

          if (data?.isBlocked) {
            toast.error("Your account has been blocked by the admin.");
            handleLogout();
          }
        } catch (error) {
          console.error("Error checking blocked status:", error);
        }
      }
    };
    checkIfBlocked();
  }, [userDetails, navigate]);

  return (
    <header 
      className={`fixed top-0 left-0 z-50 w-full bg-white shadow-md transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div 
              className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => navigate('/')}
            >
              2Wheleeee
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:ml-6 md:flex md:items-center md:space-x-6">
            <a 
              href="/" 
              className="px-3 py-2 text-gray-700 font-medium hover:text-sky-500 transition duration-150 ease-in-out relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#services" 
              className="px-3 py-2 text-gray-700 font-medium hover:text-sky-500 transition duration-150 ease-in-out relative group"
            >
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#about-us" 
              className="px-3 py-2 text-gray-700 font-medium hover:text-sky-500 transition duration-150 ease-in-out relative group"
            >
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* User Section */}
          <div className="flex items-center">
            {userDetails ? (
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center space-x-3 cursor-pointer p-2 rounded-full hover:bg-gray-100 transition duration-150 ease-in-out"
                  onClick={() => setDropdownOpen(!dropDownOpen)}
                >
                  <img
                    src={userDetails.profilePhoto || userDetails.profile_picture || defaultDp}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                  />
                  <div className="hidden md:block">
                    <span className="text-gray-800 font-medium">{userDetails.name}</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 text-gray-500 ml-1 transition-transform duration-200 inline ${dropDownOpen ? 'rotate-180' : ''}`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                {dropDownOpen && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-lg w-56 py-2 z-50 transform origin-top-right transition-all duration-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{userDetails.email}</p>
                    </div>
                    <ul>
                      <li
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          navigate("/profilePage");
                          setDropdownOpen(false);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </li>
                      <li
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          navigate("/hostHome");
                          setDropdownOpen(false);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Host
                      </li>
                      <div className="border-t border-gray-100 my-1"></div>
                      <li
                        className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                        onClick={handleLogout}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  className="hidden md:inline-flex items-center px-4 py-2 border border-sky-500 text-sky-500 rounded-md hover:bg-sky-50 transition-colors duration-300"
                  onClick={() => navigate('/login')}
                >
                  Log In
                </button>
                <button
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium rounded-md shadow-sm hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-300"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-sky-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-gray-100 shadow-lg`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a
            href="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-sky-500 hover:bg-gray-50"
          >
            Home
          </a>
          <a
            href="#services"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-sky-500 hover:bg-gray-50"
          >
            Services
          </a>
          <a
            href="#about-us"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-sky-500 hover:bg-gray-50"
          >
            About Us
          </a>
          {!userDetails && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center justify-between px-4">
                <button
                  className="w-full mt-2 px-4 py-2 text-center bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium rounded-md shadow-sm hover:from-sky-600 hover:to-blue-700"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;