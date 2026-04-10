# سومو React Native — دليل البناء والتصدير

## المتطلبات

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- حساب Expo: [expo.dev](https://expo.dev)

---

## 1. تثبيت المكتبات

```bash
cd sumu-mobile
npm install
```

---

## 2. التشغيل المحلي (Development)

```bash
# تشغيل Expo Dev Server
npx expo start

# فتح على أندرويد (Emulator أو جهاز حقيقي)
npx expo start --android

# فتح على iOS (Simulator)
npx expo start --ios
```

---

## 3. بناء APK للاختبار (Preview Build)

```bash
# تسجيل الدخول إلى EAS
eas login

# إعداد المشروع (مرة واحدة)
eas build:configure

# بناء APK (Android - للتثبيت المباشر)
eas build --profile preview --platform android
```

الناتج: رابط تحميل APK مباشر يمكن تثبيته على أي جهاز أندرويد.

---

## 4. بناء AAB للنشر على Google Play (Production)

```bash
eas build --profile production --platform android
```

---

## 5. بناء IPA لـ iOS / App Store

```bash
# يتطلب حساب Apple Developer
eas build --profile production --platform ios
```

---

## 6. هيكل المشروع

```
sumu-mobile/
├── App.jsx                    # نقطة الدخول الرئيسية
├── index.js                   # تسجيل التطبيق
├── app.json                   # إعدادات Expo
├── eas.json                   # إعدادات EAS Build
├── babel.config.js            # Babel config
├── assets/                    # أيقونات وصور
└── src/
    ├── context/
    │   └── AppContext.js      # إدارة الحالة العامة (Context API)
    ├── navigation/
    │   └── AppNavigator.jsx   # Bottom Tabs + Stack Navigation
    ├── screens/
    │   ├── HomeScreen.jsx     # الرئيسية (بانرات + متاجر مميزة + بحث)
    │   ├── StoresScreen.jsx   # تصفح المتاجر بالتصنيف
    │   ├── StoreScreen.jsx    # تفاصيل المتجر + المنتجات
    │   ├── CartScreen.jsx     # السلة
    │   ├── CheckoutScreen.jsx # الدفع
    │   ├── OrderPlacedScreen.jsx # تأكيد الطلب + تتبع
    │   ├── OrdersScreen.jsx   # سجل الطلبات
    │   ├── TaxiScreen.jsx     # حجز التاكسي
    │   ├── AccountScreen.jsx  # الحساب الشخصي
    │   └── NotificationsScreen.jsx # الإشعارات
    ├── components/
    │   ├── StoreCard.jsx      # بطاقة المتجر
    │   └── Header.jsx         # رأس الصفحة القابل لإعادة الاستخدام
    └── constants/
        ├── theme.js           # الألوان والأبعاد والخطوط
        └── data.js            # بيانات تجريبية (متاجر، منتجات، عروض)
```

---

## 7. الميزات المطبقة

✅ الشاشة الرئيسية مع بانرات العروض وشريط التصنيفات والمتاجر المميزة
✅ البحث عن المتاجر
✅ تصفح المتاجر بالتصنيف (مطاعم، بقالة، صيدلية، قهوة، حلويات...)
✅ صفحة تفاصيل المتجر مع قائمة المنتجات والتصنيفات
✅ إضافة وإزالة المنتجات من السلة مع حفظ الحالة
✅ السلة مع ملخص الطلب
✅ صفحة الدفع (عنوان، طريقة الدفع: بطاقة/كاش/محفظة/Apple Pay)
✅ تأكيد الطلب مع تتبع حالة الطلب (أنيميشن)
✅ سجل الطلبات (نشطة وسابقة)
✅ حجز التاكسي مع أنواع السيارات والتكلفة المتوقعة
✅ تتبع الرحلة مع معلومات السائق
✅ الحساب الشخصي مع المحفظة والإعدادات
✅ الإشعارات
✅ دعم ثنائي اللغة (عربي/إنجليزي) مع RTL
✅ تصميم موحد (ألوان سومو الرسمية)
✅ جاهز للتصدير كـ APK (Android) و IPA (iOS)

---

## 8. تغيير API Server

في `src/constants/data.js` يمكنك استبدال البيانات الثابتة باستدعاءات API:

```js
// مثال: جلب المتاجر من الـ backend
const { data } = await axios.get('https://your-server.com/api/stores');
```

تأكد من إضافة `EXPO_PUBLIC_API_URL` في ملف `.env`:
```
EXPO_PUBLIC_API_URL=https://your-server.com
```
