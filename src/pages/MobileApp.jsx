import { useState } from 'react'
import MobileHome from './mobile/MobileHome'
import MobileCategories from './mobile/MobileCategories'
import MobileOrders from './mobile/MobileOrders'
import MobileTaxi from './mobile/MobileTaxi'
import MobileAccount from './mobile/MobileAccount'
import { Home, Grid, Package, Car, User, Download, CheckCircle, Share, Plus, X, Smartphone, Wifi, WifiOff } from 'lucide-react'
import LangToggle from '../components/LangToggle'
import { useLang } from '../i18n/LangContext'
import { usePWAInstall } from '../hooks/usePWAInstall'

export default function MobileApp() {
  const [activeTab, setActiveTab] = useState('home')
  const [showIOSGuide, setShowIOSGuide] = useState(false)
  const [installing, setInstalling] = useState(false)
  const { t, isAr } = useLang()
  const { canInstall, isInstalled, isIOS, justInstalled, install } = usePWAInstall()

  const tabs = [
    { id: 'home', icon: Home, component: MobileHome },
    { id: 'stores', icon: Grid, component: MobileCategories },
    { id: 'orders', icon: Package, component: MobileOrders },
    { id: 'taxi', icon: Car, component: MobileTaxi },
    { id: 'account', icon: User, component: MobileAccount },
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  const handleInstall = async () => {
    if (isIOS) { setShowIOSGuide(true); return }
    setInstalling(true)
    await install()
    setInstalling(false)
  }

  const appFeatures = isAr
    ? ['طلب الطعام والمشتريات', 'حجز سيارة أجرة', 'تتبع طلباتك لحظة بلحظة', 'يعمل بدون إنترنت', 'إشعارات فورية']
    : ['Order food & groceries', 'Book a taxi ride', 'Live order tracking', 'Works offline', 'Push notifications']

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center py-8 px-4" dir={isAr ? 'rtl' : 'ltr'}>

      {/* Success toast */}
      {justInstalled && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-black text-sm">
          <CheckCircle size={16} />
          {isAr ? 'تم تثبيت التطبيق بنجاح!' : 'App installed successfully!'}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-[#C8A951] font-black text-xl">سمو</span>
          <span className="text-white/30 text-lg">·</span>
          <span className="text-white/60 text-sm font-bold tracking-widest">SUMU</span>
        </div>
        <LangToggle className="border-white/20 bg-white/5 hover:bg-white/10" />
      </div>

      <div className="flex items-start gap-10 max-w-5xl w-full justify-center flex-wrap lg:flex-nowrap">

        {/* Phone shell */}
        <div className="relative mx-auto flex-shrink-0" style={{ width: 300 }}>
          <div className="relative bg-[#0F2A47] rounded-[44px] p-[3px]"
            style={{ boxShadow: '0 30px 80px rgba(0,0,0,.7), 0 0 0 1px rgba(200,169,81,.3), inset 0 0 0 1px rgba(255,255,255,.05)' }}>
            <div className="bg-[#FBF8F2] rounded-[41px] overflow-hidden relative" style={{ height: 620 }}>
              {/* Status bar */}
              <div className="bg-[#0F2A47] px-5 pt-3 pb-2 flex items-center justify-between relative">
                <span className="text-white text-xs font-bold">9:41</span>
                <div className="w-20 h-4 bg-[#0F2A47] rounded-full absolute top-2 left-1/2 -translate-x-1/2 z-10"></div>
                <div className="flex items-center gap-1 text-white text-[9px]">●●●● 🔋</div>
              </div>
              {/* Content */}
              <div className="overflow-y-auto" style={{ height: 'calc(620px - 46px - 52px)' }}>
                {ActiveComponent && <ActiveComponent />}
              </div>
              {/* Bottom nav */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E8E4DC] px-2 py-1.5" style={{ borderRadius: '0 0 41px 41px' }}>
                <div className="flex items-center justify-around">
                  {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${activeTab === tab.id ? 'text-[#0F2A47]' : 'text-[#ccc]'}`}>
                      <div className={`p-1 rounded-xl ${activeTab === tab.id ? 'bg-[#0F2A47]/10' : ''}`}>
                        <tab.icon size={14} strokeWidth={activeTab === tab.id ? 2.5 : 1.8} />
                      </div>
                      <span className="text-[8px] font-bold">{t(tab.id === 'stores' ? 'stores' : tab.id)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Side buttons */}
          <div className="absolute top-20 -right-[3px] w-[3px] h-10 bg-[#C8A951]/40 rounded-r-full"></div>
          <div className="absolute top-16 -left-[3px] w-[3px] h-7 bg-[#C8A951]/40 rounded-l-full"></div>
          <div className="absolute top-28 -left-[3px] w-[3px] h-12 bg-[#C8A951]/40 rounded-l-full"></div>
          <div className="absolute top-44 -left-[3px] w-[3px] h-12 bg-[#C8A951]/40 rounded-l-full"></div>
        </div>

        {/* Install panel */}
        <div className="flex flex-col gap-3 flex-1 max-w-xs w-full">

          {/* App card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
            {/* App header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-[#0F2A47] border-2 border-[#C8A951]/50 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                🏆
              </div>
              <div>
                <h2 className="font-black text-white text-base leading-tight">سمو SUMU</h2>
                <p className="text-white/50 text-xs mt-0.5">{isAr ? 'منصة الخليج المتكاملة' : 'Premium Gulf Super-App'}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[#C8A951] text-[11px]">⭐⭐⭐⭐⭐</span>
                  <span className="text-white/30 text-[10px]">4.9 (2.4k)</span>
                </div>
              </div>
            </div>

            {/* Features list */}
            <div className="space-y-1.5 mb-4">
              {appFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[#C8A951] text-xs font-black">✓</span>
                  <span className="text-white/60 text-xs">{f}</span>
                </div>
              ))}
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 text-[10px] text-white/25 border-t border-white/10 pt-3 mb-4">
              <span>v2.0</span><span>·</span><span>~2.4 MB</span><span>·</span>
              <span className="flex items-center gap-1"><Wifi size={9} /> PWA</span>
            </div>

            {/* ─── INSTALL BUTTON ─── */}
            {isInstalled ? (
              <div className="w-full py-3.5 bg-emerald-600/20 border border-emerald-400/30 rounded-2xl flex items-center justify-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" />
                <span className="font-black text-emerald-400 text-sm">
                  {isAr ? 'التطبيق مثبّت على جهازك ✓' : 'App installed on your device ✓'}
                </span>
              </div>
            ) : (
              <button
                onClick={handleInstall}
                disabled={installing}
                className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg, #C8A951 0%, #e0c06a 50%, #C8A951 100%)', color: '#0F2A47', boxShadow: '0 8px 24px rgba(200,169,81,0.35)' }}
              >
                {installing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#0F2A47]/30 border-t-[#0F2A47] rounded-full animate-spin"></span>
                    {isAr ? 'جاري التثبيت...' : 'Installing...'}
                  </>
                ) : (
                  <>
                    <Download size={17} />
                    {isAr ? 'تنزيل التطبيق — مجاناً' : 'Install App — Free'}
                  </>
                )}
              </button>
            )}

            {/* iOS guide link */}
            {isIOS && !isInstalled && (
              <button onClick={() => setShowIOSGuide(true)}
                className="w-full mt-2 py-2.5 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-white/50 text-xs font-black hover:bg-white/5">
                <Share size={12} className="text-[#C8A951]" />
                {isAr ? 'تثبيت على iPhone / iPad' : 'Install on iPhone / iPad'}
              </button>
            )}
          </div>

          {/* PWA badge */}
          <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C8A951]/15 rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone size={16} className="text-[#C8A951]" />
            </div>
            <div>
              <p className="text-white text-xs font-black">Progressive Web App</p>
              <p className="text-white/35 text-[10px]">
                {isAr ? 'لا يحتاج متجر تطبيقات — يعمل على أي جهاز' : 'No app store needed — works on any device'}
              </p>
            </div>
          </div>

          {/* Offline badge */}
          <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
              <WifiOff size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-white text-xs font-black">{isAr ? 'وضع عدم الاتصال' : 'Offline Mode'}</p>
              <p className="text-white/35 text-[10px]">
                {isAr ? 'يحفظ البيانات ويعمل بدون إنترنت' : 'Caches data and works without internet'}
              </p>
            </div>
          </div>

          <p className="text-white/20 text-[10px] text-center pt-1">{isAr ? 'مجاني تماماً — بدون إعلانات' : 'Completely free — no ads'}</p>
        </div>
      </div>

      {/* iOS Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-4" onClick={() => setShowIOSGuide(false)}>
          <div className="bg-[#1a1a2e] border border-white/15 rounded-3xl w-full max-w-sm p-6 shadow-2xl" dir={isAr ? 'rtl' : 'ltr'}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-white text-lg">{isAr ? 'تثبيت على iPhone / iPad' : 'Install on iPhone / iPad'}</h2>
              <button onClick={() => setShowIOSGuide(false)} className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20">
                <X size={14} />
              </button>
            </div>

            <div className="space-y-4 mb-5">
              {[
                {
                  icon: <span className="text-xl">⬆️</span>,
                  titleAr: 'اضغط زر المشاركة في Safari',
                  titleEn: 'Tap the Safari Share button',
                  descAr: 'أيقونة المربع والسهم في شريط الأدوات السفلي',
                  descEn: 'The box-and-arrow icon in the bottom toolbar',
                },
                {
                  icon: <span className="text-xl">➕</span>,
                  titleAr: 'اختر "Add to Home Screen"',
                  titleEn: 'Select "Add to Home Screen"',
                  descAr: 'مرر للأسفل في قائمة المشاركة',
                  descEn: 'Scroll down in the share sheet',
                },
                {
                  icon: <span className="text-xl">✅</span>,
                  titleAr: 'اضغط "Add" للتأكيد',
                  titleEn: 'Tap "Add" to confirm',
                  descAr: 'سيظهر تطبيق سمو على شاشتك الرئيسية',
                  descEn: 'SUMU app icon will appear on your home screen',
                },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">{s.icon}</div>
                  <div>
                    <p className="text-white font-black text-sm">{isAr ? s.titleAr : s.titleEn}</p>
                    <p className="text-white/40 text-xs mt-0.5">{isAr ? s.descAr : s.descEn}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#C8A951]/10 border border-[#C8A951]/20 rounded-2xl p-3 mb-4 text-center">
              <p className="text-[#C8A951] text-xs font-black">
                📱 {isAr ? 'يجب فتح الموقع من متصفح Safari فقط' : 'Must be opened in Safari browser only'}
              </p>
            </div>

            <button onClick={() => setShowIOSGuide(false)}
              className="w-full py-3 bg-[#C8A951] text-[#0F2A47] font-black rounded-2xl text-sm">
              {isAr ? 'فهمت!' : 'Got it!'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
