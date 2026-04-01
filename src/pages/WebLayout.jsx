import { Outlet } from 'react-router-dom'
import WebNavbar from '../components/WebNavbar'

export default function WebLayout() {
  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      <WebNavbar />
      <Outlet />
    </div>
  )
}
