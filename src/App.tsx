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
import AdminProtectedRoute from './Components/Admin/AdminProtectedRoute';
import AdminUserList from './Screen/Admin/AdminUserList/AdminUserList';
import AdminHostList from './Screen/Admin/AdminHostList/AdminHostList';
import ProfilePage from './Screen/User/Profile/ProfilePage';
import UserProtectedRoute from './Components/User/UserProtectedRoute';



function App() {

  return (
    <>
      <Provider store={store}>
        <Toaster/>

        <Router>
          <Routes>
            {/* user side */}
            <Route path="/" element={<UserProtectedRoute><UserHome /></UserProtectedRoute>} />
            <Route path="/profilePage" element={<UserProtectedRoute><ProfilePage /></UserProtectedRoute>} />
            <Route path="/hostHome" element={<UserProtectedRoute><HostHome /></UserProtectedRoute>} />

            {/* User Public routes */}
            <Route path='/login' element={<UserLogin />} />
            <Route path='/register' element={<UserRegister />} />
            <Route path='/otp' element={<Otp />} />


            {/* admin side */}
            <Route path='/adminLogin' element={<AdminLogin/>}/>
            
            <Route path="/adminDashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>}/>
            <Route path="/adminUserList" element={<AdminProtectedRoute><AdminUserList /></AdminProtectedRoute>}/>
            <Route path="/adminHostList" element={<AdminProtectedRoute><AdminHostList /></AdminProtectedRoute>}/>

          </Routes>
        </Router>
      </Provider>
    </>
  )
}

export default App
