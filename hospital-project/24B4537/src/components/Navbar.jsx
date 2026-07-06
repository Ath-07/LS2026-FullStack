import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import styles from './Navbar.module.css'

function Navbar() {
  const { user, logout } = useContext(AuthContext)

  return (
    <nav className={styles.nav}>
      <Link to="/dashboard" className={styles.brand}>Hospital Portal</Link>
      <div className={styles.links}>
        <Link to="/dashboard" className={styles.link}>Dashboard</Link>
        <Link to="/booking" className={styles.link}>Book Appointment</Link>
        {(user?.is_staff || user?.role === 'doctor') && <Link to="/user-management" className={styles.link}>Manage Users</Link>}
      </div>
      <span className={styles.userEmail}>{user?.email}</span>
      <button className={styles.logoutBtn} onClick={logout}>Logout</button>
    </nav>
  )
}

export default Navbar
