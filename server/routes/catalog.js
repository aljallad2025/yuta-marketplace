import { Router } from 'express'
import { getDb } from '../db.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

// ── مطاعم ──────────────────────────────────────────
router.get('/restaurant/:store_id/menu', (req, res) => {
  const db = getDb()
  const items = db.prepare('SELECT * FROM restaurant_menus WHERE store_id=? AND available=1').all(req.params.store_id)
  res.json(items)
})
router.post('/restaurant/menu', verifyToken, (req, res) => {
  const { store_id, name_ar, name_en, description_ar, description_en, price, category_ar, category_en, calories, prep_time } = req.body
  const db = getDb()
  const r = db.prepare('INSERT INTO restaurant_menus (store_id,name_ar,name_en,description_ar,description_en,price,category_ar,category_en,calories,prep_time) VALUES (?,?,?,?,?,?,?,?,?,?)').run(store_id,name_ar,name_en,description_ar,description_en,price,category_ar,category_en,calories,prep_time)
  res.json({ id: r.lastInsertRowid })
})
router.put('/restaurant/menu/:id', verifyToken, (req, res) => {
  const { name_ar, name_en, description_ar, description_en, price, category_ar, category_en, calories, prep_time, available } = req.body
  const db = getDb()
  db.prepare('UPDATE restaurant_menus SET name_ar=COALESCE(?,name_ar), name_en=COALESCE(?,name_en), description_ar=COALESCE(?,description_ar), description_en=COALESCE(?,description_en), price=COALESCE(?,price), category_ar=COALESCE(?,category_ar), category_en=COALESCE(?,category_en), calories=COALESCE(?,calories), prep_time=COALESCE(?,prep_time), available=COALESCE(?,available) WHERE id=?').run(name_ar,name_en,description_ar,description_en,price,category_ar,category_en,calories,prep_time,available,req.params.id)
  res.json(db.prepare('SELECT * FROM restaurant_menus WHERE id=?').get(req.params.id))
})
router.delete('/restaurant/menu/:id', verifyToken, (req, res) => {
  getDb().prepare('DELETE FROM restaurant_menus WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

// ── فنادق ──────────────────────────────────────────
router.get('/hotels', (req, res) => {
  const db = getDb()
  const { guests } = req.query
  let hotels = db.prepare('SELECT * FROM hotels WHERE available=1').all()
  if (guests) hotels = hotels.filter(h => h.max_guests >= parseInt(guests))
  res.json(hotels)
})
router.post('/hotels', verifyToken, (req, res) => {
  const { store_id, room_type_ar, room_type_en, price_per_night, max_guests, amenities, check_in, check_out } = req.body
  const db = getDb()
  const r = db.prepare('INSERT INTO hotels (store_id,room_type_ar,room_type_en,price_per_night,max_guests,amenities,check_in,check_out) VALUES (?,?,?,?,?,?,?,?)').run(store_id,room_type_ar,room_type_en,price_per_night,max_guests,JSON.stringify(amenities||[]),check_in,check_out)
  res.json(db.prepare('SELECT * FROM hotels WHERE id=?').get(r.lastInsertRowid))
})
router.put('/hotels/:id', verifyToken, (req, res) => {
  const { room_type_ar, room_type_en, price_per_night, max_guests, amenities, check_in, check_out, available } = req.body
  const db = getDb()
  db.prepare('UPDATE hotels SET room_type_ar=COALESCE(?,room_type_ar), room_type_en=COALESCE(?,room_type_en), price_per_night=COALESCE(?,price_per_night), max_guests=COALESCE(?,max_guests), amenities=COALESCE(?,amenities), check_in=COALESCE(?,check_in), check_out=COALESCE(?,check_out), available=COALESCE(?,available) WHERE id=?').run(room_type_ar,room_type_en,price_per_night,max_guests,amenities?JSON.stringify(amenities):null,check_in,check_out,available,req.params.id)
  res.json(db.prepare('SELECT * FROM hotels WHERE id=?').get(req.params.id))
})
router.delete('/hotels/:id', verifyToken, (req, res) => {
  getDb().prepare('DELETE FROM hotels WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

// ── تذاكر طيران ────────────────────────────────────
router.get('/flights', (req, res) => {
  const db = getDb()
  const { from, to } = req.query
  let flights = db.prepare('SELECT * FROM flights WHERE seats_available > 0').all()
  if (from) flights = flights.filter(f => f.from_en?.toLowerCase().includes(from.toLowerCase()) || f.from_ar?.includes(from))
  if (to) flights = flights.filter(f => f.to_en?.toLowerCase().includes(to.toLowerCase()) || f.to_ar?.includes(to))
  res.json(flights)
})
router.post('/flights', verifyToken, (req, res) => {
  const { store_id, from_ar, from_en, to_ar, to_en, departure, arrival, airline, class_ar, class_en, price, seats_available, flight_number } = req.body
  const db = getDb()
  const r = db.prepare('INSERT INTO flights (store_id,from_ar,from_en,to_ar,to_en,departure,arrival,airline,class_ar,class_en,price,seats_available,flight_number) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)').run(store_id,from_ar,from_en,to_ar,to_en,departure,arrival,airline,class_ar,class_en,price,seats_available,flight_number)
  res.json(db.prepare('SELECT * FROM flights WHERE id=?').get(r.lastInsertRowid))
})
router.put('/flights/:id', verifyToken, (req, res) => {
  const { from_ar, from_en, to_ar, to_en, departure, arrival, airline, class_ar, class_en, price, seats_available, flight_number } = req.body
  const db = getDb()
  db.prepare('UPDATE flights SET from_ar=COALESCE(?,from_ar), from_en=COALESCE(?,from_en), to_ar=COALESCE(?,to_ar), to_en=COALESCE(?,to_en), departure=COALESCE(?,departure), arrival=COALESCE(?,arrival), airline=COALESCE(?,airline), class_ar=COALESCE(?,class_ar), class_en=COALESCE(?,class_en), price=COALESCE(?,price), seats_available=COALESCE(?,seats_available), flight_number=COALESCE(?,flight_number) WHERE id=?').run(from_ar,from_en,to_ar,to_en,departure,arrival,airline,class_ar,class_en,price,seats_available,flight_number,req.params.id)
  res.json(db.prepare('SELECT * FROM flights WHERE id=?').get(req.params.id))
})
router.delete('/flights/:id', verifyToken, (req, res) => {
  getDb().prepare('DELETE FROM flights WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

// ── أطباء ──────────────────────────────────────────
router.get('/doctors', (req, res) => {
  const db = getDb()
  const { specialty } = req.query
  let doctors = db.prepare('SELECT * FROM doctors').all()
  if (specialty) doctors = doctors.filter(d => d.specialty_en?.toLowerCase().includes(specialty.toLowerCase()) || d.specialty_ar?.includes(specialty))
  res.json(doctors)
})
router.post('/doctors', verifyToken, (req, res) => {
  const { store_id, name_ar, name_en, specialty_ar, specialty_en, price_consultation, available_days, available_times, experience_years } = req.body
  const db = getDb()
  const r = db.prepare('INSERT INTO doctors (store_id,name_ar,name_en,specialty_ar,specialty_en,price_consultation,available_days,available_times,experience_years) VALUES (?,?,?,?,?,?,?,?,?)').run(store_id,name_ar,name_en,specialty_ar,specialty_en,price_consultation,JSON.stringify(available_days||[]),JSON.stringify(available_times||[]),experience_years)
  res.json(db.prepare('SELECT * FROM doctors WHERE id=?').get(r.lastInsertRowid))
})
router.put('/doctors/:id', verifyToken, (req, res) => {
  const { name_ar, name_en, specialty_ar, specialty_en, price_consultation, available_days, available_times, experience_years } = req.body
  const db = getDb()
  db.prepare('UPDATE doctors SET name_ar=COALESCE(?,name_ar), name_en=COALESCE(?,name_en), specialty_ar=COALESCE(?,specialty_ar), specialty_en=COALESCE(?,specialty_en), price_consultation=COALESCE(?,price_consultation), available_days=COALESCE(?,available_days), available_times=COALESCE(?,available_times), experience_years=COALESCE(?,experience_years) WHERE id=?').run(name_ar,name_en,specialty_ar,specialty_en,price_consultation,available_days?JSON.stringify(available_days):null,available_times?JSON.stringify(available_times):null,experience_years,req.params.id)
  res.json(db.prepare('SELECT * FROM doctors WHERE id=?').get(req.params.id))
})
router.delete('/doctors/:id', verifyToken, (req, res) => {
  getDb().prepare('DELETE FROM doctors WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

// ── تأمين ──────────────────────────────────────────
router.get('/insurance', (req, res) => {
  const db = getDb()
  const { type } = req.query
  let plans = db.prepare('SELECT * FROM insurance_plans').all()
  if (type) plans = plans.filter(p => p.type_en?.toLowerCase() === type.toLowerCase())
  res.json(plans)
})
router.post('/insurance', verifyToken, (req, res) => {
  const { store_id, plan_name_ar, plan_name_en, type_ar, type_en, price_monthly, price_yearly, coverage_ar, coverage_en, max_coverage } = req.body
  const db = getDb()
  const r = db.prepare('INSERT INTO insurance_plans (store_id,plan_name_ar,plan_name_en,type_ar,type_en,price_monthly,price_yearly,coverage_ar,coverage_en,max_coverage) VALUES (?,?,?,?,?,?,?,?,?,?)').run(store_id,plan_name_ar,plan_name_en,type_ar,type_en,price_monthly,price_yearly,coverage_ar,coverage_en,max_coverage)
  res.json(db.prepare('SELECT * FROM insurance_plans WHERE id=?').get(r.lastInsertRowid))
})
router.put('/insurance/:id', verifyToken, (req, res) => {
  const { plan_name_ar, plan_name_en, type_ar, type_en, price_monthly, price_yearly, coverage_ar, coverage_en, max_coverage } = req.body
  const db = getDb()
  db.prepare('UPDATE insurance_plans SET plan_name_ar=COALESCE(?,plan_name_ar), plan_name_en=COALESCE(?,plan_name_en), type_ar=COALESCE(?,type_ar), type_en=COALESCE(?,type_en), price_monthly=COALESCE(?,price_monthly), price_yearly=COALESCE(?,price_yearly), coverage_ar=COALESCE(?,coverage_ar), coverage_en=COALESCE(?,coverage_en), max_coverage=COALESCE(?,max_coverage) WHERE id=?').run(plan_name_ar,plan_name_en,type_ar,type_en,price_monthly,price_yearly,coverage_ar,coverage_en,max_coverage,req.params.id)
  res.json(db.prepare('SELECT * FROM insurance_plans WHERE id=?').get(req.params.id))
})
router.delete('/insurance/:id', verifyToken, (req, res) => {
  getDb().prepare('DELETE FROM insurance_plans WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

// ── صيدلية ─────────────────────────────────────────
router.get('/pharmacy', (req, res) => {
  const db = getDb()
  const { store_id, search } = req.query
  let products = store_id
    ? db.prepare('SELECT * FROM pharmacy_products WHERE store_id=? AND stock>0').all(store_id)
    : db.prepare('SELECT * FROM pharmacy_products WHERE stock>0').all()
  if (search) products = products.filter(p => p.name_ar?.includes(search) || p.name_en?.toLowerCase().includes(search.toLowerCase()))
  res.json(products)
})
router.post('/pharmacy', verifyToken, (req, res) => {
  const { store_id, name_ar, name_en, generic_name, price, requires_prescription, category_ar, category_en, stock } = req.body
  const db = getDb()
  const r = db.prepare('INSERT INTO pharmacy_products (store_id,name_ar,name_en,generic_name,price,requires_prescription,category_ar,category_en,stock) VALUES (?,?,?,?,?,?,?,?,?)').run(store_id,name_ar,name_en,generic_name,price,requires_prescription?1:0,category_ar,category_en,stock||0)
  res.json(db.prepare('SELECT * FROM pharmacy_products WHERE id=?').get(r.lastInsertRowid))
})
router.put('/pharmacy/:id', verifyToken, (req, res) => {
  const { name_ar, name_en, generic_name, price, requires_prescription, category_ar, category_en, stock } = req.body
  const db = getDb()
  db.prepare('UPDATE pharmacy_products SET name_ar=COALESCE(?,name_ar), name_en=COALESCE(?,name_en), generic_name=COALESCE(?,generic_name), price=COALESCE(?,price), requires_prescription=COALESCE(?,requires_prescription), category_ar=COALESCE(?,category_ar), category_en=COALESCE(?,category_en), stock=COALESCE(?,stock) WHERE id=?').run(name_ar,name_en,generic_name,price,requires_prescription!=null?requires_prescription?1:0:null,category_ar,category_en,stock,req.params.id)
  res.json(db.prepare('SELECT * FROM pharmacy_products WHERE id=?').get(req.params.id))
})
router.delete('/pharmacy/:id', verifyToken, (req, res) => {
  getDb().prepare('DELETE FROM pharmacy_products WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

// ── كوزماتكس ───────────────────────────────────────
router.get('/cosmetics', (req, res) => {
  const db = getDb()
  const { brand, skin_type } = req.query
  let products = db.prepare('SELECT * FROM cosmetics WHERE stock>0').all()
  if (brand) products = products.filter(p => p.brand?.toLowerCase().includes(brand.toLowerCase()))
  if (skin_type) products = products.filter(p => p.skin_type_en?.toLowerCase().includes(skin_type.toLowerCase()))
  res.json(products)
})
router.post('/cosmetics', verifyToken, (req, res) => {
  const { store_id, name_ar, name_en, brand, price, category_ar, category_en, skin_type_ar, skin_type_en, stock } = req.body
  const db = getDb()
  const r = db.prepare('INSERT INTO cosmetics (store_id,name_ar,name_en,brand,price,category_ar,category_en,skin_type_ar,skin_type_en,stock) VALUES (?,?,?,?,?,?,?,?,?,?)').run(store_id,name_ar,name_en,brand,price,category_ar,category_en,skin_type_ar,skin_type_en,stock||0)
  res.json(db.prepare('SELECT * FROM cosmetics WHERE id=?').get(r.lastInsertRowid))
})
router.put('/cosmetics/:id', verifyToken, (req, res) => {
  const { name_ar, name_en, brand, price, category_ar, category_en, skin_type_ar, skin_type_en, stock } = req.body
  const db = getDb()
  db.prepare('UPDATE cosmetics SET name_ar=COALESCE(?,name_ar), name_en=COALESCE(?,name_en), brand=COALESCE(?,brand), price=COALESCE(?,price), category_ar=COALESCE(?,category_ar), category_en=COALESCE(?,category_en), skin_type_ar=COALESCE(?,skin_type_ar), skin_type_en=COALESCE(?,skin_type_en), stock=COALESCE(?,stock) WHERE id=?').run(name_ar,name_en,brand,price,category_ar,category_en,skin_type_ar,skin_type_en,stock,req.params.id)
  res.json(db.prepare('SELECT * FROM cosmetics WHERE id=?').get(req.params.id))
})
router.delete('/cosmetics/:id', verifyToken, (req, res) => {
  getDb().prepare('DELETE FROM cosmetics WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

export default router
