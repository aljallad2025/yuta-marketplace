import { Outlet, Link } from 'react-router-dom'
import WebNavbar from '../components/WebNavbar'

export default function WebLayout() {
  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      <WebNavbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        <Link to="/privacy" className="hover:text-gray-800 transition">سياسة الخصوصية</Link>
        <span className="mx-2">·</span>
        <span>© 2026 يوتا YUTA</span>
      </footer>
    </div>
  )
}
