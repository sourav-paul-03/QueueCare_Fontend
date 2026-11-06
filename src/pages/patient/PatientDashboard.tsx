import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { appointmentsApi } from '../../lib/api'

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    appointmentsApi.getMyAppointments()
      .then(res => setAppointments(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const statusColor: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    CHECKED_IN: 'bg-purple-100 text-purple-700',
    IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-gray-100 text-gray-600',
    NO_SHOW: 'bg-red-100 text-red-700',
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
  }

  const upcoming = appointments.filter(a => ['PENDING','CONFIRMED','CHECKED_IN','IN_PROGRESS'].includes(a.status))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="text-gray-600">Manage your appointments</p>
        </div>
        <Link to="/appointments/book" className="btn-primary">Book Appointment</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total Appointments</p>
          <p className="text-2xl font-bold">{appointments.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Upcoming</p>
          <p className="text-2xl font-bold">{upcoming.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold">{appointments.filter(a => a.status === 'COMPLETED').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Upcoming Appointments</h3>
        </div>
        <div className="p-6">
          {upcoming.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No upcoming appointments.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcoming.map(app => (
                <div key={app.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.47"/><path d="M16 3.13a4 4 0 0 1 0 5.74"/></svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{app.doctorClinic?.doctor?.user?.fullName || 'Doctor'}</p>
                      <p className="text-sm text-gray-500">{app.doctorClinic?.clinic?.name || 'Clinic'} • {new Date(app.startAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`badge ${statusColor[app.status]}`}>{app.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}