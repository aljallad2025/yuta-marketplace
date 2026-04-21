import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import { User, MapPin, CreditCard, Wallet, Package, Car, Bell, Settings, ChevronRight, Star, Shield, LogOut } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import LangToggle from '../components/LangToggle'
import api from '../services/api'

export default function WebAccount() {
  const { t, isAr } = useLang()
  const navigate = useNavigate()
  const { logout, currentUser } = useAuth()
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) { navigate('/login'); return }
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('sumu_token')
        const res = await api.get(`/api/users/${currentUser.id}`, { headers: { Authorization: `Bearer ${token}` } })
        setUser(res.data)
        const ordRes = await api.get(`/api/orders?customer_id=${currentUser.id}`, { headers: { Authorization: `Bearer ${token}` } })
        setOrders(ordRes.data || [])
      } catch {}
      setLoading(false)
    }
    fetchData()
  }, [currentUser])

  const menuItems = [
    { icon: Package, label: t('orderHistory'), desc: isAr ? `${orders.length} طلب` : `${orders.length} orders`, color: '#3498DB', href: '/web/orders' },
    { icon: MapPin, label: t('savedAddresses'), desc: isAr ? 'عناوين محفوظة' : 'Saved addresses', color: '#0F2A47', href: '#' },
    { icon: CreditCard, label: t('paymentMethods'), desc: isAr ? 'طرق الدفع' : 'Payment methods', color: '#C8A951', href: '#' },
    { icon: Wallet, label: t('myWallet'), desc: isAr ? 'محفظتي' : 'My wallet', color: '#2ECC71', href: '#' },
    { icon: Car, label: t('rideHistory'), desc: isAr ? 'رحلاتي' : 'My rides', color: '#9B59B6', href: '#' },
    { icon: Bell, label: t('notifications'), desc: isAr ? 'الإشعارات' : 'Notifications', color: '#E74C3C', href: '#' },
    { icon: Settings, label: t('settings'), desc: isAr ? 'الإعدادات' : 'Settings', color: '#666', href: '#' },
  ]

  if (loading) return (
    <div className="min-h-screen bg-[#FBF8F2] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#C8A951] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const displayName = isAr ? (user?.name_ar || user?.username) : (user?.name_en || user?.username)

  return (
    <div className="min-h-screen bg-[#FBF8F2]" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-[#0F2A47] px-4 pb-8 pt-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#C8A951] rounded-full flex items-center justify-center shadow-lg text-2xl">
              {user?.avatar || <User size={28} className="text-[#0F2A47]" />}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-black text-white">{displayName}</h1>
              <p className="text-white/50 text-sm">{user?.email || user?.phone}</p>
              <div className="flex items-center gap-2 mt-1">
                <Star size={12} className="fill-[#C8A951] text-[#C8A951]" />
                <span className="text-[#C8A951] text-xs font-black">{t('goldMember')}</span>
              </div>
            </div>
            <LangToggle className="border-white/20 bg-white/10 hover:bg-white/20" />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: t('ordersCount'), value: orders.length },
              { label: t('ridesCount'), value: '0' },
              { label: t('points'), value: '0' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl py-3 text-center">
                <p className="text-xl font-black text-white">{s.value}</p>
                <p className="text-xs text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4DC] overflow-hidden">
          {menuItems.map((item, i) => (
            <Link key={item.label} to={item.href}
              className={`flex items-center gap-4 px-4 py-4 hover:bg-[#FBF8F2] transition-colors ${i < menuItems.length - 1 ? 'border-b border-[#F0ECE4]' : ''}`}>
              <div className="p-2.5 rounded-xl" style={{ backgroundColor: item.color + '15' }}>
                <item.icon size={18} style={{ color: item.color }} />
              </div>
              <div className="flex-1">
                <p className="font-black text-[#222] text-sm">{item.label}</p>
                <p className="text-xs text-[#666]">{item.desc}</p>
              </div>
              <ChevronRight size={16} className="text-[#C8A951]" style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
            </Link>
          ))}
        </div>

        <button onClick={() => { logout(); navigate('/login') }}
          className="w-full flex items-center gap-2 justify-center py-3.5 text-red-600 bg-white rounded-2xl border border-red-100 hover:bg-red-50 font-black text-sm">
          <LogOut size={16} /> {t('signOut')}
        </button>
      </div>
    </div>
  )
}
