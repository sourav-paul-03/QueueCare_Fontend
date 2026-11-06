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

  const dailyStats = stats?.dailyStats || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Doctor performance and wait time analytics</p>
        </div>
        <button className="btn-secondary">Export CSV</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Completion Rate</p>
          <p className="text-2xl font-bold text-green-600">
            {stats?.totalTokens > 0 ? Math.round((stats?.completedCount || 0) / stats?.totalTokens * 100) : 0}%
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Daily Statistics (Last 14 Days)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-left text-gray-500">Date</th>
                <th className="pb-3 text-left text-gray-500">Total Tokens</th>
                <th className="pb-3 text-left text-gray-500">Completed</th>
                <th className="pb-3 text-left text-gray-500">Cancelled</th>
                <th className="pb-3 text-left text-gray-500">No Show</th>
                <th className="pb-3 text-left text-gray-500">Avg Wait (min)</th>
              </tr>
            </thead>
            <tbody>
              {dailyStats.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-gray-500">No data available</td></tr>
              ) : (
                dailyStats.map((s: any) => (
                  <tr key={s.statDate} className="border-b border-gray-100">
                    <td className="py-3">{s.statDate}</td>
                    <td className="py-3">{s.totalTokens}</td>
                    <td className="py-3">{s.completedCount}</td>
                    <td className="py-3">{s.cancelledCount}</td>
                    <td className="py-3">{s.noShowCount}</td>
                    <td className="py-3">{s.avgWaitMinutes}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Wait Time Trend</h3>
        <div className="h-64 flex items-end gap-2" style={{ paddingBottom: '20px' }}>
          {dailyStats.map((s: any) => {
            const height = Math.max(20, (s.avgWaitMinutes || 0) * 10)
            return (
              <div key={s.statDate} className="flex flex-col items-center gap-1" title={`${s.statDate}: ${s.avgWaitMinutes} min`}>
                <div className={`w-12 bg-blue-600 rounded-t-lg transition-all duration-300`} style={{ height: `${height}px` }} />
                <span className="text-xs text-gray-500">{s.statDate}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}