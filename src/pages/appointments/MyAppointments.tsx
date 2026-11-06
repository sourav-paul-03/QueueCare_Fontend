import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { appointmentsApi } from '../../lib/api'
import { Calendar, Stethoscope } from 'lucide-react'

export default function MyAppointments() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      const res = await appointmentsApi.getMyAppointments()
      setAppointments(res.data || [])
    } catch (err) {
      console.error('Failed to load appointments', err)
    } finally {
      setLoading(false)
    }
  }

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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600">View and manage your appointment history</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500">No appointments found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <Stethoscope size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {app.doctorClinic?.doctor?.user?.fullName || 'Doctor'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {app.doctorClinic?.clinic?.name || 'Clinic'} •
                        {new Date(app.startAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${statusColor[app.status]}`}>
                      {app.status}
                    </span>
                    {app.status === 'CHECKED_IN' && (
                      <button
                        onClick={() => navigate('/queue/live')}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        View Queue
                      </button>
                    )}
                    {app.status === 'COMPLETED' && (
                      <button
                        onClick={() => navigate(`/reviews`)}
                        className="text-sm text-green-600 hover:text-green-700"
                      >
                        Write Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}