import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import styles from './Login.module.css'

function PendingApproval() {
  const { user, logout } = useContext(AuthContext)

  return (
    <div className={styles.container}>
      <div className={styles.card} style={{ textAlign: 'center' }}>
        <h2 className={styles.title}>Account Pending Approval</h2>
        <p style={{ marginBottom: '1rem', color: 'var(--text-light)' }}>
          Your doctor account (<strong>{user?.email}</strong>) is awaiting approval by an administrator.
        </p>
        <p style={{ marginBottom: '2rem', color: 'var(--text-light)' }}>
          You will be notified once your account has been approved. Please check back later.
        </p>
        <button className={styles.button} onClick={logout}>Logout</button>
      </div>
    </div>
  )
}

export default PendingApproval
