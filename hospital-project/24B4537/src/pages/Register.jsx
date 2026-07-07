import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axiosConfig'
import styles from './Login.module.css'

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '',
    first_name: '', last_name: '', role: 'patient',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      await api.post('register/', {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
        first_name: form.first_name,
        last_name: form.last_name,
      })
      setSuccess('Account created! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      const data = err.response?.data
      const msg = Object.values(data || {}).flat().join(', ') || 'Registration failed'
      setError(msg)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create Account</h2>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.error} style={{ color: 'var(--success, #16a34a)', background: 'rgba(22, 163, 74, 0.08)' }}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Username</label>
            <input className={styles.input} name="username" value={form.username} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>First Name</label>
            <input className={styles.input} name="first_name" value={form.first_name} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Last Name</label>
            <input className={styles.input} name="last_name" value={form.last_name} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Role</label>
            <select className={styles.input} name="role" value={form.role} onChange={handleChange}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Password (min 8 chars)</label>
            <input className={styles.input} type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm Password</label>
            <input className={styles.input} type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required minLength={8} />
          </div>
          <button className={styles.button} type="submit">Sign Up</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-blue)' }}>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
