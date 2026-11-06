import { useEffect, useState } from 'react'
import { clinicsApi } from '../../lib/api'

export default function ClinicManagement() {
  const [clinics, setClinics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    clinicsApi.getAll()
      .then(res => setClinics(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Clinic Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          {clinics.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No clinics found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left text-gray-500">Name</th>
                  <th className="pb-3 text-left text-gray-500">City</th>
                  <th className="pb-3 text-left text-gray-500">Phone</th>
                  <th className="pb-3 text-left text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {clinics.map(clinic => (
                  <tr key={clinic.id} className="border-b border-gray-100">
                    <td className="py-3 text-gray-900">{clinic.name}</td>
                    <td className="py-3 text-gray-900">{clinic.city}</td>
                    <td className="py-3 text-gray-900">{clinic.phone || '—'}</td>
                    <td className="py-3">
                      <span className={`badge ${clinic.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {clinic.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}