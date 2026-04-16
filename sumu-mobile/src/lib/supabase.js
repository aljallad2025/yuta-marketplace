import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── إعدادات Supabase ───────────────────────────────────────────────────────
// قم بتعديل هذه القيم بمشروعك على https://supabase.com
const SUPABASE_URL = 'https://xyzcompany.supabase.co'; // ضع رابط مشروعك هنا
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // ضع المفتاح هنا

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ─── SQL لإنشاء الجداول في Supabase ─────────────────────────────────────────
/*
انسخ هذا SQL وشغّله في Supabase SQL Editor:

-- 1. جدول الفئات
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- 2. جدول المتاجر
CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  category TEXT REFERENCES categories(id),
  rating NUMERIC(3,1) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  delivery_time TEXT DEFAULT '20-30',
  delivery_fee NUMERIC(8,2) DEFAULT 0,
  min_order NUMERIC(8,2) DEFAULT 0,
  emoji TEXT DEFAULT '🏪',
  description_ar TEXT,
  description_en TEXT,
  is_open BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  badge_ar TEXT,
  badge_en TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. جدول المنتجات
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  store_id INT REFERENCES stores(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  price NUMERIC(8,2) NOT NULL,
  emoji TEXT DEFAULT '🍽️',
  category TEXT DEFAULT 'رئيسية',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. جدول العروض
CREATE TABLE offers (
  id SERIAL PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  subtitle_ar TEXT,
  subtitle_en TEXT,
  color TEXT DEFAULT '#0F2A47',
  emoji TEXT DEFAULT '🎉',
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0
);

-- 5. جدول الملفات الشخصية
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT,
  wallet NUMERIC(10,2) DEFAULT 0,
  avatar TEXT DEFAULT '👤',
  total_orders INT DEFAULT 0,
  total_rides INT DEFAULT 0,
  rating NUMERIC(3,1) DEFAULT 5.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. جدول الطلبات
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  store_id INT REFERENCES stores(id),
  store_name_ar TEXT,
  store_name_en TEXT,
  store_emoji TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(8,2) DEFAULT 0,
  delivery_address TEXT,
  payment_method TEXT DEFAULT 'cash',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','preparing','on_the_way','delivered','cancelled')),
  eta INT DEFAULT 30,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. جدول رحلات التاكسي
CREATE TABLE taxi_rides (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  pickup_address TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  car_type TEXT NOT NULL,
  fare NUMERIC(8,2) NOT NULL,
  status TEXT DEFAULT 'searching' CHECK (status IN ('searching','confirmed','on_the_way','completed','cancelled')),
  driver_name TEXT,
  driver_emoji TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. إنشاء profile تلقائياً عند تسجيل مستخدم جديد
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'مستخدم جديد'),
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 9. Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE taxi_rides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users can view own rides" ON taxi_rides FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users can insert own rides" ON taxi_rides FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "stores are public" ON stores FOR SELECT USING (true);
CREATE POLICY "products are public" ON products FOR SELECT USING (true);
CREATE POLICY "categories are public" ON categories FOR SELECT USING (true);
CREATE POLICY "offers are public" ON offers FOR SELECT USING (true);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- 10. إدخال البيانات الأولية
INSERT INTO categories (id, name_ar, name_en, icon, sort_order) VALUES
('all',        'الكل',       'All',          '🏪', 0),
('restaurant', 'مطاعم',     'Restaurants',   '🍽️', 1),
('grocery',    'بقالة',      'Grocery',       '🛒', 2),
('pharmacy',   'صيدلية',    'Pharmacy',      '💊', 3),
('coffee',     'قهوة',       'Coffee',        '☕', 4),
('sweets',     'حلويات',    'Sweets',        '🍰', 5),
('electronics','إلكترونيات', 'Electronics',  '📱', 6),
('fashion',    'أزياء',      'Fashion',       '👗', 7);

INSERT INTO stores (name_ar, name_en, category, rating, review_count, delivery_time, delivery_fee, min_order, emoji, description_ar, description_en, is_open, is_featured, badge_ar, badge_en) VALUES
('بهارات المطبخ','Baharat Kitchen','restaurant',4.8,324,'25-35',5,30,'🍛','أشهى المأكولات الشرقية والهندية','Best Eastern & Indian cuisine',true,true,'الأكثر طلباً','Most Ordered'),
('برجرتينو','Burgetino','restaurant',4.6,218,'20-30',7,25,'🍔','برغر مميز بمكونات طازجة','Premium burgers with fresh ingredients',true,true,'جديد','New'),
('سوبر ماركت الخليج','Gulf Supermarket','grocery',4.5,156,'30-45',0,50,'🛒','كل احتياجاتك في مكان واحد','All your needs in one place',true,false,'توصيل مجاني','Free Delivery'),
('صيدلية الشفاء','Al Shifa Pharmacy','pharmacy',4.9,89,'15-25',5,20,'💊','أدوية وصحة ومستلزمات طبية','Medicine, health & medical supplies',true,false,null,null),
('كافيه النخيل','Al Nakheel Cafe','coffee',4.7,445,'20-30',8,20,'☕','قهوة مميزة ومشروبات باردة وساخنة','Premium coffee & hot/cold beverages',false,true,null,null),
('حلويات الأمير','Al Amir Sweets','sweets',4.8,201,'30-40',5,35,'🍰','حلويات شرقية وغربية راقية','Premium Eastern & Western sweets',true,false,null,null);

INSERT INTO products (store_id, name_ar, name_en, description_ar, description_en, price, emoji, category) VALUES
(1,'دجاج بالبهارات','Spiced Chicken','دجاج مشوي مع أرز بسمتي','Grilled chicken with basmati rice',38,'🍗','رئيسية'),
(1,'بيريياني لحم','Mutton Biryani','أرز بيريياني مع لحم الضأن','Biryani rice with mutton',45,'🍛','رئيسية'),
(1,'كباب مشكل','Mixed Kebab','تشكيلة من الكباب المشوي','Assorted grilled kebabs',52,'🥩','رئيسية'),
(1,'سمبوسة','Samosa','سمبوسة محشية بالخضار','Vegetable stuffed samosa',15,'🥟','مقبلات'),
(1,'شاي هندي','Masala Tea','شاي بالحليب والبهارات','Milk tea with spices',10,'🍵','مشروبات'),
(1,'لاسي مانجو','Mango Lassi','لبن مانجو منعش','Refreshing mango yogurt',15,'🥭','مشروبات'),
(2,'برغر كلاسيك','Classic Burger','برغر لحم مع خس وطماطم','Beef burger with lettuce & tomato',32,'🍔','برغر'),
(2,'برغر دجاج حار','Spicy Chicken Burger','برغر دجاج حار مقرمش','Crispy spicy chicken burger',30,'🌶️','برغر'),
(2,'بطاطس مقلية','French Fries','بطاطس ذهبية مقرمشة','Golden crispy fries',15,'🍟','جانبية'),
(2,'شيكسباكر','Shakeburger','برغر مزدوج مع جبنة','Double patty with cheese',45,'🧆','برغر'),
(2,'مشروب غازي','Soft Drink','كوكاكولا أو بيبسي','Coca-Cola or Pepsi',8,'🥤','مشروبات'),
(3,'أرز بسمتي','Basmati Rice','أرز بسمتي هندي','Indian basmati rice 1kg',12,'🍚','حبوب'),
(3,'عصير برتقال','Orange Juice','عصير برتقال طازج','Fresh orange juice 1L',8,'🍊','عصائر'),
(3,'خبز عربي','Arabic Bread','خبز عربي طازج','Fresh Arabic bread pack',5,'🫓','خبز'),
(3,'حليب طازج','Fresh Milk','حليب طازج 1 لتر','Fresh milk 1L',10,'🥛','ألبان'),
(3,'بيض','Eggs','بيض طازج 12 حبة','12 fresh eggs',18,'🥚','ألبان');

INSERT INTO offers (title_ar, title_en, subtitle_ar, subtitle_en, color, emoji, sort_order) VALUES
('خصم 30% على أول طلب','30% off your first order','استخدم كود: SUMU30','Use code: SUMU30','#0F2A47','🎉',1),
('توصيل مجاني','Free Delivery','لطلبات فوق 50 درهم','Orders above 50 AED','#C8A951','🚀',2),
('اطلب الآن وادفع لاحقاً','Order Now, Pay Later','بدون فوائد مع سومو','Interest-free with Sumu','#1A6B4A','💳',3);
*/
