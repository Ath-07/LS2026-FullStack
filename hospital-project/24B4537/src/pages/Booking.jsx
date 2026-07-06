import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import api from '../api/axiosConfig'
import styles from './Booking.module.css'

function Booking() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [doctors, setDoctors] = useState([])
  const [doctorId, setDoctorId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    api.get('doctors/')
      .then((res) => setDoctors(res.data))
      .catch(() => setError('Failed to load doctors'))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const appointmentDate = `${date}T${time}:00`

    try {
      await api.post('appointments/', {
        patient: user.id,
        doctor: parseInt(doctorId),
        appointment_date: appointmentDate,
        reason,
      })
      setSuccess('Appointment booked!')
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      const data = err.response?.data
      const msg = data?.detail || data?.non_field_errors?.[0] || 'Booking failed'
      setError(msg)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Book Appointment</h2>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Doctor</label>
            <select className={styles.select} value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
              <option value="">-- Select a doctor --</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.user?.full_name} — {d.specialty}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Date</label>
            <input className={styles.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Time</label>
            <input className={styles.input} type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Reason</label>
            <textarea className={styles.textarea} value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <button className={styles.button} type="submit">Book Appointment</button>
        </form>
      </div>
    </div>
  )
}

export default Booking
