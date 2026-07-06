import { Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Booking from './pages/Booking'
import UserManagement from './pages/UserManagement'

function App() {
  const { user, loading } = useContext(AuthContext)

  if (loading) return <div>Loading...</div>

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/booking" element={<Booking />} />
        <Route
          path="/user-management"
          element={
            user?.role === 'doctor' || user?.is_staff
              ? <UserManagement />
              : <Navigate to="/dashboard" />
          }
        />
      </Route>
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
    </Routes>
  )
}

export default App
