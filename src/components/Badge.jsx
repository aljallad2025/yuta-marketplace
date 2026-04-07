const variants = {
  pending:    'bg-yellow-100 text-yellow-700 border-yellow-200',
  accepted:   'bg-blue-100 text-blue-700 border-blue-200',
  preparing:  'bg-purple-100 text-purple-700 border-purple-200',
  on_the_way: 'bg-orange-100 text-orange-700 border-orange-200',
  delivered:  'bg-emerald-100 text-emerald-700 border-emerald-200',
  completed:  'bg-green-100 text-green-700 border-green-200',
  cancelled:  'bg-red-100 text-red-700 border-red-200',
  active:     'bg-emerald-100 text-emerald-700 border-emerald-200',
  inactive:   'bg-gray-100 text-gray-600 border-gray-200',
  suspended:  'bg-red-100 text-red-700 border-red-200',
  approved:   'bg-green-100 text-green-700 border-green-200',
  gold:       'bg-[#C8A951]/15 text-[#a88b3a] border-[#C8A951]/30',
  blue:       'bg-[#0F2A47]/10 text-[#0F2A47] border-[#0F2A47]/20',
}

export default function Badge({ status, variant, label, children, className = '' }) {
  const key = variant || status
  const cls = variants[key] || variants.inactive
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls} ${className}`}>
      {children || label || key?.replace(/_/g, ' ')}
    </span>
  )
}
