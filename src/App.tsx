import UserHome from './Screen/User/Home/UserHome'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLogin from './Screen/User/Login/UserLogin';
import UserRegister from './Screen/User/Register/UserRegister';
import Otp from './Screen/User/Otp/Otp';
import { Provider } from 'react-redux';
import { store } from './app/store';
import HostHome from './Screen/Host/HostHome/HostHome';
import { Toaster } from 'react-hot-toast';
import AdminLogin from './Screen/Admin/AdminLogin'


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
            <Route path='/hostHome' element={ <HostHome />} />



            {/* admin side */}
            <Route path='/adminLogin' element={<AdminLogin/>}/>
          </Routes>
        </Router>
      </Provider>
    </>
  )
}

export default App
