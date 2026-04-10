import { Router } from 'express'
import multer from 'multer'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync } from 'fs'
import { getDb } from '../db.js'
import { verifyToken } from '../middleware/auth.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = join(__dirname, '..', '..', 'public', 'uploads')
mkdirSync(UPLOADS_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    cb(null, `${unique}${extname(file.originalname)}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (allowed.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Only images allowed'))
  },
})

// POST /api/uploads/image
const router = Router()
router.post('/image', verifyToken, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

  const db = getDb()
  const result = db.prepare(`
    INSERT INTO uploads (filename, original_name, mime_type, size, path, uploaded_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(req.file.filename, req.file.originalname, req.file.mimetype, req.file.size, `/uploads/${req.file.filename}`, req.user.id)

  res.status(201).json({
    id: result.lastInsertRowid,
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename,
  })
})

export default router
