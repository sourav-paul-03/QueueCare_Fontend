import { useEffect, useState } from 'react'
import { notificationsApi } from '../../lib/api'
import { useAuth } from '../../contexts/AuthContext'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deviceToken, setDeviceToken] = useState('')
  const [platform, setPlatform] = useState('WEB')
  const [registerLoading, setRegisterLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      const res = await notificationsApi.getMyNotifications()
      setNotifications(res.data || [])
    } catch (err) {
      console.error(err)
    } finally { setLoading(false) }
  }

  const markAsRead = async (id: number) => {
    await notificationsApi.markAsRead(id)
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
  }

  const registerDevice = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterLoading(true)
    try {
      await notificationsApi.registerDeviceToken({ deviceToken, platform })
      setDeviceToken('')
      loadNotifications()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to register device token')
    } finally { setRegisterLoading(false) }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <button onClick={() => notificationsApi.markAllAsRead().then(() => setNotifications(notifications.map(n => ({ ...n, isRead: true }))))} className="text-sm text-blue-600 hover:text-blue-700">Mark all as read</button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Register Device for Push Notifications</h3>
        <form onSubmit={registerDevice} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Device Token</label>
              <input type="text" placeholder="Enter device token" value={deviceToken} onChange={(e) => setDeviceToken(e.target.value)} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="WEB">WEB</option>
                <option value="ANDROID">ANDROID</option>
                <option value="IOS">IOS</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={registerLoading} className="btn-primary w-auto disabled:opacity-50">
            {registerLoading ? 'Registering...' : 'Register Device'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No notifications.</p>
          ) : (
            <div className="space-y-3">
              {notifications.map(n => (
                <div key={n.id} className={`p-4 border-b border-gray-50 last:border-0 ${!n.isRead ? 'bg-blue-50' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{n.title}</h4>
                      <p className="text-sm text-gray-600">{n.body}</p>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  {!n.isRead && (
                    <button onClick={() => markAsRead(n.id)} className="mt-2 text-xs text-blue-600 hover:text-blue-700">Mark as read</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}