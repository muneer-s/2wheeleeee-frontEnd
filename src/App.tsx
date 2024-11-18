import UserHome from './Screen/Home/UserHome'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLogin from './Screen/Login/UserLogin';
import UserRegister from './Screen/Register/UserRegister';
import Otp from './Screen/Otp/Otp';
import { Provider } from 'react-redux';
import { store } from './app/store';


function App() {

  return (
    <>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<UserHome />} />
            <Route path='/login' element={<UserLogin />} />
            <Route path='/register' element={<UserRegister />} />
            <Route path='/otp' element={<Otp />} />
          </Routes>
        </Router>
      </Provider>
    </>
  )
}

export default App
