import { useState } from 'react'
import { MapPin, Navigation, Clock, Users } from 'lucide-react'

const rideTypes = [
  { id: 'economy', label: 'Economy', emoji: '🚗', eta: '4 min', fare: '12' },
  { id: 'comfort', label: 'Comfort', emoji: '🚙', eta: '6 min', fare: '19' },
  { id: 'premium', label: 'Premium', emoji: '🚘', eta: '8 min', fare: '31' },
  { id: 'xl', label: 'XL', emoji: '🚐', eta: '10 min', fare: '36' },
]

export default function MobileTaxi() {
  const [selected, setSelected] = useState('economy')
  const [booked, setBooked] = useState(false)

  const ride = rideTypes.find(r => r.id === selected)

  if (booked) return (
    <div className="bg-[#F8F6F1]">
      {/* Simulated map */}
      <div className="relative bg-[#d4edda] h-52 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 390 210">
          {[0,30,60,90,120,150,180,210,240,270,300,330,360,390].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="210" stroke="#94a3b8" strokeWidth="0.5"/>
          ))}
          {[0,30,60,90,120,150,180,210].map(y => (
            <line key={y} x1="0" y1={y} x2="390" y2={y} stroke="#94a3b8" strokeWidth="0.5"/>
          ))}
          <path d="M60 180 C100 160, 160 130, 220 100 C280 70, 320 50, 330 40" stroke="#0F2A47" strokeWidth="3" fill="none" strokeDasharray="6,3"/>
          <circle cx="60" cy="180" r="7" fill="#2ECC71"/>
          <circle cx="330" cy="40" r="7" fill="#E74C3C"/>
          <circle cx="190" cy="115" r="12" fill="#0F2A47"/>
          <text x="190" y="120" textAnchor="middle" fill="white" fontSize="10">🚗</text>
        </svg>
        <div className="absolute top-3 left-3 bg-white rounded-xl px-3 py-1.5 shadow-sm text-xs font-medium text-[#0F2A47]">
          Driver 4 min away
        </div>
        <button onClick={() => setBooked(false)} className="absolute top-3 right-3 bg-white rounded-xl px-3 py-1.5 shadow-sm text-xs font-medium text-red-600">
          Cancel
        </button>
      </div>

      <div className="p-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8E6E1]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#F8F6F1] rounded-full flex items-center justify-center text-xl">👨‍✈️</div>
            <div className="flex-1">
              <p className="font-semibold text-[#222] text-sm">Ahmed Al Rashidi</p>
              <p className="text-xs text-[#666]">⭐ 4.94 · Toyota Camry</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#0F2A47] text-sm">{ride.fare} AED</p>
            </div>
          </div>
          <div className="bg-[#0F2A47] text-white text-center rounded-xl py-2 mt-3 text-sm font-bold tracking-widest">
            DXB 3421
          </div>
          <div className="flex gap-2 mt-3">
            <button className="flex-1 py-2 bg-[#F8F6F1] text-[#0F2A47] text-xs rounded-xl border border-[#E8E6E1] font-medium">📞 Call</button>
            <button className="flex-1 py-2 bg-[#F8F6F1] text-[#0F2A47] text-xs rounded-xl border border-[#E8E6E1] font-medium">💬 Message</button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-[#F8F6F1]">
      <div className="bg-[#0F2A47] px-4 pt-2 pb-4">
        <h2 className="text-white font-bold text-base">Book a Ride</h2>
        <p className="text-white/50 text-xs mt-0.5">Fast, safe rides across UAE</p>
      </div>

      {/* Map preview */}
      <div className="mx-3 mt-3 bg-[#e8f4e8] rounded-2xl h-36 flex items-center justify-center relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 350 150">
          {[0,30,60,90,120,150,180,210,240,270,300,330,350].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="150" stroke="#94a3b8" strokeWidth="0.5"/>
          ))}
          {[0,30,60,90,120,150].map(y => (
            <line key={y} x1="0" y1={y} x2="350" y2={y} stroke="#94a3b8" strokeWidth="0.5"/>
          ))}
        </svg>
        <p className="text-xs text-[#0F2A47] font-medium relative z-10">📍 Enter locations below</p>
      </div>

      {/* Location inputs */}
      <div className="px-3 mt-3 space-y-2">
        <div className="flex items-center gap-3 bg-white rounded-xl px-3 py-3 shadow-sm border border-[#E8E6E1]">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0"></div>
          <p className="text-xs text-[#666] flex-1">Your location</p>
          <Navigation size={13} className="text-[#C8A951]" />
        </div>
        <div className="flex items-center gap-3 bg-white rounded-xl px-3 py-3 shadow-sm border border-[#E8E6E1]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0F2A47] flex-shrink-0"></div>
          <p className="text-xs text-[#999] flex-1">Where to?</p>
          <MapPin size={13} className="text-[#C8A951]" />
        </div>
      </div>

      {/* Ride types */}
      <div className="px-3 mt-3">
        <p className="text-xs font-bold text-[#0F2A47] mb-2">Choose Ride</p>
        <div className="grid grid-cols-2 gap-2">
          {rideTypes.map(rt => (
            <button key={rt.id} onClick={() => setSelected(rt.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selected === rt.id ? 'border-[#0F2A47] bg-[#0F2A47]/5' : 'border-[#E8E6E1] bg-white'
              }`}>
              <span className="text-xl">{rt.emoji}</span>
              <p className="font-semibold text-xs text-[#222] mt-1">{rt.label}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-[#666] flex items-center gap-0.5"><Clock size={9}/> {rt.eta}</span>
                <span className="text-xs font-bold text-[#0F2A47]">{rt.fare} AED</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Confirm button */}
      <div className="px-3 mt-4 pb-4">
        <button onClick={() => setBooked(true)}
          className="w-full py-3.5 bg-[#0F2A47] text-white font-bold text-sm rounded-2xl shadow-lg">
          Confirm {ride.label} — {ride.fare} AED
        </button>
      </div>
    </div>
  )
}
