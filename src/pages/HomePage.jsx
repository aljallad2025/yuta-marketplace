import { Link } from 'react-router-dom'
import SumuLogo from '../components/SumuLogo'
import { Smartphone, Monitor, Settings, ArrowRight, Star, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0F2A47] flex flex-col items-center justify-center px-4 py-12">
      {/* Brand header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <SumuLogo size={80} variant="full" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          <span className="text-[#C8A951]">SUMU</span> Platform
        </h1>
        <p className="text-white/60 text-lg max-w-md mx-auto">
          Premium Gulf multi-service platform — Marketplace, Delivery & Taxi
        </p>
      </div>

      {/* Platform cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-10">
        {[
          {
            icon: Monitor,
            label: 'Web Platform',
            desc: 'Customer-facing marketplace, delivery & taxi booking portal',
            href: '/web',
            color: '#C8A951',
            features: ['Home & Discovery', 'Marketplace', 'Checkout', 'Taxi Booking', 'Order Tracking'],
          },
          {
            icon: Smartphone,
            label: 'Mobile App',
            desc: 'Interactive phone UI simulation of the SUMU mobile app',
            href: '/mobile',
            color: '#2ECC71',
            features: ['Home Screen', 'Categories', 'Orders', 'Taxi', 'Account'],
          },
          {
            icon: Settings,
            label: 'Admin Dashboard',
            desc: 'Full control panel for managing the entire platform',
            href: '/admin',
            color: '#3498DB',
            features: ['Analytics', 'Users & Stores', 'Drivers', 'Orders', 'Live Map', 'Financial'],
          },
        ].map(platform => (
          <Link key={platform.label} to={platform.href}
            className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C8A951]/50 rounded-2xl p-6 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: platform.color + '20' }}>
                <platform.icon size={22} style={{ color: platform.color }} />
              </div>
              <h2 className="font-bold text-white text-lg">{platform.label}</h2>
            </div>
            <p className="text-white/50 text-sm mb-4 leading-relaxed">{platform.desc}</p>
            <ul className="space-y-1.5 mb-5">
              {platform.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-xs text-white/60">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: platform.color }}></div>
                  {f}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all" style={{ color: platform.color }}>
              Open {platform.label} <ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </div>

      {/* Brand attributes */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-white/40 text-sm">
        <div className="flex items-center gap-2"><Star size={14} className="text-[#C8A951]" /> Premium Gulf Brand</div>
        <div className="flex items-center gap-2"><Shield size={14} className="text-[#C8A951]" /> Enterprise-Grade Design</div>
        <div className="flex items-center gap-2"><Zap size={14} className="text-[#C8A951]" /> Production-Ready UI</div>
      </div>

      <p className="text-white/20 text-xs mt-8">Built with React + Vite + Tailwind CSS</p>
    </div>
  )
}
