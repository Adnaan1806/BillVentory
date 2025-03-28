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
  const location = useLocation();
  const { token } = useContext(AppContext);
  const isLoginPage = location.pathname === '/login';

  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Toaster position="top-center" />
      {!isLoginPage && <Navbar />}
      <Routes>
        <Route path='/' element={token ? <Home /> : <Navigate to="/login" replace />} />
        <Route path='/login' element={token ? <Navigate to="/" replace /> : <Login />} />
        <Route path='/billing' element={token ? <Billing /> : <Navigate to="/login" replace />} />
        <Route path='/my-profile' element={token ? <MyProfile /> : <Navigate to="/login" replace />} />
        <Route path='/sales' element={token ? <Sales /> : <Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default App