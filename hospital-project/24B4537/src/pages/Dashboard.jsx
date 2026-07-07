import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import api from '../api/axiosConfig'
import styles from './Dashboard.module.css'

function statusClass(status) {
  switch (status?.toLowerCase()) {
    case 'confirmed':
      return styles.cardConfirmed
    case 'pending':
      return styles.cardPending
    case 'cancelled':
      return styles.cardCancelled
    default:
      return ''
  }
}

function statusBadgeClass(status) {
  switch (status?.toLowerCase()) {
    case 'confirmed':
      return styles.statusConfirmed
    case 'pending':
      return styles.statusPending
    case 'cancelled':
      return styles.statusCancelled
    default:
      return ''
  }
}

function Dashboard() {
  const { user, logout } = useContext(AuthContext)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('appointments/')
      .then((res) => setAppointments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Dashboard</h2>
          {user && <p className={styles.welcome}>Welcome, {user.email}!</p>}
        </div>
        <div className={styles.actions}>
          <Link to="/booking" className={styles.primaryBtn}>Book Appointment</Link>
          <button className={styles.secondaryBtn} onClick={logout}>Logout</button>
        </div>
      </div>

      <h3 className={styles.sectionTitle}>My Appointments</h3>

      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : appointments.length === 0 ? (
        <p className={styles.empty}>No appointments yet.</p>
      ) : (
        <div className={styles.grid}>
          {appointments.map((a) => (
            <div key={a.id} className={`${styles.card} ${statusClass(a.status)}`}>
              <div className={styles.cardBody}>
                <span className={styles.cardField}>
                  <span className={styles.cardLabel}>
                    {user?.role === 'doctor' ? 'Patient' : 'Doctor'}:
                  </span>
                  {user?.role === 'doctor'
                    ? a.patient?.email || a.patient?.username
                    : `Dr. ${a.doctor?.user?.full_name}`
                  }
                </span>
                <span className={styles.cardField}>
                  <span className={styles.cardLabel}>Specialty:</span>
                  {a.doctor?.specialty}
                </span>
                <span className={styles.cardField}>
                  <span className={styles.cardLabel}>Date:</span>
                  {new Date(a.appointment_date).toLocaleString()}
                </span>
                <span className={styles.cardField}>
                  <span className={styles.cardLabel}>Reason:</span>
                  {a.reason}
                </span>
                <span className={`${styles.statusBadge} ${statusBadgeClass(a.status)}`}>
                  {a.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
