import { useState, useEffect } from 'react'
import api from '../api/axiosConfig'
import styles from './UserManagement.module.css'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedDeptId, setSelectedDeptId] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  const [pendingDoctors, setPendingDoctors] = useState([])

  const fetchData = () => {
    setLoading(true)
    Promise.all([
      api.get('users/'),
      api.get('doctors/'),
      api.get('departments/'),
      api.get('pending-doctors/'),
    ])
      .then(([usersRes, doctorsRes, deptsRes, pendingRes]) => {
        setUsers(usersRes.data)
        setDoctors(doctorsRes.data)
        setDepartments(deptsRes.data)
        setPendingDoctors(pendingRes.data)
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const doctorUserIds = new Set(doctors.map((d) => d.user?.id))
  const eligibleUsers = users.filter(
    (u) => u.role === 'doctor' && !doctorUserIds.has(u.id) && u.is_approved
  )

  const handleAddDoctor = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    if (!selectedUserId || !selectedDeptId || !specialty.trim()) {
      setFormError('All fields are required')
      return
    }
    try {
      await api.post('doctors/', {
        user_id: parseInt(selectedUserId),
        department: parseInt(selectedDeptId),
        specialty: specialty.trim(),
      })
      setFormSuccess(`Doctor added successfully!`)
      setSelectedUserId('')
      setSelectedDeptId('')
      setSpecialty('')
      fetchData()
    } catch (err) {
      const data = err.response?.data
      const msg = data?.detail || Object.values(data || {}).flat().join(', ') || 'Failed to add doctor'
      setFormError(msg)
    }
  }

  const handleApprove = async (userId) => {
    try {
      await api.patch(`approve-doctor/${userId}/`)
      fetchData()
    } catch (err) {
      setError('Failed to approve doctor')
    }
  }

  const handleReject = async (userId) => {
    try {
      await api.delete(`reject-doctor/${userId}/`)
      fetchData()
    } catch (err) {
      setError('Failed to reject doctor')
    }
  }

  if (loading) return <div className={styles.container}><p className={styles.loading}>Loading...</p></div>
  if (error) return <div className={styles.container}><p className={styles.error}>{error}</p></div>

  return (
    <div className={styles.container}>
      {pendingDoctors.length > 0 && (
        <div className={styles.card}>
          <h2 className={styles.title}>Pending Doctor Approvals</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Full Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingDoctors.map((u) => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.full_name}</td>
                    <td>
                      <button className={styles.buttonSmall} style={{ background: 'var(--success, #16a34a)', marginRight: '0.5rem' }} onClick={() => handleApprove(u.id)}>Approve</button>
                      <button className={styles.buttonSmall} style={{ background: 'var(--danger, #dc2626)' }} onClick={() => handleReject(u.id)}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className={styles.card}>
        <h2 className={styles.title}>All Users</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td><span className={styles.roleBadge}>{u.role}</span></td>
                  <td>{u.role === 'doctor' ? (u.is_approved ? 'Approved' : 'Pending') : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.title}>Add Doctor Profile</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
          Select an approved doctor user who does not yet have a doctor profile.
        </p>
        {formError && <p className={styles.formError}>{formError}</p>}
        {formSuccess && <p className={styles.formSuccess}>{formSuccess}</p>}
        <form onSubmit={handleAddDoctor}>
          <div className={styles.formGroup}>
            <label className={styles.label}>User (approved doctor, no profile yet)</label>
            <select className={styles.select} value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
              <option value="">-- Select user --</option>
              {eligibleUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name || u.username} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Department</label>
            <select className={styles.select} value={selectedDeptId} onChange={(e) => setSelectedDeptId(e.target.value)}>
              <option value="">-- Select department --</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Specialty</label>
            <input className={styles.input} type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="e.g. Cardiologist" />
          </div>
          <button className={styles.button} type="submit">Add Doctor</button>
        </form>
      </div>
    </div>
  )
}

export default UserManagement
