import { useState } from 'react'
import { useLang } from '../i18n/LangContext'
import LangToggle from '../components/LangToggle'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Smartphone, Folder, Terminal,
  Copy, Check, Package, Store, Zap, Shield, Globe,
} from 'lucide-react'

const SCREENS = [
  { name: 'HomeScreen',         emoji: '🏠', ar: 'الرئيسية',     en: 'Home',          desc: { ar: 'بانرات عروض + تصنيفات + متاجر مميزة + بحث', en: 'Offer banners + categories + featured stores + search' } },
  { name: 'StoresScreen',       emoji: '🏪', ar: 'المتاجر',       en: 'Stores',         desc: { ar: 'تصفح المتاجر مع فلتر التصنيفات', en: 'Browse stores with category filter' } },
  { name: 'StoreScreen',        emoji: '🛍️', ar: 'المتجر',        en: 'Store Detail',   desc: { ar: 'قائمة المنتجات + التصنيفات + إضافة للسلة', en: 'Product list + categories + add to cart' } },
  { name: 'CartScreen',         emoji: '🛒', ar: 'السلة',          en: 'Cart',           desc: { ar: 'ملخص الطلب + تعديل الكميات', en: 'Order summary + adjust quantities' } },
  { name: 'CheckoutScreen',     emoji: '💳', ar: 'الدفع',          en: 'Checkout',       desc: { ar: 'العنوان + طريقة الدفع + ملاحظات', en: 'Address + payment method + notes' } },
  { name: 'OrderPlacedScreen',  emoji: '🎉', ar: 'تأكيد الطلب',   en: 'Order Placed',   desc: { ar: 'تأكيد + تتبع حالة الطلب بالخطوات', en: 'Confirmation + step-by-step tracking' } },
  { name: 'OrdersScreen',       emoji: '📦', ar: 'طلباتي',         en: 'My Orders',      desc: { ar: 'الطلبات النشطة والسابقة مع الحالة', en: 'Active & past orders with status' } },
  { name: 'TaxiScreen',         emoji: '🚕', ar: 'التاكسي',        en: 'Taxi',           desc: { ar: 'أنواع السيارات + التكلفة المتوقعة + تتبع السائق', en: 'Car types + fare estimate + driver tracking' } },
  { name: 'AccountScreen',      emoji: '👤', ar: 'حسابي',          en: 'Account',        desc: { ar: 'الملف الشخصي + المحفظة + الإعدادات', en: 'Profile + wallet + settings' } },
  { name: 'NotificationsScreen',emoji: '🔔', ar: 'الإشعارات',     en: 'Notifications',  desc: { ar: 'قائمة الإشعارات مع حالة القراءة', en: 'Notification list with read status' } },
]

const BUILD_TYPES = {
  apk: {
    titleAr: 'APK — تثبيت مباشر',
    titleEn: 'APK — Direct Install',
    color: '#10B981',
    icon: '📲',
    descAr: 'للاختبار والتوزيع المباشر — لا يحتاج Google Play',
    descEn: 'For testing & direct distribution — no Google Play needed',
    steps: [
      { cmd: 'eas login', descAr: 'تسجيل الدخول إلى Expo', descEn: 'Login to Expo account' },
      { cmd: 'eas build --profile preview --platform android', descAr: 'بناء APK للاختبار', descEn: 'Build APK for testing' },
    ],
    output: { ar: 'رابط تحميل APK مباشر — قابل للتثبيت على أي جهاز أندرويد', en: 'Direct APK download link — installable on any Android device' },
    badges: ['✅ تثبيت مباشر', '✅ بدون متجر', '✅ للاختبار'],
    badgesEn: ['✅ Direct install', '✅ No store needed', '✅ For testing'],
  },
  aab: {
    titleAr: 'AAB — Google Play Store',
    titleEn: 'AAB — Google Play Store',
    color: '#3B82F6',
    icon: '🏪',
    descAr: 'Android App Bundle — المطلوب للرفع على Google Play Store',
    descEn: 'Android App Bundle — required for Google Play Store submission',
    steps: [
      { cmd: 'eas login', descAr: 'تسجيل الدخول إلى Expo', descEn: 'Login to Expo account' },
      { cmd: 'eas build --profile production --platform android', descAr: 'بناء AAB للإنتاج', descEn: 'Build AAB for production' },
    ],
    output: { ar: 'ملف AAB جاهز للرفع مباشرة على Google Play Console', en: 'AAB file ready to upload directly to Google Play Console' },
    badges: ['✅ Google Play', '✅ حجم أصغر', '✅ إنتاج رسمي'],
    badgesEn: ['✅ Google Play', '✅ Smaller size', '✅ Official production'],
  },
  aabDirect: {
    titleAr: 'AAB — توزيع داخلي',
    titleEn: 'AAB — Internal Distribution',
    color: '#8B5CF6',
    icon: '🔒',
    descAr: 'بناء AAB بدون متجر — للتوزيع على فريقك أو عملائك مباشرة',
    descEn: 'Build AAB without store — for distributing to your team or clients',
    steps: [
      { cmd: 'eas login', descAr: 'تسجيل الدخول إلى Expo', descEn: 'Login to Expo account' },
      { cmd: 'eas build --profile aab --platform android', descAr: 'بناء AAB داخلي', descEn: 'Build internal AAB' },
    ],
    output: { ar: 'AAB قابل للتنزيل من لوحة EAS — للتوزيع اليدوي', en: 'AAB downloadable from EAS dashboard — for manual distribution' },
    badges: ['✅ لا يحتاج متجر', '✅ AAB حقيقي', '✅ توزيع يدوي'],
    badgesEn: ['✅ No store needed', '✅ Real AAB', '✅ Manual distribution'],
  },
  ios: {
    titleAr: 'IPA — Apple App Store',
    titleEn: 'IPA — Apple App Store',
    color: '#F59E0B',
    icon: '🍎',
    descAr: 'يتطلب حساب Apple Developer ($99/سنة) + Mac أو EAS Cloud',
    descEn: 'Requires Apple Developer account ($99/year) + Mac or EAS Cloud',
    steps: [
      { cmd: 'eas login', descAr: 'تسجيل الدخول', descEn: 'Login to Expo' },
      { cmd: 'eas build --profile production --platform ios', descAr: 'بناء IPA للإنتاج', descEn: 'Build IPA for production' },
    ],
    output: { ar: 'IPA جاهز للرفع على App Store Connect', en: 'IPA ready to upload to App Store Connect' },
    badges: ['🍎 App Store', '💳 $99/year', '🔐 Apple Sign'],
    badgesEn: ['🍎 App Store', '💳 $99/year', '🔐 Apple Sign'],
  },
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="ml-2 flex-shrink-0 text-white/40 hover:text-white transition-colors"
    >
      {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
    </button>
  )
}

function BuildCard({ type, isAr }) {
  const d = BUILD_TYPES[type]
  const t = (ar, en) => isAr ? ar : en
  return (
    <div className="bg-[#0F1629] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors">
      {/* Header */}
      <div className="p-5" style={{ background: `linear-gradient(135deg, ${d.color}18, transparent)`, borderBottom: `1px solid ${d.color}30` }}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{d.icon}</span>
          <div>
            <h3 className="font-black text-white text-base">{t(d.titleAr, d.titleEn)}</h3>
            <p className="text-white/50 text-xs mt-0.5">{t(d.descAr, d.descEn)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {(isAr ? d.badges : d.badgesEn).map((b, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">{b}</span>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="p-5 space-y-3">
        {d.steps.map((s, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5"
              style={{ backgroundColor: d.color + '30', color: d.color }}>
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-white/40 text-[11px] mb-1">{t(s.descAr, s.descEn)}</p>
              <div className="flex items-center bg-black/40 rounded-lg px-3 py-1.5 font-mono text-xs" style={{ color: d.color }}>
                <span className="text-white/20 me-1.5">$</span>
                <span className="flex-1 truncate">{s.cmd}</span>
                <CopyButton text={s.cmd} />
              </div>
            </div>
          </div>
        ))}

        {/* Output */}
        <div className="mt-2 rounded-xl p-3 text-xs flex items-start gap-2" style={{ backgroundColor: d.color + '12', border: `1px solid ${d.color}25` }}>
          <span>📤</span>
          <p style={{ color: d.color }}>{t(d.output.ar, d.output.en)}</p>
        </div>
      </div>
    </div>
  )
}

export default function ReactNativePage() {
  const { isAr } = useLang()
  const t = (ar, en) => isAr ? ar : en
  const [activeTab, setActiveTab] = useState('build')

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Nav */}
      <div className="sticky top-0 z-50 bg-[#0A0F1E]/95 backdrop-blur border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
          <ArrowLeft size={15} style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
          {t('رجوع', 'Back')}
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#00D4FF] font-black">سومو</span>
          <span className="text-white/20">·</span>
          <span className="text-white/40">React Native</span>
        </div>
        <LangToggle className="border-white/20 bg-white/5 hover:bg-white/10 text-white/80" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded-full px-4 py-1.5 mb-5 text-[#00D4FF] text-xs font-bold">
            <Smartphone size={13} />
            Expo SDK 52 · React Navigation · EAS Build
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            {t('تطبيق سومو — React Native', 'Sumu App — React Native')}
          </h1>
          <p className="text-white/50 max-w-xl mx-auto text-sm">
            {t(
              'تطبيق جوال كامل يمكن تصديره كـ APK أو AAB لأندرويد، أو IPA لـ iOS.',
              'Full mobile app exportable as APK or AAB for Android, or IPA for iOS.'
            )}
          </p>
        </div>

        {/* Comparison Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          {[
            { icon: '📲', label: 'APK', descAr: 'تثبيت مباشر على الجهاز', descEn: 'Direct device install', color: '#10B981', badge: { ar: 'للاختبار', en: 'Testing' } },
            { icon: '📦', label: 'AAB', descAr: 'Google Play Store الرسمي', descEn: 'Official Google Play', color: '#3B82F6', badge: { ar: 'إنتاج', en: 'Production' }, highlight: true },
            { icon: '🍎', label: 'IPA', descAr: 'Apple App Store', descEn: 'Apple App Store', color: '#F59E0B', badge: { ar: 'iOS', en: 'iOS' } },
          ].map(item => (
            <div
              key={item.label}
              className={`rounded-2xl p-5 border text-center transition-all ${item.highlight ? 'border-[#3B82F6]/50 bg-[#3B82F6]/10' : 'border-white/10 bg-[#0F1629]'}`}
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <div className="font-black text-xl mb-1" style={{ color: item.color }}>{item.label}</div>
              <div className="text-white/60 text-xs mb-3">{t(item.descAr, item.descEn)}</div>
              <span className="text-[10px] font-bold px-3 py-1 rounded-full" style={{ backgroundColor: item.color + '25', color: item.color }}>
                {t(item.badge.ar, item.badge.en)}
              </span>
              {item.highlight && (
                <div className="mt-2 text-[10px] text-[#3B82F6]/80">⭐ {t('الأفضل للنشر', 'Best for publishing')}</div>
              )}
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-[#0F1629] p-1 rounded-xl border border-white/10 w-fit">
          {[
            { id: 'build', ar: '🔨 طرق البناء', en: '🔨 Build Methods' },
            { id: 'screens', ar: '📱 الشاشات', en: '📱 Screens' },
            { id: 'structure', ar: '📁 الهيكل', en: '📁 Structure' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#00D4FF] text-[#0A0F1E]'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {t(tab.ar, tab.en)}
            </button>
          ))}
        </div>

        {/* Tab: Build */}
        {activeTab === 'build' && (
          <div className="space-y-6">
            {/* Prerequisites */}
            <div className="bg-[#0F1629] border border-white/10 rounded-2xl p-5 mb-2">
              <h3 className="font-black text-white mb-4 flex items-center gap-2">
                <Terminal size={16} className="text-[#00D4FF]" />
                {t('الخطوات الأولى (مطلوبة لكل البناءات)', 'First Steps (required for all builds)')}
              </h3>
              <div className="space-y-2">
                {[
                  { cmd: 'cd sumu-mobile', descAr: 'الدخول لمجلد التطبيق', descEn: 'Enter app directory' },
                  { cmd: 'npm install', descAr: 'تثبيت المكتبات', descEn: 'Install dependencies' },
                  { cmd: 'npm install -g eas-cli', descAr: 'تثبيت أداة EAS', descEn: 'Install EAS CLI globally' },
                  { cmd: 'eas login', descAr: 'تسجيل الدخول (احتاج حساب expo.dev مجاني)', descEn: 'Login (needs free expo.dev account)' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-[#00D4FF]/20 rounded-full flex items-center justify-center text-[10px] font-black text-[#00D4FF] flex-shrink-0">{i + 1}</span>
                    <div className="flex-1 flex items-center bg-black/40 rounded-lg px-3 py-1.5 font-mono text-xs text-green-400">
                      <span className="text-white/20 me-2">$</span>
                      <span className="flex-1">{s.cmd}</span>
                      <CopyButton text={s.cmd} />
                    </div>
                    <span className="text-white/30 text-[11px] hidden sm:block">{t(s.descAr, s.descEn)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Build cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BuildCard type="apk" isAr={isAr} />
              <BuildCard type="aab" isAr={isAr} />
              <BuildCard type="aabDirect" isAr={isAr} />
              <BuildCard type="ios" isAr={isAr} />
            </div>

            {/* APK vs AAB Explanation */}
            <div className="bg-[#0F1629] border border-white/10 rounded-2xl p-6">
              <h3 className="font-black text-white mb-5">
                {t('🤔 APK مقابل AAB — ما الفرق؟', '🤔 APK vs AAB — What\'s the difference?')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl p-4">
                  <div className="font-black text-[#10B981] mb-2">📲 APK</div>
                  <ul className="space-y-1.5 text-sm text-white/70">
                    <li>✅ {t('تثبيت مباشر على الجهاز', 'Direct install on device')}</li>
                    <li>✅ {t('مشاركة مع فريقك سهلة', 'Easy team sharing')}</li>
                    <li>✅ {t('لا يحتاج متجر', 'No store needed')}</li>
                    <li>⚠️ {t('حجم أكبر من AAB', 'Larger size than AAB')}</li>
                    <li>❌ {t('لا يُقبل على Google Play', 'Not accepted on Google Play')}</li>
                  </ul>
                </div>
                <div className="bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-xl p-4">
                  <div className="font-black text-[#3B82F6] mb-2">📦 AAB</div>
                  <ul className="space-y-1.5 text-sm text-white/70">
                    <li>✅ {t('مطلوب لـ Google Play Store', 'Required for Google Play Store')}</li>
                    <li>✅ {t('حجم أصغر بـ 15-20%', '15-20% smaller size')}</li>
                    <li>✅ {t('Google تحوّله لـ APK تلقائياً', 'Google converts it to APK automatically')}</li>
                    <li>✅ {t('أداء أفضل', 'Better performance')}</li>
                    <li>⚠️ {t('لا يُثبَّت مباشرة بدون Google Play', "Can't install directly without Google Play")}</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 bg-[#C8A951]/10 border border-[#C8A951]/30 rounded-xl p-3 text-sm text-[#C8A951]">
                💡 {t(
                  'التوصية: استخدم APK للاختبار، وAAB عند الرفع على Google Play Store.',
                  'Recommendation: Use APK for testing, AAB when submitting to Google Play Store.'
                )}
              </div>
            </div>

            {/* Google Play Steps */}
            <div className="bg-[#0F1629] border border-white/10 rounded-2xl p-6">
              <h3 className="font-black text-white mb-5">
                {t('🏪 خطوات رفع AAB على Google Play', '🏪 Steps to upload AAB to Google Play')}
              </h3>
              <div className="space-y-3">
                {[
                  { step: '1', icon: '🔑', ar: 'فتح حساب Google Play Console (25$ مرة واحدة)', en: 'Open Google Play Console account ($25 one-time fee)', link: 'play.google.com/console' },
                  { step: '2', icon: '📱', ar: 'إنشاء تطبيق جديد في Google Play Console', en: 'Create a new app in Google Play Console', link: null },
                  { step: '3', icon: '🔨', ar: 'تشغيل: eas build --profile production --platform android', en: 'Run: eas build --profile production --platform android', cmd: 'eas build --profile production --platform android' },
                  { step: '4', icon: '📤', ar: 'تنزيل ملف AAB من لوحة EAS', en: 'Download the AAB file from EAS dashboard', link: 'expo.dev/accounts' },
                  { step: '5', icon: '🚀', ar: 'رفع AAB في Google Play Console تحت Internal Testing', en: 'Upload AAB in Google Play Console under Internal Testing', link: null },
                  { step: '6', icon: '✅', ar: 'نشر التطبيق بعد مراجعة Google (1-3 أيام)', en: 'Publish after Google review (1-3 days)', link: null },
                ].map(item => (
                  <div key={item.step} className="flex items-start gap-3">
                    <span className="w-7 h-7 bg-[#3B82F6]/20 rounded-full flex items-center justify-center text-[#3B82F6] text-xs font-black flex-shrink-0 mt-0.5">
                      {item.step}
                    </span>
                    <div>
                      <span className="me-2">{item.icon}</span>
                      <span className="text-white/70 text-sm">{t(item.ar, item.en)}</span>
                      {item.cmd && (
                        <div className="flex items-center bg-black/40 rounded-lg px-3 py-1 font-mono text-xs text-[#3B82F6] mt-1">
                          <span className="text-white/20 me-1.5">$</span>
                          <span className="flex-1">{item.cmd}</span>
                          <CopyButton text={item.cmd} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Screens */}
        {activeTab === 'screens' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SCREENS.map(screen => (
              <div key={screen.name}
                className="bg-[#0F1629] border border-white/10 rounded-xl p-4 flex items-start gap-4 hover:border-[#00D4FF]/30 transition-colors">
                <span className="text-3xl">{screen.emoji}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-white text-sm">{isAr ? screen.ar : screen.en}</span>
                    <span className="text-white/25 text-xs font-mono">{screen.name}.jsx</span>
                  </div>
                  <p className="text-white/50 text-xs">{isAr ? screen.desc.ar : screen.desc.en}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Structure */}
        {activeTab === 'structure' && (
          <div className="space-y-4">
            <div className="bg-[#0F1629] border border-white/10 rounded-2xl p-6 font-mono text-sm">
              <div className="text-[#00D4FF] mb-3 font-bold">sumu-mobile/</div>
              {[
                { l: 1, n: 'App.jsx', c: '#00D4FF', note: t('نقطة الدخول', 'Entry point') },
                { l: 1, n: 'index.js', c: '#00D4FF', note: t('تسجيل التطبيق', 'App registration') },
                { l: 1, n: 'app.json', c: '#C8A951', note: t('إعدادات Expo (اسم + أيقونة + bundle ID)', 'Expo config (name + icon + bundle ID)') },
                { l: 1, n: 'eas.json', c: '#C8A951', note: t('إعدادات البناء (APK + AAB + IPA)', 'Build profiles (APK + AAB + IPA)') },
                { l: 1, n: 'babel.config.js', c: '#6B7280', note: '' },
                { l: 1, n: 'src/', c: '#fff', note: '' },
                { l: 2, n: 'context/AppContext.js', c: '#A78BFA', note: t('السلة + الطلبات + المستخدم', 'Cart + orders + user') },
                { l: 2, n: 'navigation/AppNavigator.jsx', c: '#34D399', note: t('Bottom Tabs + Stack', 'Bottom Tabs + Stack') },
                { l: 2, n: 'screens/ (10 شاشات)', c: '#60A5FA', note: '' },
                { l: 3, n: 'HomeScreen.jsx', c: '#60A5FA', note: '' },
                { l: 3, n: 'StoresScreen.jsx', c: '#60A5FA', note: '' },
                { l: 3, n: 'StoreScreen.jsx', c: '#60A5FA', note: '' },
                { l: 3, n: 'CartScreen.jsx', c: '#60A5FA', note: '' },
                { l: 3, n: 'CheckoutScreen.jsx', c: '#60A5FA', note: '' },
                { l: 3, n: 'OrderPlacedScreen.jsx', c: '#60A5FA', note: '' },
                { l: 3, n: 'OrdersScreen.jsx', c: '#60A5FA', note: '' },
                { l: 3, n: 'TaxiScreen.jsx', c: '#60A5FA', note: '' },
                { l: 3, n: 'AccountScreen.jsx', c: '#60A5FA', note: '' },
                { l: 3, n: 'NotificationsScreen.jsx', c: '#60A5FA', note: '' },
                { l: 2, n: 'components/StoreCard.jsx', c: '#F472B6', note: '' },
                { l: 2, n: 'components/Header.jsx', c: '#F472B6', note: '' },
                { l: 2, n: 'constants/theme.js', c: '#FBBF24', note: t('الألوان + الخطوط', 'Colors + fonts') },
                { l: 2, n: 'constants/data.js', c: '#FBBF24', note: t('بيانات المتاجر + المنتجات', 'Stores + products data') },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 py-0.5" style={{ paddingInlineStart: `${item.l * 18}px` }}>
                  <span className="text-white/15 select-none">{item.l === 1 ? '├─' : item.l === 2 ? '│  ├─' : '│  │  ├─'}</span>
                  <span style={{ color: item.c }}>{item.n}</span>
                  {item.note && <span className="text-white/25 text-xs">— {item.note}</span>}
                </div>
              ))}
            </div>

            <div className="bg-[#0F1629] border border-white/10 rounded-2xl p-5">
              <h3 className="font-black mb-3 text-sm">{t('📍 مسار المشروع', '📍 Project Path')}</h3>
              <div className="flex items-center bg-black/40 rounded-lg px-4 py-2.5 font-mono text-sm text-white/60">
                <span className="text-white/20 me-2">📁</span>
                /home/user/app/sumu-mobile/
                <CopyButton text="cd /home/user/app/sumu-mobile" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
