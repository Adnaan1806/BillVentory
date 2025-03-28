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
        <Route path='/' element={<Login />} />
        <Route path='/home' element={token ? <Home /> : <Navigate to="/" replace />} />
        <Route path='/billing' element={token ? <Billing /> : <Navigate to="/" replace />} />
        <Route path='/my-profile' element={token ? <MyProfile /> : <Navigate to="/" replace />} />
        <Route path='/sales' element={token ? <Sales /> : <Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App