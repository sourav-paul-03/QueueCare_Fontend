import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { clinicsApi, appointmentsApi } from '../../lib/api'

export default function BookAppointment() {
  const [clinics, setClinics] = useState<any[]>([])
  const [doctorClinics, setDoctorClinics] = useState<any[]>([])
  const [slots, setSlots] = useState<any[]>([])
  const [selectedClinic, setSelectedClinic] = useState<number | null>(null)
  const [selectedDoctorClinic, setSelectedDoctorClinic] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    clinicsApi.getAll().then(res => setClinics(res.data || [])).catch(err => console.error(err))
  }, [])

  const loadDoctorClinics = async (clinicId: number) => {
    const res = await clinicsApi.getDoctorClinics(clinicId)
    setDoctorClinics(res.data || [])
  }

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const startAt = `${selectedDate}T${selectedSlot}:00Z`
      await appointmentsApi.book({ doctorClinicId: selectedDoctorClinic!, startAt })
      setSuccess('Appointment booked successfully!')
      setTimeout(() => navigate('/appointments/my'), 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to book appointment')
    } finally { setLoading(false) }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-gray-600">Schedule your next visit with a doctor</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{success}</div>}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleBook} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Clinic</label>
              <select value={selectedClinic || ''} onChange={(e) => { const id = parseInt(e.target.value); setSelectedClinic(id); setSelectedDoctorClinic(null); setSelectedDate(''); setSelectedSlot(''); setSlots([]); loadDoctorClinics(id) }} disabled={loading} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select clinic</option>
                {clinics.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Doctor</label>
              <select value={selectedDoctorClinic || ''} disabled={!selectedClinic || loading} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select doctor</option>
                {doctorClinics.map(dc => <option key={dc.id} value={dc.id}>{dc.doctor?.user?.fullName} - {dc.clinic?.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date</label>
              <input type="date" min={today} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} disabled={!selectedDoctorClinic || loading} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Time Slot</label>
              <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)} disabled={!selectedDate || loading} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select time</option>
                {slots.map(slot => <option key={slot.startAt} value={slot.startAt}>{slot.startAt} - {slot.endAt}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={loading || !selectedDoctorClinic || !selectedDate || !selectedSlot} className="btn-primary disabled:opacity-50">{loading ? 'Booking...' : 'Confirm Booking'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}