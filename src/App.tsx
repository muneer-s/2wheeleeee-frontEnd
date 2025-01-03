import UserHome from './Screen/User/Home/UserHome'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLogin from './Screen/User/Login/UserLogin';
import UserRegister from './Screen/User/Register/UserRegister';
import Otp from './Screen/User/Otp/Otp';
import { Provider } from 'react-redux';
import { store } from './app/store';
import HostHome from './Screen/Host/HostHome/HostHome';
import { Toaster } from 'react-hot-toast';
import AdminLogin from './Screen/Admin/AdminLogin/AdminLogin'
import AdminDashboard from './Screen/Admin/AdminDashboard/AdminDashboard';
import AdminProtectedRoute from './Middleware/AdminProtectedRoute';
import AdminUserList from './Screen/Admin/AdminUserList/AdminUserList';
import AdminHostList from './Screen/Admin/AdminHostList/AdminHostList';
import ProfilePage from './Screen/User/Profile/ProfilePage';
import AdminSingleUserPage from './Screen/Admin/SingleUserPage/SingleUserPage'
import HostRegisterPage from './Screen/Host/HostBikeList/HostBikeList';
import HostBikeRegisterpage from './Screen/Host/BikeRegister/HostBikeRegisterpage';
import Success from './Screen/Host/Success/SuccessScreen';
import HostSingleView from './Screen/Admin/AdminHostSingleView/HostSingleView';
import UserProtecteRoute from './Middleware/UserProtectRoute';
import ForgotPasswordScreen from './Screen/User/ForgotPassword/ForgotPasswordScreen';
import WaitingPage from './Screen/Host/WaitingPage/WaitingPage';
import HostBikeList from './Screen/Host/HostBikeList/HostBikeList';
import HostBikeViewPage from './Screen/Host/HostBikeSingleView/HostBikeViewPage';
import EditBike from './Screen/Host/EditBike/EditBike';
import UserBikeListPage from './Screen/User/UserBikeListPage/UserBikeListPage';
import UserBikeSinglePage from './Screen/User/UserBikeSingleViewPage/UserBikeSinglePage';
// Import the slick-carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



function App() {

  return (
    <>
      <Provider store={store}>
        <Toaster/>

        <Router>
          <Routes>
            {/* user side */}
            <Route path="/" element={<UserHome />} />
            <Route path='/login' element={<UserLogin />} />
            <Route path='/register' element={<UserRegister />} />
            <Route path='/otp' element={<Otp />} />
            <Route path='/forgotPassword' element={<ForgotPasswordScreen/>} />
            


            
            <Route path='/hostHome' element={ <UserProtecteRoute><HostHome /></UserProtecteRoute>} />
            <Route path='/profilePage' element={<UserProtecteRoute><ProfilePage/></UserProtecteRoute>} />
            <Route path='/hostList' element={<UserProtecteRoute><HostRegisterPage/></UserProtecteRoute>} />
            <Route path='/hostBikeRegister' element={<UserProtecteRoute><HostBikeRegisterpage/></UserProtecteRoute>} />
            <Route path='/hostSuccessPage' element={<UserProtecteRoute><Success /></UserProtecteRoute>} />
            <Route path='/hostWaitingPage' element={<UserProtecteRoute><WaitingPage/></UserProtecteRoute>} />
            <Route path='/hostBikeListPage' element={<UserProtecteRoute><HostBikeList/></UserProtecteRoute>} />
            <Route path='/HostBikeViewPage/:id' element={<UserProtecteRoute><HostBikeViewPage/></UserProtecteRoute>} />
            <Route path='/EditBike/:id' element={<UserProtecteRoute><EditBike/></UserProtecteRoute>} />



            <Route path='/UserBikeListPage' element={<UserBikeListPage/>} />
            <Route path='/UserBikeSinglePage/:id' element={<UserBikeSinglePage/>} />
            
            










            {/* admin side */}
            <Route path='/adminLogin' element={<AdminLogin/>}/>
            
            <Route path="/adminDashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>}/>
            <Route path="/adminUserList" element={<AdminProtectedRoute><AdminUserList /></AdminProtectedRoute>}/>
            <Route path="/adminHostList" element={<AdminProtectedRoute><AdminHostList /></AdminProtectedRoute>}/>
            <Route path="/usersinglepage/:id" element={<AdminProtectedRoute><AdminSingleUserPage/></AdminProtectedRoute>} />

            <Route path="/singleBikeViewPage" element={<AdminProtectedRoute><HostSingleView/></AdminProtectedRoute>} />


          </Routes>
        </Router>
      </Provider>
    </>
  )
}

export default App
