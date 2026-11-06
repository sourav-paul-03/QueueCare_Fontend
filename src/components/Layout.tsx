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

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
)

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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 1 1.54 2.71H19a2 2 0 0 1 2 1.72 19.79 19.79 0 0 1-8.63 3.07 19.5 19.5 0 0 1-6 6 19.79 19.79 0 0 1-3.07 8.67A2 2 0 0 1 4.11 22h3a2 2 0 0 1 2-1.72 12.84 12.84 0 0 1 1.54-2.71H19a2 2 0 0 1 2-1.72"/></svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">QueueCare</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-gray-600 hover:text-gray-900">
            <Menu size={20} />
          </button>
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.path === '/'}
                className={({ isActive }) => `text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors ${isActive ? 'text-blue-600' : ''}`}>
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

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 md:shadow-none md:border-r md:border-l`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <span className="text-xl font-bold text-gray-900">QueueCare</span>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              {item.icon ? <item.icon size={18} /> : <StarIcon />}
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto p-6 border-t border-gray-200">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  )
}