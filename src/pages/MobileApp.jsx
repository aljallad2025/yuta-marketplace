import { useState } from 'react'
import MobileHome from './mobile/MobileHome'
import MobileCategories from './mobile/MobileCategories'
import MobileOrders from './mobile/MobileOrders'
import MobileTaxi from './mobile/MobileTaxi'
import MobileAccount from './mobile/MobileAccount'
import { Home, Grid, Package, Car, User, Download, CheckCircle, Share, X, Smartphone, WifiOff } from 'lucide-react'
import LangToggle from '../components/LangToggle'
import { useLang } from '../i18n/LangContext'
import { usePWAInstall } from '../hooks/usePWAInstall'

// Tab config
const TABS = [
  { id: 'home',   icon: Home,    labelAr: 'الرئيسية', labelEn: 'Home',    Component: MobileHome },
  { id: 'stores', icon: Grid,    labelAr: 'المتاجر',  labelEn: 'Stores',  Component: MobileCategories },
  { id: 'orders', icon: Package, labelAr: 'طلباتي',   labelEn: 'Orders',  Component: MobileOrders },
  { id: 'taxi',   icon: Car,     labelAr: 'تاكسي',    labelEn: 'Taxi',    Component: MobileTaxi },
  { id: 'account',icon: User,    labelAr: 'حسابي',    labelEn: 'Account', Component: MobileAccount },
]

/* ─── Full-screen app (standalone PWA or on real mobile) ─── */
function MobileAppFullscreen({ isAr }) {
  const [activeTab, setActiveTab] = useState('home')
  const { Component } = TABS.find(t => t.id === activeTab) || TABS[0]

  return (
    <div className="fixed inset-0 bg-[#FBF8F2] flex flex-col overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Safe-area top spacer (notch) */}
      <div className="bg-[#0F2A47]" style={{ height: 'env(safe-area-inset-top, 0px)' }} />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <Component />
      </div>

      {/* Bottom nav */}
      <div className="bg-white border-t border-[#E8E4DC] flex-shrink-0"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}>
        <div className="flex items-center justify-around px-1 py-1.5">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all min-w-0 ${
                activeTab === tab.id ? 'text-[#0F2A47]' : 'text-[#bbb]'
              }`}>
              <div className={`p-1.5 rounded-xl transition-all ${activeTab === tab.id ? 'bg-[#0F2A47]/8' : ''}`}>
                <tab.icon size={20} strokeWidth={activeTab === tab.id ? 2.5 : 1.8} />
              </div>
              <span className="text-[9px] font-bold truncate">{isAr ? tab.labelAr : tab.labelEn}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Preview + install page (browser, desktop) ─── */
function MobileAppPreview({ isAr, t }) {
  const [activeTab, setActiveTab] = useState('home')
  const [showIOSGuide, setShowIOSGuide] = useState(false)
  const [installing, setInstalling] = useState(false)
  const { canInstall, isInstalled, isIOS, justInstalled, install } = usePWAInstall()
  const { Component } = TABS.find(tab => tab.id === activeTab) || TABS[0]

  const handleInstall = async () => {
    if (isIOS) { setShowIOSGuide(true); return }
    setInstalling(true)
    await install()
    setInstalling(false)
  }

  const features = isAr
    ? ['طلب الطعام والمشتريات', 'حجز سيارة أجرة', 'تتبع طلباتك لحظة بلحظة', 'يعمل بدون إنترنت', 'إشعارات فورية']
    : ['Order food & groceries', 'Book a taxi ride', 'Live order tracking', 'Works offline', 'Push notifications']

  return (
    <div className="min-h-screen bg-[#0d1b30] flex flex-col items-center justify-center py-8 px-4" dir={isAr ? 'rtl' : 'ltr'}>

      {/* Installed toast */}
      {justInstalled && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-black text-sm animate-bounce">
          <CheckCircle size={16} />
          {isAr ? 'تم تثبيت التطبيق بنجاح!' : 'App installed successfully!'}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <img src="/sumu-logo.png" alt="SUMU" className="w-9 h-9 rounded-xl object-cover" />
          <span className="text-[#C8A951] font-black text-xl">سمو</span>
          <span className="text-white/20 text-lg">·</span>
          <span className="text-white/50 text-sm font-bold tracking-widest">SUMU</span>
        </div>
        <LangToggle className="border-white/20 bg-white/5 hover:bg-white/10" />
      </div>

      <div className="flex items-start gap-10 max-w-5xl w-full justify-center flex-wrap lg:flex-nowrap">

        {/* ── Phone mockup ── */}
        <div className="relative mx-auto flex-shrink-0" style={{ width: 295 }}>
          {/* Frame */}
          <div className="relative bg-[#1a2a3a] rounded-[44px] p-[3px]"
            style={{ boxShadow: '0 30px 80px rgba(0,0,0,.8), 0 0 0 1px rgba(200,169,81,.25), inset 0 0 0 1px rgba(255,255,255,.04)' }}>
            <div className="bg-[#FBF8F2] rounded-[41px] overflow-hidden relative" style={{ height: 618 }}>
              {/* Status bar */}
              <div className="bg-[#0F2A47] px-5 pt-3 pb-2 flex items-center justify-between">
                <span className="text-white text-[11px] font-bold">9:41</span>
                <div className="w-20 h-5 bg-[#0F2A47] rounded-full absolute top-0 left-1/2 -translate-x-1/2"></div>
                <div className="flex items-center gap-1 text-white text-[10px] opacity-80">●●●● 🔋</div>
              </div>
              {/* Content */}
              <div className="overflow-y-auto overflow-x-hidden" style={{ height: 'calc(618px - 46px - 56px)' }}>
                <Component />
              </div>
              {/* Bottom nav */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E8E4DC] px-1 py-1.5" style={{ borderRadius: '0 0 41px 41px' }}>
                <div className="flex items-center justify-around">
                  {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${activeTab === tab.id ? 'text-[#0F2A47]' : 'text-[#ccc]'}`}>
                      <div className={`p-1 rounded-xl ${activeTab === tab.id ? 'bg-[#0F2A47]/10' : ''}`}>
                        <tab.icon size={14} strokeWidth={activeTab === tab.id ? 2.5 : 1.8} />
                      </div>
                      <span className="text-[8px] font-bold">{isAr ? tab.labelAr : tab.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Physical buttons */}
          <div className="absolute top-20 -right-[3px] w-[3px] h-10 bg-[#C8A951]/30 rounded-r-full" />
          <div className="absolute top-16 -left-[3px] w-[3px] h-7 bg-[#C8A951]/30 rounded-l-full" />
          <div className="absolute top-28 -left-[3px] w-[3px] h-12 bg-[#C8A951]/30 rounded-l-full" />
          <div className="absolute top-44 -left-[3px] w-[3px] h-12 bg-[#C8A951]/30 rounded-l-full" />
        </div>

        {/* ── Install panel ── */}
        <div className="flex flex-col gap-3 flex-1 max-w-xs w-full">

          {/* App card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <img src="/sumu-logo.png" alt="SUMU" className="w-14 h-14 rounded-2xl object-cover shadow-lg border border-[#C8A951]/30" />
              <div>
                <h2 className="font-black text-white text-base leading-tight">سمو SUMU</h2>
                <p className="text-white/40 text-xs mt-0.5">{isAr ? 'منصة الخليج المتكاملة' : 'Premium Gulf Super-App'}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[#C8A951] text-[11px]">★★★★★</span>
                  <span className="text-white/25 text-[10px]">4.9 (2.4k)</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 mb-4">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[#C8A951] text-xs font-black">✓</span>
                  <span className="text-white/55 text-xs">{f}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 text-[10px] text-white/20 border-t border-white/8 pt-3 mb-4">
              <span>v2.0</span><span>·</span><span>~2.4 MB</span><span>·</span><span>PWA</span>
            </div>

            {/* Install button */}
            {isInstalled ? (
              <div className="w-full py-3.5 bg-emerald-600/15 border border-emerald-400/25 rounded-2xl flex items-center justify-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" />
                <span className="font-black text-emerald-400 text-sm">
                  {isAr ? 'مثبّت على جهازك ✓' : 'Installed on device ✓'}
                </span>
              </div>
            ) : (
              <button
                onClick={handleInstall}
                disabled={installing}
                className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg,#C8A951,#e0c06a,#C8A951)', color: '#0F2A47', boxShadow: '0 8px 24px rgba(200,169,81,.3)' }}
              >
                {installing ? (
                  <><span className="w-4 h-4 border-2 border-[#0F2A47]/30 border-t-[#0F2A47] rounded-full animate-spin" />
                  {isAr ? 'جاري التثبيت...' : 'Installing...'}</>
                ) : (
                  <><Download size={17} />
                  {isAr ? 'تنزيل التطبيق — مجاناً' : 'Install App — Free'}</>
                )}
              </button>
            )}

            {isIOS && !isInstalled && (
              <button onClick={() => setShowIOSGuide(true)}
                className="w-full mt-2 py-2.5 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-white/45 text-xs font-black hover:bg-white/5">
                <Share size={12} className="text-[#C8A951]" />
                {isAr ? 'تثبيت على iPhone / iPad' : 'Install on iPhone / iPad'}
              </button>
            )}
          </div>

          {/* PWA badge */}
          <div className="bg-white/5 border border-white/8 rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C8A951]/15 rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone size={16} className="text-[#C8A951]" />
            </div>
            <div>
              <p className="text-white text-xs font-black">Progressive Web App</p>
              <p className="text-white/30 text-[10px]">
                {isAr ? 'لا يحتاج متجر تطبيقات — يعمل على أي جهاز' : 'No app store needed — works on any device'}
              </p>
            </div>
          </div>

          {/* Offline badge */}
          <div className="bg-white/5 border border-white/8 rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
              <WifiOff size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-white text-xs font-black">{isAr ? 'وضع عدم الاتصال' : 'Offline Mode'}</p>
              <p className="text-white/30 text-[10px]">
                {isAr ? 'يحفظ البيانات ويعمل بدون إنترنت' : 'Caches data and works offline'}
              </p>
            </div>
          </div>

          <p className="text-white/15 text-[10px] text-center">{isAr ? 'مجاني تماماً — بدون إعلانات' : 'Completely free — no ads'}</p>
        </div>
      </div>

      {/* iOS Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setShowIOSGuide(false)}>
          <div className="bg-[#0d1b30] border border-white/15 rounded-3xl w-full max-w-sm p-6 shadow-2xl"
            dir={isAr ? 'rtl' : 'ltr'} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-white text-lg">{isAr ? 'تثبيت على iPhone / iPad' : 'Install on iPhone / iPad'}</h2>
              <button onClick={() => setShowIOSGuide(false)}
                className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20">
                <X size={14} />
              </button>
            </div>
            <div className="space-y-4 mb-5">
              {[
                { icon: '⬆️', ar: ['اضغط زر المشاركة في Safari', 'أيقونة المربع والسهم في الأسفل'], en: ['Tap the Share button in Safari', 'The box-and-arrow icon at the bottom'] },
                { icon: '➕', ar: ['اختر "Add to Home Screen"', 'مرر للأسفل في قائمة المشاركة'], en: ['Select "Add to Home Screen"', 'Scroll down in the share sheet'] },
                { icon: '✅', ar: ['اضغط "Add" للتأكيد', 'ستظهر أيقونة سمو على شاشتك الرئيسية'], en: ['Tap "Add" to confirm', 'SUMU icon will appear on your home screen'] },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">{s.icon}</div>
                  <div>
                    <p className="text-white font-black text-sm">{isAr ? s.ar[0] : s.en[0]}</p>
                    <p className="text-white/35 text-xs mt-0.5">{isAr ? s.ar[1] : s.en[1]}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#C8A951]/10 border border-[#C8A951]/20 rounded-2xl p-3 mb-4 text-center">
              <p className="text-[#C8A951] text-xs font-black">📱 {isAr ? 'يجب فتح الموقع من متصفح Safari فقط' : 'Must be opened in Safari browser only'}</p>
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

/* ─── Main component: auto-detects standalone vs browser ─── */
export default function MobileApp() {
  const { t, isAr } = useLang()

  // True when running as installed PWA or on a real mobile browser
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true

  const isMobileBrowser = /android|iphone|ipad|ipod/i.test(navigator.userAgent)

  if (isStandalone || isMobileBrowser) {
    return <MobileAppFullscreen isAr={isAr} />
  }

  return <MobileAppPreview isAr={isAr} t={t} />
}
