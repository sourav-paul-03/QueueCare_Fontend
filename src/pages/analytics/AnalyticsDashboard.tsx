import { useEffect, useState } from 'react'
import { analyticsApi } from '../../lib/api'

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const doctorClinicId = 1

  useEffect(() => {
    analyticsApi.getDoctorClinicDailyStats(doctorClinicId, 14)
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Doctor performance and wait time analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total Tokens</p>
          <p className="text-2xl font-bold">{stats?.totalTokens || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Avg Wait (min)</p>
          <p className="text-2xl font-bold">{stats?.avgWaitMinutes || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Avg Consult (min)</p>
          <p className="text-2xl font-bold">{stats?.avgConsultMinutes || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Daily Stats</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-left text-gray-500">Date</th>
                <th className="pb-3 text-left text-gray-500">Total</th>
                <th className="pb-3 text-left text-gray-500">Completed</th>
                <th className="pb-3 text-left text-gray-500">Cancelled</th>
                <th className="pb-3 text-left text-gray-500">No Show</th>
              </tr>
            </thead>
            <tbody>
              {stats?.dailyStats?.map((s: any) => (
                <tr key={s.statDate} className="border-b border-gray-100">
                  <td className="py-3">{s.statDate}</td>
                  <td className="py-3">{s.totalTokens}</td>
                  <td className="py-3">{s.completedCount}</td>
                  <td className="py-3">{s.cancelledCount}</td>
                  <td className="py-3">{s.noShowCount}</td>
                </tr>
              )) || <tr><td colSpan={5} className="py-8 text-center text-gray-500">No data</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}