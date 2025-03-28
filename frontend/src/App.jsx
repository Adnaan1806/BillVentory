import React, { useContext } from 'react'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import MyProfile from './pages/MyProfile'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast'
import Billing from './pages/Billing'
import Sales from './pages/Sales'
import { AppContext } from './context/AppContext'

const App = () => {
  const { token } = useContext(AppContext);

  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Toaster position="top-center" />
      {token && <Navbar />}
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