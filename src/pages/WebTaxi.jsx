import { useState } from 'react'
import { MapPin, Navigation, Car, Zap, Users, Clock, Star, ArrowRight, ChevronDown } from 'lucide-react'

const rideTypes = [
  { id: 'economy', label: 'Economy', emoji: '🚗', desc: 'Affordable rides', basePrice: 3, perKm: 1.2, eta: '4 min', seats: 4 },
  { id: 'comfort', label: 'Comfort', emoji: '🚙', desc: 'Comfortable sedans', basePrice: 6, perKm: 1.8, eta: '6 min', seats: 4 },
  { id: 'premium', label: 'Premium', emoji: '🚘', desc: 'Premium vehicles', basePrice: 10, perKm: 2.5, eta: '8 min', seats: 4 },
  { id: 'xl', label: 'XL', emoji: '🚐', desc: 'Group & luggage', basePrice: 12, perKm: 2.8, eta: '10 min', seats: 7 },
]

const recentRides = [
  { from: 'Dubai Mall', to: 'Dubai Airport T3', date: 'Today, 9:15 AM', price: 42, type: 'Economy', rating: 5 },
  { from: 'JBR Beach', to: 'Mall of Emirates', date: 'Yesterday, 7:30 PM', price: 28, type: 'Comfort', rating: 4 },
  { from: 'Business Bay', to: 'Palm Jumeirah', date: 'Mar 28, 2:00 PM', price: 35, type: 'Economy', rating: 5 },
]

export default function WebTaxi() {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [selectedRide, setSelectedRide] = useState('economy')
  const [step, setStep] = useState('select') // select | confirm | tracking

  const ride = rideTypes.find(r => r.id === selectedRide)
  const distance = 8.4
  const fare = (ride.basePrice + ride.perKm * distance).toFixed(1)

  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      <div className="bg-[#0F2A47] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-1">Book a Ride</h1>
          <p className="text-white/60 text-sm">Premium taxi service across UAE</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Booking Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Location Inputs */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E6E1]">
              <h2 className="font-semibold text-[#0F2A47] mb-4">Where to?</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-[#F8F6F1] rounded-xl px-4 py-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0"></div>
                  <input type="text" value={pickup} onChange={e => setPickup(e.target.value)}
                    placeholder="Pickup location"
                    className="flex-1 outline-none text-sm bg-transparent text-[#222]" />
                  <Navigation size={15} className="text-[#C8A951]" />
                </div>
                <div className="flex items-center gap-3 bg-[#F8F6F1] rounded-xl px-4 py-3">
                  <div className="w-3 h-3 rounded-full bg-[#0F2A47] flex-shrink-0"></div>
                  <input type="text" value={dropoff} onChange={e => setDropoff(e.target.value)}
                    placeholder="Drop-off location"
                    className="flex-1 outline-none text-sm bg-transparent text-[#222]" />
                  <MapPin size={15} className="text-[#C8A951]" />
                </div>
              </div>

              {/* Quick locations */}
              <div className="mt-3 flex flex-wrap gap-2">
                {['Dubai Airport', 'Dubai Mall', 'Burj Khalifa', 'Palm Jumeirah'].map(loc => (
                  <button key={loc} onClick={() => setDropoff(loc)}
                    className="px-3 py-1.5 bg-[#F8F6F1] text-[#444] text-xs rounded-lg border border-[#E8E6E1] hover:border-[#C8A951]/40">
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Ride Types */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E6E1]">
              <h2 className="font-semibold text-[#0F2A47] mb-3">Select Ride Type</h2>
              <div className="space-y-2">
                {rideTypes.map(rt => (
                  <button key={rt.id} onClick={() => setSelectedRide(rt.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      selectedRide === rt.id ? 'border-[#0F2A47] bg-[#0F2A47]/5' : 'border-[#E8E6E1] hover:border-[#C8A951]/40'
                    }`}>
                    <span className="text-2xl">{rt.emoji}</span>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm text-[#222]">{rt.label}</p>
                      <div className="flex items-center gap-2 text-xs text-[#666]">
                        <Clock size={10} /> {rt.eta}
                        <Users size={10} className="ml-1" /> {rt.seats} seats
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#0F2A47] text-sm">
                        ~{(rt.basePrice + rt.perKm * distance).toFixed(0)} AED
                      </p>
                      <p className="text-xs text-[#666]">{rt.perKm} AED/km</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fare Estimate */}
            <div className="bg-[#0F2A47] rounded-2xl p-5 text-white">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold">Fare Estimate</p>
                <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">{ride.label}</span>
              </div>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex justify-between"><span>Base fare</span><span>{ride.basePrice} AED</span></div>
                <div className="flex justify-between"><span>Distance ({distance} km)</span><span>{(ride.perKm * distance).toFixed(1)} AED</span></div>
                <div className="flex justify-between border-t border-white/20 pt-2 font-bold text-white text-base">
                  <span>Total</span><span>{fare} AED</span>
                </div>
              </div>
              <button
                onClick={() => setStep('tracking')}
                className="w-full mt-4 py-3 bg-[#C8A951] hover:bg-[#b8942f] text-[#0F2A47] font-bold rounded-xl transition-all">
                Confirm Ride — {fare} AED
              </button>
            </div>
          </div>

          {/* Map Area */}
          <div className="lg:col-span-3 space-y-4">
            {step === 'tracking' ? (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8E6E1]">
                {/* Simulated map */}
                <div className="relative bg-[#e8f4e8] h-80 flex items-center justify-center overflow-hidden">
                  {/* Grid lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 320">
                    {[0,40,80,120,160,200,240,280,320,360,400].map(x => (
                      <line key={x} x1={x} y1="0" x2={x} y2="320" stroke="#94a3b8" strokeWidth="0.5"/>
                    ))}
                    {[0,40,80,120,160,200,240,280,320].map(y => (
                      <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#94a3b8" strokeWidth="0.5"/>
                    ))}
                    {/* Route */}
                    <path d="M80 260 C120 240, 180 200, 240 160 C300 120, 330 100, 330 80" stroke="#0F2A47" strokeWidth="3" fill="none" strokeDasharray="8,4"/>
                    {/* Start */}
                    <circle cx="80" cy="260" r="8" fill="#2ECC71"/>
                    {/* End */}
                    <circle cx="330" cy="80" r="8" fill="#E74C3C"/>
                    {/* Car position */}
                    <circle cx="200" cy="175" r="14" fill="#0F2A47"/>
                    <text x="200" y="179" textAnchor="middle" fill="white" fontSize="10">🚗</text>
                  </svg>
                  <div className="absolute top-4 left-4 bg-white rounded-xl px-4 py-2 shadow-sm text-xs font-medium text-[#0F2A47]">
                    Driver 4 min away
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F8F6F1] rounded-full flex items-center justify-center text-xl">👨‍✈️</div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#222]">Ahmed Al Rashidi</p>
                      <div className="flex items-center gap-2 text-sm text-[#666]">
                        <Star size={13} className="fill-[#C8A951] text-[#C8A951]" />
                        <span>4.94 · Toyota Camry · <strong>DXB 3421</strong></span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#666]">Estimated</p>
                      <p className="font-bold text-[#0F2A47]">{fare} AED</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 py-2.5 bg-[#F8F6F1] text-[#0F2A47] rounded-xl text-sm font-medium border border-[#E8E6E1]">
                      📞 Call Driver
                    </button>
                    <button className="flex-1 py-2.5 bg-[#F8F6F1] text-[#0F2A47] rounded-xl text-sm font-medium border border-[#E8E6E1]">
                      💬 Message
                    </button>
                    <button onClick={() => setStep('select')} className="px-4 py-2.5 bg-danger/10 text-red-600 rounded-xl text-sm font-medium border border-red-200">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8E6E1]">
                <div className="relative bg-[#e8f4e8] h-72 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 290">
                    {[0,40,80,120,160,200,240,280,320,360,400].map(x => (
                      <line key={x} x1={x} y1="0" x2={x} y2="290" stroke="#94a3b8" strokeWidth="0.5"/>
                    ))}
                    {[0,40,80,120,160,200,240,280].map(y => (
                      <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#94a3b8" strokeWidth="0.5"/>
                    ))}
                  </svg>
                  <div className="text-center relative z-10">
                    <p className="text-[#0F2A47] font-semibold text-sm">📍 Enter locations to see route</p>
                    <p className="text-[#666] text-xs mt-1">Select pickup & drop-off</p>
                  </div>
                </div>
                <div className="p-4 bg-[#F8F6F1] border-t border-[#E8E6E1]">
                  <p className="text-xs text-[#666] text-center">Live map · Multiple drivers available</p>
                </div>
              </div>
            )}

            {/* Recent Rides */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E6E1]">
              <h2 className="font-semibold text-[#0F2A47] mb-4">Recent Rides</h2>
              <div className="space-y-3">
                {recentRides.map((ride, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[#F8F6F1] rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Car size={16} className="text-[#0F2A47]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#222]">{ride.from} → {ride.to}</p>
                      <p className="text-xs text-[#666]">{ride.date} · {ride.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#0F2A47] text-sm">{ride.price} AED</p>
                      <div className="flex items-center gap-1 justify-end">
                        <Star size={10} className="fill-[#C8A951] text-[#C8A951]" />
                        <span className="text-xs text-[#666]">{ride.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
