import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { usersApi } from '../../lib/api'

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    if (user?.role === 'PATIENT') {
      usersApi.getPatientProfile()
        .then(res => setProfile(res.data))
        .catch(err => console.error(err))
    } else {
      setProfile(null)
    }
  }, [user])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account settings</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <p className="text-gray-900">{user?.fullName}</p>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <p className="text-gray-900">{user?.email}</p>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <p className="text-gray-900">{user?.phone || '—'}</p>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <p className="text-gray-900 capitalize">{user?.role}</p>
          </div>
        </div>

        {user?.role === 'PATIENT' && profile && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Patient Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                <p className="text-gray-700">{profile.dob || '—'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <p className="text-gray-700">{profile.gender || '—'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Blood Group</label>
                <p className="text-gray-700">{profile.bloodGroup || '—'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Emergency Contact</label>
                <p className="text-gray-700">{profile.emergencyContact || '—'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}