import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Truck, Lock, User, Phone, Mail, Car } from 'lucide-react'
import { useAuth } from '../../store/authStore'
import { useLang } from '../../i18n/LangContext'
import LangToggle from '../../components/LangToggle'

export default function DriverLogin() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', password: '', nameAr: '', nameEn: '', email: '', phone: '', vehicleAr: '', vehicleEn: '', plate: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [regError, setRegError] = useState('')
  const { login, loginError, setLoginError, register } = useAuth()
  const { isAr } = useLang()
  const navigate = useNavigate()

  const errorMsgs = {
    username_password_wrong: isAr ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Username or password is incorrect',
    wrong_role: isAr ? 'هذا ليس حساب سائق' : 'This is not a driver account',
    pending_approval: isAr ? 'طلبك قيد المراجعة من الإدارة. يرجى الانتظار' : 'Your application is pending admin approval. Please wait.',
    rejected: isAr ? 'تم رفض طلبك من قبل الإدارة' : 'Your application was rejected by admin',
    suspended: isAr ? 'تم تعليق حسابك' : 'Your account has been suspended',
  }

  const regErrors = {
    username_taken: isAr ? 'اسم المستخدم مستخدم بالفعل' : 'Username already taken',
    email_taken: isAr ? 'البريد الإلكتروني مستخدم بالفعل' : 'Email already in use',
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const ok = login(form.username, form.password, 'driver')
      setLoading(false)
      if (ok) navigate('/driver')
    }, 600)
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setRegError('')
    if (!form.nameAr || !form.nameEn || !form.username || !form.password || !form.phone) {
      setRegError(isAr ? 'يرجى ملء الحقول المطلوبة' : 'Please fill required fields')
      return
    }
    setLoading(true)
    setTimeout(() => {
      const result = register({ ...form, role: 'driver', avatar: '🚗' })
      setLoading(false)
      if (result.success) setRegistered(true)
      else setRegError(regErrors[result.error] || (isAr ? 'حدث خطأ' : 'An error occurred'))
    }, 600)
  }

  if (registered) {
    return (
      <div className="min-h-screen bg-[#0D1B4B] flex items-center justify-center p-4" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="font-black text-[#0D1B4B] text-xl mb-2">{isAr ? 'تم استلام طلبك!' : 'Application Received!'}</h2>
          <p className="text-[#666] text-sm mb-4">
            {isAr
              ? 'طلب انضمامك كسائق تم استلامه وسيتم مراجعته من قبل إدارة يوتا.'
              : 'Your driver application has been received and will be reviewed by YUTA admin.'}
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">
            <p className="text-xs font-black text-amber-700">{isAr ? `📋 اسم المستخدم: ${form.username}` : `📋 Username: ${form.username}`}</p>
          </div>
          <button onClick={() => { setRegistered(false); setMode('login') }}
            className="w-full py-3 bg-[#E74C3C] text-white font-black rounded-xl text-sm">
            {isAr ? 'العودة لتسجيل الدخول' : 'Back to Login'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D1B4B] flex items-center justify-center p-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="absolute top-4 end-4">
        <LangToggle className="border-white/20 bg-white/10 text-white" />
      </div>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#E74C3C]/20 border-2 border-[#E74C3C]/40 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Truck size={36} className="text-[#E74C3C]" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-2xl font-black text-[#00C9A7]">يوتا</span>
            <span className="text-white/30">·</span>
            <span className="text-2xl font-black text-white tracking-widest">YUTA</span>
          </div>
          <p className="text-white/50 text-sm">{isAr ? 'بوابة موظفي التوصيل' : 'Delivery Driver Portal'}</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/10 rounded-2xl p-1 mb-4">
          {[
            { key: 'login', ar: 'تسجيل الدخول', en: 'Sign In' },
            { key: 'register', ar: 'انضم كسائق', en: 'Join as Driver' },
          ].map(tab => (
            <button key={tab.key} onClick={() => { setMode(tab.key); setLoginError(''); setRegError('') }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${mode === tab.key ? 'bg-white text-[#0D1B4B]' : 'text-white/60 hover:text-white'}`}>
              {isAr ? tab.ar : tab.en}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-2xl">
          {mode === 'login' ? (
            <>
              <h1 className="font-black text-[#0D1B4B] text-xl mb-1">{isAr ? 'دخول السائق' : 'Driver Login'}</h1>
              <p className="text-sm text-[#888] mb-5">{isAr ? 'ادخل بيانات حسابك المعتمد' : 'Enter your approved account credentials'}</p>

              {loginError && errorMsgs[loginError] && (
                <div className={`mb-4 rounded-xl p-3 text-sm font-black border ${
                  loginError === 'pending_approval' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-red-50 border-red-200 text-red-600'
                }`}>
                  {loginError === 'pending_approval' ? '⏳' : '⚠️'} {errorMsgs[loginError]}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-[#666] mb-1.5">{isAr ? 'اسم المستخدم' : 'Username'}</label>
                  <div className="relative">
                    <User size={15} className={`absolute top-1/2 -translate-y-1/2 text-[#aaa] ${isAr ? 'right-3' : 'left-3'}`} />
                    <input value={form.username} onChange={e => { setForm(f => ({ ...f, username: e.target.value })); setLoginError('') }}
                      className={`w-full border-2 border-[#D0EDEA] rounded-xl py-3 text-sm outline-none focus:border-[#E74C3C] ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
                      required dir="ltr" placeholder={isAr ? 'اسم المستخدم' : 'username'} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-[#666] mb-1.5">{getL(lang,'Password','รหัสผ่าน','ລະຫັດ','Mật khẩu')}</label>
                  <div className="relative">
                    <Lock size={15} className={`absolute top-1/2 -translate-y-1/2 text-[#aaa] ${isAr ? 'right-3' : 'left-3'}`} />
                    <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setLoginError('') }}
                      className={`w-full border-2 border-[#D0EDEA] rounded-xl py-3 text-sm outline-none focus:border-[#E74C3C] ${isAr ? 'pr-9 pl-10' : 'pl-9 pr-10'}`}
                      required dir="ltr" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className={`absolute top-1/2 -translate-y-1/2 text-[#aaa] ${isAr ? 'left-3' : 'right-3'}`}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-[#E74C3C] text-white font-black rounded-xl text-sm hover:bg-red-600 disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{isAr ? 'جاري...' : 'Loading...'}</> : (isAr ? 'دخول' : 'Sign In')}
                </button>
              </form>

              <div className="mt-4 bg-[#F0F9F8] rounded-xl p-3 text-center space-y-1">
                <p className="text-xs text-[#888] font-black">{isAr ? 'حسابات تجريبية:' : 'Demo accounts:'}</p>
                <p className="text-xs text-[#666]">ameri / driver123</p>
                <p className="text-xs text-[#666]">mutairi / driver456</p>
              </div>
            </>
          ) : (
            <>
              <h1 className="font-black text-[#0D1B4B] text-xl mb-1">{isAr ? 'انضم كسائق توصيل' : 'Join as Driver'}</h1>
              <p className="text-sm text-[#888] mb-5">{isAr ? 'سيتم مراجعة طلبك من قبل الإدارة' : 'Your application will be reviewed by admin'}</p>

              {regError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 font-black">⚠️ {regError}</div>
              )}

              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-black text-[#666] mb-1">{isAr ? 'الاسم (عربي)' : 'Name (AR)'} *</label>
                    <input value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))}
                      className="w-full border-2 border-[#D0EDEA] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#E74C3C]" dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-[#666] mb-1">{isAr ? 'الاسم (إنجليزي)' : 'Name (EN)'} *</label>
                    <input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))}
                      className="w-full border-2 border-[#D0EDEA] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#E74C3C]" dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-[#666] mb-1">{isAr ? 'اسم المستخدم' : 'Username'} *</label>
                  <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                    className="w-full border-2 border-[#D0EDEA] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#E74C3C]" dir="ltr" />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#666] mb-1">{getL(lang,'Password','รหัสผ่าน','ລະຫັດ','Mật khẩu')} *</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      className={`w-full border-2 border-[#D0EDEA] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#E74C3C] ${isAr ? 'pl-9' : 'pr-9'}`} dir="ltr" />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className={`absolute top-1/2 -translate-y-1/2 text-[#aaa] ${isAr ? 'left-3' : 'right-3'}`}>
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-[#666] mb-1">{getL(lang,'Phone','โทรศัพท์','ໂທ','Điện thoại')} *</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full border-2 border-[#D0EDEA] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#E74C3C]" dir="ltr" placeholder="+971..." />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-black text-[#666] mb-1">{isAr ? 'المركبة (ع)' : 'Vehicle (AR)'}</label>
                    <input value={form.vehicleAr} onChange={e => setForm(f => ({ ...f, vehicleAr: e.target.value }))}
                      className="w-full border-2 border-[#D0EDEA] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#E74C3C]" dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-[#666] mb-1">{isAr ? 'رقم اللوحة' : 'Plate'}</label>
                    <input value={form.plate} onChange={e => setForm(f => ({ ...f, plate: e.target.value }))}
                      className="w-full border-2 border-[#D0EDEA] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#E74C3C]" dir="ltr" placeholder="DXB-1234" />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-[#E74C3C] text-white font-black rounded-xl text-sm hover:bg-red-600 disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{isAr ? 'جاري...' : 'Loading...'}</> : (isAr ? 'إرسال الطلب' : 'Submit Application')}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-white/30 text-xs mt-5">
          <a href="/" className="hover:text-white/60">{isAr ? '← الرجوع للرئيسية' : '← Back to Home'}</a>
        </p>
      </div>
    </div>
  )
}
