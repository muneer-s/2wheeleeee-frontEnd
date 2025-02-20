import { useNavigate } from "react-router-dom";
import { useAppSelector, AppDispatch } from "../../../Apps/store";
import { useDispatch } from "react-redux";
import { userLogout } from "../../../Apps/slice/AuthSlice";
import toast from "react-hot-toast";
import { logout } from "../../../Api/user";
import { useEffect, useState } from "react";
import defaultDp from '../../../assets/defaultDP.png'
import { checkBlockedStatus } from "../../../Api/user";
import { handleApiResponse } from "../../../Utils/apiUtils";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()

  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  const authState = useAppSelector((state) => state.auth);
  const userDetails = authState.user

  const [dropDownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);


  const handleLogout = async () => {
    const email = userDetails.email
    const response = await logout({ email })

    if (response?.success) {
      dispatch(userLogout());
      navigate('/');
      toast.success("Logged out successfully.")
    }

  };


  useEffect(() => {
    const checkIfBlocked = async () => {
      if (userDetails?.email) {
        try {
          const email = userDetails.email
          const response = await checkBlockedStatus(email)
          const data = handleApiResponse(response)

          if (data?.isBlocked) {
            toast.error("Your account has been blocked by the admin.")
            handleLogout()
          }
        } catch (error) {
          console.error("Error checking blocked status:", error)
        }
      }
    };
    checkIfBlocked();
  }, [userDetails, navigate])

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };




  return (
    <header className={`fixed top-0 left-0 z-50 p-4 bg-white px-4 py-2 flex items-center justify-between w-full mx-auto md:px-8 transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"}`}>

      {/* Logo */}
      <div className="text-2xl font-bold text-sky-500">2Wheleeee</div>

      {/* Hamburger menu (Mobile) */}
      <div className="md:hidden">
        <button
          className="text-gray-700 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav
        className={`${mobileMenuOpen ? "block" : "hidden"
          } md:flex md:items-center md:space-x-8 absolute md:static top-12 left-0 w-full bg-white md:bg-transparent md:w-auto z-10`}
      >
        <ul className="flex flex-col md:flex-row md:space-x-8">
          <li>
            <a href="/" className="block px-4 py-2 text-black hover:text-sky-500">
              Home
            </a>
          </li>
        </ul>
      </nav>

      {/* User Section */}
      <div className="flex items-center space-x-4">
        {userDetails ? (
          <div className="relative">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setDropdownOpen(!dropDownOpen)}
            >
              <img
                src={userDetails.profilePhoto || userDetails.profile_picture || defaultDp}
                alt="Profile"
                className="w-10 h-10 rounded-full border"
              />
              <span className="text-gray-700 hidden md:inline">{userDetails.name}</span>
            </div>
            {dropDownOpen && (
              <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-md w-48">
                <ul className="py-2">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/profilePage")}
                  >
                    Profile
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/hostHome")}
                  >
                    Host
                  </li>

                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
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
