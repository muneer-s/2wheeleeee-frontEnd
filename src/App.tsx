import UserHome from './Screen/Home/UserHome'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLogin from './Screen/Login/UserLogin';



function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<UserHome />} />
          <Route path='/login' element={<UserLogin />} />
        </Routes>
      </Router>    </>
  )
}

export default App
