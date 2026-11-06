import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, Menu, LayoutDashboard, Calendar, Search, User, Bell, Activity, BarChart3, ClipboardList } from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/search', label: 'Search Doctors', icon: Search },
  { path: '/appointments/book', label: 'Book Appointment', icon: Calendar },
  { path: '/appointments/my', label: 'My Appointments', icon: ClipboardList },
  { path: '/queue/live', label: 'Live Queue', icon: Activity },
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/reviews', label: 'Reviews' },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/profile', label: 'Profile', icon: User },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const roleLabel: Record<string, string> = {
    SUPER_ADMIN: 'Super Admin',
    CLINIC_ADMIN: 'Clinic Admin',
    DOCTOR: 'Doctor',
    RECEPTIONIST: 'Receptionist',
    PATIENT: 'Patient',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">QueueCare</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-gray-600">
            <Menu size={20} />
          </button>
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.path === '/'}
                className={({ isActive }) => `text-sm font-medium text-gray-600 hover:text-blue-600 ${isActive ? 'text-blue-600' : ''}`}>
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
              <p className="text-xs text-blue-600">{roleLabel[user?.role || 'PATIENT']}</p>
            </div>
            <button onClick={logout} className="text-sm text-red-600 hover:text-red-700 font-medium">
              <LogOut size={16} className="mr-1" /> Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  )
}