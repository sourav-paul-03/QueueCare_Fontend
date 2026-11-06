import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { searchApi, usersApi } from '../../lib/api'

export default function DoctorSearch() {
  const [doctors, setDoctors] = useState<any[]>([])
  const [specialties, setSpecialties] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [specialtyId, setSpecialtyId] = useState<string>('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    usersApi.getSpecialties().then(res => setSpecialties(res.data || [])).catch(err => console.error(err))
  }, [])

  const search = async () => {
    setLoading(true)
    try {
      const res = await searchApi.searchDoctors({
        query: query || undefined,
        specialtyId: specialtyId ? parseInt(specialtyId) : undefined,
        city: city || undefined,
      })
      setDoctors(res.data || [])
    } catch (err) {
      console.error(err)
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find a Doctor</h1>
        <p className="text-gray-600">Search for doctors and specialists</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); search() }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Search</label>
              <input type="text" placeholder="Doctor name or specialty" value={query} onChange={(e) => setQuery(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Specialty</label>
              <select value={specialtyId} onChange={(e) => setSpecialtyId(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">All specialties</option>
                {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">City</label>
              <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <button type="submit" className="btn-primary w-auto">Search</button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div></div>
          ) : doctors.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No doctors found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map(doc => (
                <div key={doc.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="4"/><path d="M5 12h14"/><path d="M5 12a 7 7 0 1 0 14 0h-14z"/></svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{doc.fullName || 'Doctor'}</h4>
                      <p className="text-sm text-gray-500">{doc.specialtyName || 'General Practice'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">₹{doc.consultationFee || 0} / visit</span>
                    <Link to="/appointments/book" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Book Now</Link>
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