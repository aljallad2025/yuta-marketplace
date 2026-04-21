import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../store/authStore'

export default function UserLogin() {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ username: '', password: '', name: '', email: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async () => {
    setLoading(true); setError('')
    try {
      if (tab === 'login') {
        await login(form.username, form.password)
        navigate('/web')
      } else {
        await register({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: 'customer' })
        navigate('/web')
      }
    } catch (e) {
      console.error('Login error:', error); setError(tab === 'login' ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'حدث خطأ، حاول مجدداً')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center px-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#0F2A47]">سمو SUMU</h1>
          <p className="text-gray-500 text-sm mt-1">منصة الخليج المتكاملة</p>
        </div>

        <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
          <button onClick={() => setTab('login')} className={`flex-1 py-2 text-sm font-semibold transition ${tab === 'login' ? 'bg-[#0F2A47] text-white' : 'text-gray-500'}`}>تسجيل الدخول</button>
          <button onClick={() => setTab('register')} className={`flex-1 py-2 text-sm font-semibold transition ${tab === 'register' ? 'bg-[#0F2A47] text-white' : 'text-gray-500'}`}>حساب جديد</button>
        </div>

        <div className="space-y-3">
          {tab === 'register' && (
            <input name="name" value={form.name} onChange={handle} placeholder="الاسم الكامل"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C8A951]" />
          )}
          <input name={tab === 'login' ? 'username' : 'email'} value={tab === 'login' ? form.username : form.email} onChange={handle}
            placeholder={tab === 'login' ? 'اسم المستخدم أو البريد' : 'البريد الإلكتروني'}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C8A951]" />
          {tab === 'register' && (
            <input name="phone" value={form.phone} onChange={handle} placeholder="رقم الهاتف"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C8A951]" />
          )}
          <input name="password" type="password" value={form.password} onChange={handle} placeholder="كلمة المرور"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C8A951]" />
        </div>

        {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

        <button onClick={submit} disabled={loading}
          className="w-full mt-5 bg-[#C8A951] text-white font-bold py-3 rounded-xl hover:bg-[#b8973f] transition disabled:opacity-50">
          {loading ? '...' : tab === 'login' ? 'دخول' : 'إنشاء حساب'}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          <Link to="/web" className="hover:text-gray-600">العودة للموقع</Link>
        </p>
      </div>
    </div>
  )
}
