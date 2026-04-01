import { useState } from 'react'
import { Save, Plus, X, Image, Tag, Percent, MapPin } from 'lucide-react'

const categories = [
  { id: 1, emoji: '🍔', name: 'Restaurants', stores: 48, active: true },
  { id: 2, emoji: '🛒', name: 'Supermarket', stores: 12, active: true },
  { id: 3, emoji: '💊', name: 'Pharmacies', stores: 15, active: true },
  { id: 4, emoji: '💄', name: 'Beauty', stores: 22, active: true },
  { id: 5, emoji: '📱', name: 'Electronics', stores: 18, active: true },
  { id: 6, emoji: '🏪', name: 'General Stores', stores: 34, active: true },
]

const promoCodes = [
  { code: 'SUMU10', discount: '25 AED', type: 'Fixed', uses: 142, limit: 500, active: true },
  { code: 'WELCOME20', discount: '20%', type: 'Percent', uses: 89, limit: 200, active: true },
  { code: 'TAXI15', discount: '15 AED', type: 'Fixed', uses: 234, limit: 300, active: false },
]

const banners = [
  { id: 1, title: 'Ramadan Offers', subtitle: '40% off selected stores', active: true },
  { id: 2, title: 'Free Delivery', subtitle: 'First order for new users', active: true },
  { id: 3, title: 'Taxi Promo', subtitle: 'Rides from 3 AED', active: false },
]

export default function AdminSettings() {
  const [deliveryFees, setDeliveryFees] = useState({ base: 5, freeAbove: 50, perKm: 1.5 })
  const [surgePricing, setSurgePricing] = useState({ multiplier: 1.5, threshold: 80 })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F2A47]">Platform Settings</h1>
        <p className="text-sm text-[#666]">Configure categories, fees, banners and more</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E6E1]">
          <div className="p-4 border-b border-[#F0EEE9] flex items-center justify-between">
            <h2 className="font-semibold text-[#0F2A47]">Service Categories</h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F2A47] text-white text-xs font-medium rounded-lg">
              <Plus size={12} /> Add Category
            </button>
          </div>
          <div className="p-4 space-y-2">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center gap-3 p-3 bg-[#F8F6F1] rounded-xl">
                <span className="text-xl">{cat.emoji}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm text-[#222]">{cat.name}</p>
                  <p className="text-xs text-[#666]">{cat.stores} stores</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-5 rounded-full transition-all ${cat.active ? 'bg-[#0F2A47]' : 'bg-[#E8E6E1]'} relative cursor-pointer`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${cat.active ? 'left-5' : 'left-0.5'}`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Fees */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E6E1]">
          <div className="p-4 border-b border-[#F0EEE9] flex items-center justify-between">
            <h2 className="font-semibold text-[#0F2A47]">Delivery Fee Settings</h2>
            <MapPin size={16} className="text-[#C8A951]" />
          </div>
          <div className="p-4 space-y-4">
            {[
              { label: 'Base Delivery Fee (AED)', key: 'base', unit: 'AED' },
              { label: 'Free Delivery Above (AED)', key: 'freeAbove', unit: 'AED' },
              { label: 'Per Km Rate (AED)', key: 'perKm', unit: 'AED/km' },
            ].map(field => (
              <div key={field.key}>
                <label className="text-xs font-semibold text-[#444] mb-2 block">{field.label}</label>
                <div className="flex items-center gap-2">
                  <input type="number" value={deliveryFees[field.key]}
                    onChange={e => setDeliveryFees(f => ({ ...f, [field.key]: +e.target.value }))}
                    className="flex-1 border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#C8A951]" />
                  <span className="text-xs text-[#666] w-14">{field.unit}</span>
                </div>
              </div>
            ))}
            <button className="w-full py-2.5 bg-[#0F2A47] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2">
              <Save size={14} /> Save Delivery Settings
            </button>
          </div>
        </div>

        {/* Surge Pricing */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E6E1]">
          <div className="p-4 border-b border-[#F0EEE9]">
            <h2 className="font-semibold text-[#0F2A47]">Taxi Surge Pricing</h2>
            <p className="text-xs text-[#666] mt-0.5">Automatically applied during high demand</p>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#444] mb-2 block">Surge Multiplier</label>
              <div className="flex items-center gap-3">
                <input type="range" min="1" max="3" step="0.1" value={surgePricing.multiplier}
                  onChange={e => setSurgePricing(s => ({ ...s, multiplier: +e.target.value }))}
                  className="flex-1 accent-[#C8A951]" />
                <span className="font-bold text-[#0F2A47] w-12 text-right">{surgePricing.multiplier}x</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#444] mb-2 block">Demand Threshold (%)</label>
              <div className="flex items-center gap-3">
                <input type="range" min="50" max="100" step="5" value={surgePricing.threshold}
                  onChange={e => setSurgePricing(s => ({ ...s, threshold: +e.target.value }))}
                  className="flex-1 accent-[#0F2A47]" />
                <span className="font-bold text-[#0F2A47] w-12 text-right">{surgePricing.threshold}%</span>
              </div>
            </div>
            <div className="bg-[#C8A951]/10 border border-[#C8A951]/30 rounded-xl p-3">
              <p className="text-xs text-[#a88b3a]">Surge activates when driver demand exceeds <strong>{surgePricing.threshold}%</strong> capacity, applying a <strong>{surgePricing.multiplier}x</strong> multiplier to base fares.</p>
            </div>
            <button className="w-full py-2.5 bg-[#0F2A47] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2">
              <Save size={14} /> Save Surge Settings
            </button>
          </div>
        </div>

        {/* Promo Codes */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E6E1]">
          <div className="p-4 border-b border-[#F0EEE9] flex items-center justify-between">
            <h2 className="font-semibold text-[#0F2A47]">Promo Codes</h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C8A951] text-[#0F2A47] text-xs font-bold rounded-lg">
              <Plus size={12} /> New Code
            </button>
          </div>
          <div className="p-4 space-y-2">
            {promoCodes.map(promo => (
              <div key={promo.code} className="flex items-center gap-3 p-3 bg-[#F8F6F1] rounded-xl">
                <div className="p-2 bg-[#C8A951]/15 rounded-lg">
                  <Tag size={14} className="text-[#a88b3a]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-bold text-sm text-[#0F2A47]">{promo.code}</p>
                    <span className="text-xs text-[#C8A951] font-bold">{promo.discount} off</span>
                  </div>
                  <p className="text-xs text-[#666]">{promo.uses}/{promo.limit} uses</p>
                </div>
                <div className={`w-10 h-5 rounded-full ${promo.active ? 'bg-emerald-500' : 'bg-[#E8E6E1]'} relative cursor-pointer`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${promo.active ? 'left-5' : 'left-0.5'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* App Banners */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E6E1] lg:col-span-2">
          <div className="p-4 border-b border-[#F0EEE9] flex items-center justify-between">
            <h2 className="font-semibold text-[#0F2A47]">App Banners & Promotions</h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F2A47] text-white text-xs font-medium rounded-lg">
              <Image size={12} /> Add Banner
            </button>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {banners.map(banner => (
              <div key={banner.id} className={`rounded-xl p-4 border-2 transition-all ${
                banner.active ? 'border-[#C8A951] bg-[#C8A951]/5' : 'border-[#E8E6E1] bg-[#F8F6F1] opacity-60'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-sm text-[#222]">{banner.title}</p>
                  <div className={`w-8 h-4 rounded-full ${banner.active ? 'bg-[#C8A951]' : 'bg-[#E8E6E1]'} relative cursor-pointer flex-shrink-0`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${banner.active ? 'left-4' : 'left-0.5'}`}></div>
                  </div>
                </div>
                <p className="text-xs text-[#666]">{banner.subtitle}</p>
                <div className="flex gap-2 mt-3">
                  <button className="text-xs text-[#0F2A47] underline">Edit</button>
                  <button className="text-xs text-red-500 underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
