import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, '..', 'sumu.db')

let db

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    initSchema()
  }
  return db
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS stores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_ar TEXT NOT NULL,
      name_en TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'restaurant',
      logo TEXT DEFAULT '🏪',
      phone TEXT,
      min_order REAL DEFAULT 0,
      delivery_fee REAL DEFAULT 0,
      delivery_time TEXT DEFAULT '30-45',
      is_open INTEGER DEFAULT 1,
      rating REAL DEFAULT 4.5,
      rating_count INTEGER DEFAULT 0,
      address_ar TEXT,
      address_en TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      role TEXT NOT NULL CHECK(role IN ('admin','vendor','driver','customer')),
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name_ar TEXT NOT NULL,
      name_en TEXT NOT NULL,
      email TEXT UNIQUE,
      phone TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected','suspended')),
      avatar TEXT DEFAULT '👤',
      store_id INTEGER REFERENCES stores(id),
      driver_id TEXT,
      applied_at TEXT DEFAULT (datetime('now')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
      name_ar TEXT NOT NULL,
      name_en TEXT NOT NULL,
      emoji TEXT DEFAULT '🍽️',
      price REAL NOT NULL DEFAULT 0,
      stock INTEGER DEFAULT 0,
      category TEXT,
      description TEXT,
      is_active INTEGER DEFAULT 1,
      image_url TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name_ar TEXT,
      name_en TEXT,
      email TEXT UNIQUE,
      phone TEXT NOT NULL,
      wallet REAL DEFAULT 0,
      total_orders INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      store_id INTEGER NOT NULL REFERENCES stores(id),
      customer_id TEXT REFERENCES customers(id),
      driver_id TEXT REFERENCES users(id),
      customer_name_ar TEXT NOT NULL,
      customer_name_en TEXT,
      customer_phone TEXT NOT NULL,
      address_ar TEXT NOT NULL,
      address_en TEXT,
      items TEXT NOT NULL,
      subtotal REAL NOT NULL DEFAULT 0,
      delivery_fee REAL DEFAULT 0,
      total REAL NOT NULL DEFAULT 0,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','accepted','preparing','ready','on_the_way','completed','cancelled')),
      notes TEXT,
      rating INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS drivers (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      name_ar TEXT NOT NULL,
      name_en TEXT NOT NULL,
      phone TEXT NOT NULL,
      vehicle_ar TEXT,
      vehicle_en TEXT,
      plate TEXT,
      rating REAL DEFAULT 0,
      rating_count INTEGER DEFAULT 0,
      trips INTEGER DEFAULT 0,
      earnings REAL DEFAULT 0,
      location_ar TEXT,
      location_en TEXT,
      is_online INTEGER DEFAULT 0,
      status TEXT DEFAULT 'available' CHECK(status IN ('available','delivering','inactive','pending')),
      joined_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      title_ar TEXT NOT NULL,
      title_en TEXT NOT NULL,
      msg_ar TEXT,
      msg_en TEXT,
      store_id INTEGER,
      driver_id TEXT,
      user_id TEXT,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('credit','debit','withdrawal','commission')),
      description TEXT,
      order_id TEXT REFERENCES orders(id),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS uploads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT,
      mime_type TEXT,
      size INTEGER,
      path TEXT NOT NULL,
      uploaded_by TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `)
}

export function seedDatabase() {
  const d = getDb()
  const storeCount = d.prepare('SELECT COUNT(*) as cnt FROM stores').get()
  if (storeCount.cnt > 0) return // already seeded

  // Stores
  const insertStore = d.prepare(`
    INSERT INTO stores (name_ar, name_en, category, logo, phone, min_order, delivery_fee, delivery_time, is_open, rating, rating_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  insertStore.run('مطعم بهارات', 'Baharat Restaurant', 'restaurant', '🍽️', '+971501110001', 30, 0, '25-35', 1, 4.8, 312)
  insertStore.run('برجتينو', 'Burgetino', 'restaurant', '🍔', '+971501110002', 20, 2, '20-30', 1, 4.6, 198)
  insertStore.run('صيدلية الشفاء', 'Al Shifa Pharmacy', 'pharmacy', '💊', '+971501110003', 0, 5, '30-45', 1, 4.9, 87)
  insertStore.run('فريش مارت', 'Fresh Mart', 'supermarket', '🛒', '+971501110004', 50, 0, '45-60', 1, 4.4, 143)

  // Users (admin + vendors + drivers)
  const hash = (p) => bcrypt.hashSync(p, 10)
  const insertUser = d.prepare(`
    INSERT INTO users (id, role, username, password_hash, name_ar, name_en, email, phone, status, avatar, store_id, driver_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  insertUser.run('ADM-001', 'admin', 'admin', hash('admin123'), 'المدير العام', 'Super Admin', 'admin@sumu.ae', null, 'approved', '🛡️', null, null)
  insertUser.run('VND-001', 'vendor', 'baharat', hash('baharat123'), 'مطعم بهارات', 'Baharat Restaurant', 'baharat@sumu.ae', '+971501110001', 'approved', '🍽️', 1, null)
  insertUser.run('VND-002', 'vendor', 'burgetino', hash('burger123'), 'برجتينو', 'Burgetino', 'burgetino@sumu.ae', '+971501110002', 'approved', '🍔', 2, null)
  insertUser.run('VND-003', 'vendor', 'freshmart', hash('fresh123'), 'فريش مارت', 'Fresh Mart', 'freshmart@sumu.ae', '+971501110004', 'pending', '🛒', 4, null)
  insertUser.run('DRV-001', 'driver', 'ameri', hash('driver123'), 'محمد العامري', 'Mohammed Al Ameri', 'ameri@sumu.ae', '+971505001001', 'approved', '🚗', null, 'DRV-001')
  insertUser.run('DRV-002', 'driver', 'mutairi', hash('driver456'), 'علي المطيري', 'Ali Al Mutairi', 'mutairi@sumu.ae', '+971505002002', 'approved', '🚙', null, 'DRV-002')
  insertUser.run('DRV-003', 'driver', 'shammari', hash('driver789'), 'خالد الشمري', 'Khalid Al Shammari', 'shammari@sumu.ae', '+971505003003', 'pending', '🛵', null, 'DRV-003')

  // Drivers table
  const insertDriver = d.prepare(`
    INSERT INTO drivers (id, user_id, name_ar, name_en, phone, vehicle_ar, vehicle_en, plate, rating, rating_count, trips, earnings, location_ar, location_en, is_online, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  insertDriver.run('DRV-001','DRV-001','محمد العامري','Mohammed Al Ameri','+971505001001','تويوتا كورولا','Toyota Corolla','DXB-2341',4.9,310,1240,18600,'دبي مارينا','Dubai Marina',1,'delivering')
  insertDriver.run('DRV-002','DRV-002','علي المطيري','Ali Al Mutairi','+971505002002','هوندا سيفيك','Honda Civic','SHJ-1122',4.7,215,860,12900,'الخليج التجاري','Business Bay',1,'available')
  insertDriver.run('DRV-003','DRV-003','خالد الشمري','Khalid Al Shammari','+971505003003','هيونداي إلنترا','Hyundai Elantra','AJM-5678',4.8,140,540,8100,'الجميرا','Jumeirah',1,'available')
  insertDriver.run('DRV-004',null,'سالم الكعبي','Salem Al Kaabi','+971505004004','نيسان ألتيما','Nissan Altima','FUJ-9900',4.5,58,220,3300,'عجمان','Ajman',0,'inactive')

  // Products
  const insertProd = d.prepare(`
    INSERT INTO products (store_id, name_ar, name_en, emoji, price, stock, category, description, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  insertProd.run(1,'مشاوي مشكلة','Mixed Grill','🥩',55,50,'مشويات','تشكيلة من أشهى المشويات',1)
  insertProd.run(1,'كبسة دجاج','Chicken Kabsa','🍗',38,30,'أرز','كبسة دجاج بالبهارات العربية',1)
  insertProd.run(1,'عصير برتقال','Orange Juice','🍊',12,100,'مشروبات','عصير برتقال طازج',1)
  insertProd.run(1,'حمص','Hummus','🫘',15,40,'مقبلات','حمص بطحينة',1)
  insertProd.run(2,'برجر كلاسيك','Classic Burger','🍔',28,60,'برجر','برجر لحم أنجوس مشوي',1)
  insertProd.run(2,'برجر دجاج','Chicken Burger','🍗',25,45,'برجر','برجر دجاج مقرمش',1)
  insertProd.run(2,'بطاطس مقلية','French Fries','🍟',15,80,'وجبات جانبية','بطاطس مقلية مقرمشة',1)
  insertProd.run(3,'باراسيتامول','Paracetamol','💊',5,500,'مسكنات','مسكن ألم وخافض حرارة',1)
  insertProd.run(3,'فيتامين سي','Vitamin C','🍋',18,200,'فيتامينات','فيتامين سي 1000mg',1)
  insertProd.run(4,'حليب طازج','Fresh Milk','🥛',8,200,'ألبان','حليب طازج كامل الدسم',1)
  insertProd.run(4,'خبز عربي','Arabic Bread','🫓',3,150,'خبز','خبز عربي طازج',1)
  insertProd.run(4,'بيض طازج','Fresh Eggs','🥚',12,100,'بيض','بيض طازج 12 حبة',1)

  // Customers
  const insertCust = d.prepare(`INSERT INTO customers (id,name_ar,name_en,email,phone,wallet,total_orders,status) VALUES (?,?,?,?,?,?,?,?)`)
  insertCust.run('USR-001','نورة الكثيري','Noura Al Ketheri','noura@email.com','+971501234567',120,34,'active')
  insertCust.run('USR-002','فيصل الزهراني','Faisal Al Zahrani','faisal@email.com','+971509876543',50,18,'active')
  insertCust.run('USR-003','سارة البلوشي','Sara Al Balushi','sara@email.com','+971556543210',200,52,'active')
  insertCust.run('USR-004','محمد القحطاني','Mohammed Al Qahtani','mq@email.com','+971521122334',0,9,'active')
  insertCust.run('USR-005','لطيفة المنصوري','Latifa Al Mansoori','latifa@email.com','+971504455667',30,5,'suspended')
  insertCust.run('USR-006','جاسم الحربي','Jasim Al Harbi','jasim@email.com','+971507788990',80,27,'active')

  // Orders
  const now = Date.now()
  const insertOrder = d.prepare(`
    INSERT INTO orders (id, store_id, customer_id, driver_id, customer_name_ar, customer_name_en, customer_phone, address_ar, address_en, items, subtotal, delivery_fee, total, status, notes, created_at, updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `)
  const ts = (msAgo) => new Date(now - msAgo).toISOString()
  insertOrder.run('ORD-5001',1,'USR-001',null,'نورة الكثيري','Noura Al Ketheri','+971501234567','دبي مارينا، مبنى A، شقة 304','Dubai Marina, Block A, Apt 304',JSON.stringify([{productId:1,nameAr:'مشاوي مشكلة',qty:2,price:55},{productId:3,nameAr:'عصير برتقال',qty:1,price:12}]),122,0,122,'preparing','',ts(15*60000),ts(10*60000))
  insertOrder.run('ORD-5002',4,'USR-002',null,'فيصل الزهراني','Faisal Al Zahrani','+971509876543','برشا هايتس، برج المرسى','Barsha Heights, Al Mursa Tower',JSON.stringify([{productId:10,nameAr:'حليب طازج',qty:3,price:8},{productId:11,nameAr:'خبز عربي',qty:2,price:3}]),30,0,30,'pending','',ts(5*60000),ts(5*60000))
  insertOrder.run('ORD-5003',2,'USR-003','DRV-001','سارة البلوشي','Sara Al Balushi','+971556543210','الخليج التجاري، برج أوبوس','Business Bay, Opus Tower',JSON.stringify([{productId:5,nameAr:'برجر كلاسيك',qty:1,price:28},{productId:7,nameAr:'بطاطس مقلية',qty:1,price:15}]),43,2,45,'on_the_way','بدون بصل',ts(40*60000),ts(20*60000))
  insertOrder.run('ORD-5004',3,'USR-004','DRV-002','محمد القحطاني','Mohammed Al Qahtani','+971521122334','نخلة جميرا، فيلا 12','Palm Jumeirah, Villa 12',JSON.stringify([{productId:8,nameAr:'باراسيتامول',qty:2,price:5},{productId:9,nameAr:'فيتامين سي',qty:1,price:18}]),28,0,28,'completed','',ts(3*3600000),ts(2*3600000))
  insertOrder.run('ORD-5005',1,'USR-005','DRV-003','لطيفة المنصوري','Latifa Al Mansoori','+971504455667','وسط مدينة دبي، برج ستاندرد','Downtown Dubai, Standard Tower',JSON.stringify([{productId:2,nameAr:'كبسة دجاج',qty:2,price:38},{productId:4,nameAr:'حمص',qty:1,price:15}]),91,0,91,'accepted','',ts(25*60000),ts(15*60000))
  insertOrder.run('ORD-5006',2,'USR-006',null,'جاسم الحربي','Jasim Al Harbi','+971507788990','الجميرا بيتش ريزيدنس','JBR, Beach Residence',JSON.stringify([{productId:6,nameAr:'برجر دجاج',qty:2,price:25}]),50,2,52,'cancelled','',ts(5*3600000),ts(5*3600000))

  // Notifications
  const insertNotif = d.prepare(`INSERT INTO notifications (type,title_ar,title_en,msg_ar,msg_en,store_id,driver_id,is_read,created_at) VALUES (?,?,?,?,?,?,?,?,?)`)
  insertNotif.run('order','طلب جديد','New Order','طلب جديد #ORD-5002 من فيصل الزهراني','New order #ORD-5002 from Faisal',4,null,0,ts(5*60000))
  insertNotif.run('driver','سائق جديد','New Driver','خالد الشمري طلب الانضمام كسائق','Khalid applied as driver',null,null,0,ts(20*60000))
  insertNotif.run('store','متجر جديد','New Store','طلب فتح متجر جديد بانتظار الموافقة','New store request pending',null,null,1,ts(60*60000))

  console.log('✅ Database seeded successfully')
}
