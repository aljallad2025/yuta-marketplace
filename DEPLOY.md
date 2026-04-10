# 🚀 SUMU — دليل النشر على السيرفر الخاص

## المتطلبات على السيرفر
- Ubuntu 22.04 أو أحدث
- Node.js 20+ (`nvm` موصى به)
- PM2 (لإدارة العملية)
- Nginx (كـ reverse proxy)
- Certbot (لشهادة SSL)

---

## الخطوات من الصفر

### 1. رفع الملفات على السيرفر
```bash
# من جهازك المحلي
git clone <your-repo-url> /home/youruser/sumu
cd /home/youruser/sumu
```

أو رفع عبر `scp`:
```bash
scp -r ./sumu user@your-server-ip:/home/youruser/sumu
```

---

### 2. إعداد متغيرات البيئة
```bash
cd /home/youruser/sumu
cp .env.example .env
nano .env
```

عدّل القيم التالية في `.env`:
```env
NODE_ENV=production
PORT=4000
JWT_SECRET=your_very_long_random_secret_here
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
DB_PATH=./sumu.db
```

---

### 3. تثبيت الحزم وبناء الفرونت إند
```bash
npm install --omit=dev
# ثم تثبيت devDeps للبناء فقط
npm install
npm run build
```

---

### 4. إنشاء مجلد اللوجات
```bash
mkdir -p logs
mkdir -p public/uploads
```

---

### 5. تشغيل التطبيق عبر PM2
```bash
# تثبيت PM2 إن لم يكن موجود
npm install -g pm2

# تشغيل التطبيق
pm2 start ecosystem.config.cjs --env production

# تشغيل تلقائي عند إعادة تشغيل السيرفر
pm2 startup
pm2 save
```

أوامر PM2 المفيدة:
```bash
pm2 status          # حالة التطبيق
pm2 logs sumu       # اللوجات المباشرة
pm2 restart sumu    # إعادة التشغيل
pm2 stop sumu       # إيقاف
pm2 delete sumu     # حذف
```

---

### 6. إعداد Nginx
```bash
# نسخ ملف الإعداد
sudo cp nginx.conf /etc/nginx/sites-available/sumu

# تعديل yourdomain.com و youruser
sudo nano /etc/nginx/sites-available/sumu

# تفعيل الإعداد
sudo ln -s /etc/nginx/sites-available/sumu /etc/nginx/sites-enabled/
sudo nginx -t          # اختبار الإعداد
sudo systemctl reload nginx
```

---

### 7. شهادة SSL مجانية (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

### 8. التحقق من أن كل شيء يعمل
```bash
# API health check
curl https://yourdomain.com/api/health

# PM2 logs
pm2 logs sumu --lines 50
```

---

## تحديث التطبيق لاحقاً
```bash
cd /home/youruser/sumu
git pull
npm install
npm run build
pm2 restart sumu
```

---

## بيانات تسجيل الدخول الافتراضية (غيّرها فور الرفع!)

| الدور     | اسم المستخدم | كلمة المرور |
|-----------|--------------|-------------|
| Admin     | admin        | admin123    |
| Vendor 1  | baharat      | baharat123  |
| Vendor 2  | burgetino    | burger123   |
| Driver 1  | ameri        | driver123   |
| Driver 2  | mutairi      | driver456   |

> ⚠️ **مهم:** غيّر كلمات المرور فور رفع التطبيق!

---

## البنية في production
```
Client Browser
      │
      ▼
   Nginx (443/80)
      │
      ├── /uploads/*  →  static files (direct)
      │
      └── /*  →  Node.js :4000
                    │
                    ├── /api/*      →  Express Routes
                    ├── /socket.io  →  Socket.io
                    └── /*          →  React SPA (dist/)
```
