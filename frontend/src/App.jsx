import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import MyProfile from './pages/MyProfile'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Billing from './pages/Billing'
import Sales from './pages/Sales'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/billing' element={<Billing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/sales' element={<Sales />} />
      </Routes>
    </div>
  )
}

export default App