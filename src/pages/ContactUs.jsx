import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = e => {
    e.preventDefault()
    window.location.href = `mailto:info@yuta-app.store?subject=رسالة من ${form.name}&body=${form.message}%0A%0Aالهاتف: ${form.phone}%0Aالبريد: ${form.email}`
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] py-12 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">تواصل معنا</h1>
        <p className="text-center text-gray-500 mb-10">نحن هنا لمساعدتك في أي وقت</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* معلومات التواصل */}
          <div className="bg-white rounded-2xl shadow p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">معلومات التواصل</h2>
            <div className="flex items-center gap-3 text-gray-600">
              <Mail size={20} className="text-[#00C9A7]" />
              <a href="mailto:info@yuta-app.store" className="hover:text-[#00C9A7]">info@yuta-app.store</a>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Phone size={20} className="text-[#00C9A7]" />
              <span>+966 5X XXX XXXX</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin size={20} className="text-[#00C9A7]" />
              <span>المملكة العربية السعودية</span>
            </div>
          </div>

          {/* فورم التواصل */}
          <div className="bg-white rounded-2xl shadow p-6">
            {sent ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✅</div>
                <p className="text-gray-700 font-semibold">تم فتح تطبيق البريد الإلكتروني</p>
                <p className="text-gray-500 text-sm mt-2">سنرد عليك في أقرب وقت</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <input name="name" value={form.name} onChange={handle} required placeholder="الاسم الكامل"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00C9A7]" />
                <input name="email" type="email" value={form.email} onChange={handle} required placeholder="البريد الإلكتروني"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00C9A7]" />
                <input name="phone" value={form.phone} onChange={handle} placeholder="رقم الهاتف"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00C9A7]" />
                <textarea name="message" value={form.message} onChange={handle} required placeholder="رسالتك" rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00C9A7] resize-none" />
                <button type="submit"
                  className="w-full bg-[#00C9A7] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#b8973f] transition">
                  <Send size={16} /> إرسال
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
