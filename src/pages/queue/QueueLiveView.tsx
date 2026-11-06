import { useState } from 'react'
import { useQueue } from '../../hooks/useQueue'
import { queueApi } from '../../lib/api'

export default function QueueLiveView() {
  const [walkInForm, setWalkInForm] = useState({
    doctorClinicId: 1,
    patientName: '',
    patientPhone: '',
    priority: 0,
  })
  const [walkInLoading, setWalkInLoading] = useState(false)
  const [walkInSuccess, setWalkInSuccess] = useState('')

  const { queueState, loading, refetch } = useQueue(1, undefined, 'PATIENT')

  const handleWalkIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setWalkInLoading(true)
    try {
      await queueApi.walkIn(walkInForm)
      setWalkInSuccess('Patient checked in successfully!')
      setWalkInForm({ doctorClinicId: 1, patientName: '', patientPhone: '', priority: 0 })
      refetch()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Walk-in check-in failed')
    } finally {
      setWalkInLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const tokenDisplay = (token: any) => `${token.tokenPrefix}-${token.tokenNumber}`

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Queue</h1>
          <p className="text-gray-600">Real-time queue status</p>
        </div>
        <button onClick={refetch} className="btn-secondary">Refresh</button>
      </div>

      {walkInSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {walkInSuccess}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Session</p>
          <p className="text-2xl font-bold">{queueState?.session?.status || '—'}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Now Serving</p>
          <p className="text-3xl font-bold text-blue-600">
            {queueState?.currentToken ? tokenDisplay(queueState.currentToken) : '—'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Waiting</p>
          <p className="text-2xl font-bold">{queueState?.waitingCount || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Waiting Tokens</h3>
        </div>
        <div className="p-6">
          {queueState?.waitingTokens?.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No patients waiting.</p>
          ) : (
            <div className="space-y-2">
              {queueState?.waitingTokens?.map((token: any) => (
                <div key={token.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-xl font-mono font-bold text-blue-600">{tokenDisplay(token)}</span>
                  <span className="text-sm text-gray-600">Priority: {token.priority}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Walk-in Check-in</h3>
        <form onSubmit={handleWalkIn} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient Name</label>
              <input type="text" value={walkInForm.patientName} onChange={(e) => setWalkInForm({...walkInForm, patientName: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="tel" value={walkInForm.patientPhone} onChange={(e) => setWalkInForm({...walkInForm, patientPhone: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select value={walkInForm.priority} onChange={(e) => setWalkInForm({...walkInForm, priority: parseInt(e.target.value)})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value={0}>Normal</option>
              <option value={10}>Emergency</option>
            </select>
          </div>
          <button type="submit" disabled={walkInLoading} className="btn-primary w-auto disabled:opacity-50">
            {walkInLoading ? 'Checking in...' : 'Check-in Patient'}
          </button>
        </form>
      </div>
    </div>
  )
}