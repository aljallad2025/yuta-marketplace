import { useLang } from '../i18n/LangContext'

export default function PrivacyPolicy() {
  const { lang } = useLang()
  const isAr = lang === 'ar'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
          {isAr ? 'آخر تحديث: أبريل 2026' : 'Last updated: April 2026'}
        </p>

        {[
          {
            title: isAr ? '١. جمع البيانات' : '1. Data Collection',
            body: isAr
              ? 'نقوم بجمع البيانات الشخصية التي تقدمها عند التسجيل مثل الاسم، البريد الإلكتروني، ورقم الهاتف.'
              : 'We collect personal data you provide during registration such as name, email, and phone number.',
          },
          {
            title: isAr ? '٢. استخدام البيانات' : '2. Use of Data',
            body: isAr
              ? 'نستخدم بياناتك لتقديم الخدمات، تحسين التطبيق، وإرسال الإشعارات المتعلقة بطلباتك.'
              : 'We use your data to provide services, improve the app, and send order-related notifications.',
          },
          {
            title: isAr ? '٣. مشاركة البيانات' : '3. Data Sharing',
            body: isAr
              ? 'لا نشارك بياناتك مع أطراف ثالثة إلا عند الضرورة لتقديم الخدمة (مثل السائقين والمتاجر).'
              : 'We do not share your data with third parties except when necessary to provide the service.',
          },
          {
            title: isAr ? '٤. الأمان' : '4. Security',
            body: isAr
              ? 'نحمي بياناتك باستخدام تشفير SSL وأحدث معايير الأمان.'
              : 'We protect your data using SSL encryption and the latest security standards.',
          },
          {
            title: isAr ? '٥. حقوقك' : '5. Your Rights',
            body: isAr
              ? 'يحق لك طلب حذف بياناتك أو تعديلها في أي وقت عبر التواصل معنا.'
              : 'You have the right to request deletion or modification of your data at any time.',
          },
          {
            title: isAr ? '٦. التواصل' : '6. Contact',
            body: isAr
              ? 'لأي استفسار بخصوص الخصوصية، تواصل معنا عبر البريد الإلكتروني.'
              : 'For any privacy inquiries, contact us via email.',
          },
        ].map((section, i) => (
          <div key={i} className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{section.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
