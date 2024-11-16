import UserHome from './Screen/Home/UserHome'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLogin from './Screen/Login/UserLogin';
import UserRegister from './Screen/Register/UserRegister';


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<UserHome />} />
          <Route path='/login' element={<UserLogin />} />
          <Route path='/register' element={<UserRegister/>}/>
         </Routes>
      </Router>    </>
  )
}

export default App
