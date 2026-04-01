import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Bell, ShoppingCart, User } from 'lucide-react'
import SumuLogo from './SumuLogo'
import LangToggle from './LangToggle'
import { useLang } from '../i18n/LangContext'

export default function WebNavbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { t } = useLang()

  const navLinks = [
    { label: t('home'), href: '/web' },
    { label: t('marketplace'), href: '/web/marketplace' },
    { label: t('taxi'), href: '/web/taxi' },
    { label: t('orders'), href: '/web/orders' },
    { label: t('about'), href: '/web/about' },
  ]

  return (
    <header className="bg-[#0F2A47] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/web"><SumuLogo size={36} variant="full" /></Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} to={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  location.pathname === link.href
                    ? 'bg-[#C8A951] text-[#0F2A47]'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}>{link.label}</Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <LangToggle />
            <button className="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg">
              <Bell size={17} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#C8A951] rounded-full"></span>
            </button>
            <Link to="/web/account" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 text-sm">
              <div className="w-7 h-7 bg-[#C8A951] rounded-full flex items-center justify-center">
                <User size={13} className="text-[#0F2A47]" />
              </div>
              <span>{t('account')}</span>
            </Link>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-white rounded-lg hover:bg-white/10">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-[#0F2A47] border-t border-white/10 px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link key={link.href} to={link.href} onClick={() => setOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 font-semibold">
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/10 mt-2 flex items-center gap-3 px-2">
            <LangToggle />
            <Link to="/web/account" className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold">
              <User size={15} /> {t('account')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
