import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Bell, ShoppingCart, User, ChevronDown } from 'lucide-react'
import SumuLogo from './SumuLogo'

const navLinks = [
  { label: 'Marketplace', href: '/web/marketplace' },
  { label: 'Delivery', href: '/web/delivery' },
  { label: 'Taxi', href: '/web/taxi' },
  { label: 'About', href: '/web/about' },
]

export default function WebNavbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="bg-[#0F2A47] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/web" className="flex items-center gap-2">
            <SumuLogo size={38} variant="full" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.href
                    ? 'bg-[#C8A951] text-[#0F2A47]'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            <button className="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#C8A951] rounded-full"></span>
            </button>
            <button className="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg">
              <ShoppingCart size={18} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C8A951] text-[#0F2A47] text-xs font-bold rounded-full flex items-center justify-center">3</span>
            </button>
            <div className="w-px h-6 bg-white/20 mx-1" />
            <Link to="/web/account" className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 text-sm">
              <div className="w-7 h-7 bg-[#C8A951] rounded-full flex items-center justify-center">
                <User size={14} className="text-[#0F2A47]" />
              </div>
              <span>Account</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-white rounded-lg hover:bg-white/10">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0F2A47] border-t border-white/10 px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/10 mt-2">
            <Link to="/web/account" className="flex items-center gap-2 px-4 py-2.5 text-white/80 hover:text-white text-sm">
              <User size={16} /> Account
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
