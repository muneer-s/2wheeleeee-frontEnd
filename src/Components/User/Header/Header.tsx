import { useNavigate } from "react-router-dom";
import { useAppSelector, AppDispatch } from "../../../app/store";
import { useDispatch } from "react-redux";
import { userLogout } from "../../../app/slice/AuthSlice";
import toast from "react-hot-toast";
import { logout } from "../../../Api/user";
import { useEffect, useState } from "react";
import defaultDp from '../../../assets/defaultDP.png'
import { checkBlockedStatus } from "../../../Api/admin";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()

  const authState = useAppSelector((state) => state.auth);
  const userDetails = authState.user
  
  const [dropDownOpen, setDropdownOpen] = useState(false)

  const handleLogout = async () => {
    const email = userDetails.email
    const response = await logout({ email })

    if (response?.data.success) {
      dispatch(userLogout());
      navigate('/');
      toast.success("Logged out successfully.")
    }

  };


useEffect(()=>{
  const checkIfBlocked = async()=>{
    if(userDetails?.email){
      try {

        const email = userDetails.email
        const response = await checkBlockedStatus(email)
        
        if(response?.data?.isBlocked){
          toast.error("Your account has been blocked by the admin.")
          handleLogout()
        }
        
      } catch (error) {
        console.error("Error checking blocked status:", error);
      }
    }
  };
  checkIfBlocked();
},[userDetails,navigate])


  return (
    <header className="bg-white px-8 py-2 flex items-center justify-between shadow-md w-full mx-auto">
      <div className="text-2xl font-bold text-sky-500">2Wheleeee</div>

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
              <span className="text-gray-700">{userDetails.name}</span>
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
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/orders")}
                  >
                    Orders
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
