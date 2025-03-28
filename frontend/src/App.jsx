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

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AppContext);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const location = useLocation();
  const { token } = useContext(AppContext);
  const isLoginPage = location.pathname === '/login';

  // Redirect to home if already logged in and trying to access login page
  if (token && isLoginPage) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Toaster position="top-center" />
      {!isLoginPage && <Navbar />}
      <Routes>
        <Route path='/' element={<Navigate to="/login" replace />} />
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path='/billing' element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        } />
        <Route path='/my-profile' element={
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        } />
        <Route path='/sales' element={
          <ProtectedRoute>
            <Sales />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App