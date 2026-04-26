import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Shield, Lock, User } from 'lucide-react'
import { useAuth } from '../../store/authStore'
import { useLang } from '../../i18n/LangContext'
import LangToggle from '../../components/LangToggle'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, loginError, setLoginError } = useAuth()
  const { isAr } = useLang()
  const navigate = useNavigate()

  const errorMsgs = {
    username_password_wrong: isAr ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Username or password is incorrect',
    wrong_role: isAr ? 'هذا الحساب ليس حساب مدير' : 'This account is not an admin account',
    suspended: isAr ? 'تم تعليق هذا الحساب' : 'This account has been suspended',
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(async () => {
      const ok = await login(username, password, 'admin')
      setLoading(false)
      if (ok) navigate('/admin')
    }, 600)
  }

  return (
    <div className="min-h-screen bg-[#0D1B4B] flex items-center justify-center p-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="absolute top-4 end-4">
        <LangToggle className="border-white/20 bg-white/10 text-white" />
      </div>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#00C9A7]/20 border-2 border-[#00C9A7]/40 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Shield size={36} className="text-[#00C9A7]" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-2xl font-black text-[#00C9A7]">يوتا</span>
            <span className="text-white/30">·</span>
            <span className="text-2xl font-black text-white tracking-widest">YUTA</span>
          </div>
          <p className="text-white/50 text-sm">{isAr ? 'لوحة تحكم المدير' : 'Admin Dashboard'}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 shadow-2xl">
          <h1 className="font-black text-[#0D1B4B] text-xl mb-1">{getL(lang,'Sign In','เข้าสู่ระบบ','ເຂົ້າ','Đăng nhập')}</h1>
          <p className="text-sm text-[#888] mb-6">{isAr ? 'ادخل بيانات المدير للمتابعة' : 'Enter admin credentials to continue'}</p>

          {loginError && errorMsgs[loginError] && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 font-black">
              ⚠️ {errorMsgs[loginError]}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-[#666] mb-1.5">{isAr ? 'اسم المستخدم' : 'Username'}</label>
              <div className="relative">
                <User size={15} className={`absolute top-1/2 -translate-y-1/2 text-[#aaa] ${isAr ? 'right-3' : 'left-3'}`} />
                <input
                  value={username}
                  onChange={e => { setUsername(e.target.value); setLoginError('') }}
                  placeholder={isAr ? 'اسم المستخدم' : 'Username'}
                  className={`w-full border-2 border-[#D0EDEA] rounded-xl py-3 text-sm outline-none focus:border-[#0D1B4B] transition-colors ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
                  required
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#666] mb-1.5">{getL(lang,'Password','รหัสผ่าน','ລະຫັດ','Mật khẩu')}</label>
              <div className="relative">
                <Lock size={15} className={`absolute top-1/2 -translate-y-1/2 text-[#aaa] ${isAr ? 'right-3' : 'left-3'}`} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setLoginError('') }}
                  placeholder="••••••••"
                  className={`w-full border-2 border-[#D0EDEA] rounded-xl py-3 text-sm outline-none focus:border-[#0D1B4B] transition-colors ${isAr ? 'pr-9 pl-10' : 'pl-9 pr-10'}`}
                  required
                  dir="ltr"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className={`absolute top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#666] ${isAr ? 'left-3' : 'right-3'}`}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0D1B4B] text-white font-black rounded-xl text-sm hover:bg-[#0A3D8F] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{isAr ? 'جاري التحقق...' : 'Verifying...'}</>
              ) : (
                <>{isAr ? 'دخول لوحة الإدارة' : 'Access Admin Panel'}</>
              )}
            </button>
          </form>

          {/* Hint */}
          <div className="mt-4 bg-[#F0F9F8] rounded-xl p-3 text-center">
            <p className="text-xs text-[#888] font-black">{isAr ? 'بيانات التجربة: admin / admin123' : 'Demo: admin / admin123'}</p>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-5">
          <a href="/" className="hover:text-white/60">{isAr ? '← الرجوع للرئيسية' : '← Back to Home'}</a>
        </p>
      </div>
    </div>
  )
}
