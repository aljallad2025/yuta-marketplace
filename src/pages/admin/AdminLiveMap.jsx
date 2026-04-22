import { useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import { RefreshCw } from "lucide-react"
import Badge from "../../components/Badge"
import { useLang } from "../../i18n/LangContext"

const makeIcon = (color, emoji) => L.divIcon({
  className: "",
  html: "<div style='background:" + color + ";width:36px;height:36px;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.3)'>" + emoji + "</div>",
  iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -18],
})

export default function AdminLiveMap() {
  const [selected, setSelected] = useState(null)
  const [mapRef, setMapRef] = useState(null)
  const { t, isAr } = useLang()

  const driversData = [
    { id: 1, nameEn: "Ahmed Ali", nameAr: "أحمد علي", status: "available", orders: 0, lat: 26.2235, lng: 50.5876 },
    { id: 2, nameEn: "Mohammed Salem", nameAr: "محمد سالم", status: "delivering", orders: 2, lat: 26.2150, lng: 50.5950 },
    { id: 3, nameEn: "Khalid Hassan", nameAr: "خالد حسن", status: "on_ride", orders: 0, lat: 26.2300, lng: 50.5800 },
    { id: 4, nameEn: "Omar Yusuf", nameAr: "عمر يوسف", status: "available", orders: 0, lat: 26.2100, lng: 50.6000 },
    { id: 5, nameEn: "Ali Nasser", nameAr: "علي ناصر", status: "delivering", orders: 1, lat: 26.2250, lng: 50.5820 },
  ]

  const orders_active = [
    { id: "#ORD-001", status: "on_the_way", fromEn: "Al Seef Mall", fromAr: "مجمع السيف", lat: 26.2180, lng: 50.5900 },
    { id: "#ORD-002", status: "preparing", fromEn: "City Centre", fromAr: "سيتي سنتر", lat: 26.2320, lng: 50.5860 },
    { id: "#ORD-003", status: "on_the_way", fromEn: "Adliya", fromAr: "العدلية", lat: 26.2200, lng: 50.5780 },
  ]

  const stats = [
    { labelEn: "Drivers Online", labelAr: "السائقون متصلون", value: driversData.length, color: "#2ECC71" },
    { labelEn: "Delivering", labelAr: "يوصّل", value: driversData.filter(d => d.status === "delivering").length, color: "#3498DB" },
    { labelEn: "Active Orders", labelAr: "طلبات نشطة", value: orders_active.length, color: "#F39C12" },
    { labelEn: "On Rides", labelAr: "في رحلات", value: driversData.filter(d => d.status === "on_ride").length, color: "#9B59B6" },
  ]

  const getStatusLabel = (status) => {
    if (status === "delivering") return isAr ? "يوصّل" : "Delivering"
    if (status === "on_ride") return isAr ? "في رحلة" : "On Ride"
    return isAr ? "متاح" : "Available"
  }

  const getStatusBadge = (status) => {
    if (status === "delivering") return "on_the_way"
    if (status === "on_ride") return "accepted"
    return "active"
  }

  const getColor = (status) => {
    if (status === "delivering") return "#3498DB"
    if (status === "on_ride") return "#9B59B6"
    return "#2ECC71"
  }

  const flyTo = (lat, lng) => {
    if (mapRef) mapRef.flyTo([lat, lng], 15)
  }

  return (
    <div className="p-6 space-y-5" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0F2A47]">{t("liveMap")}</h1>
          <p className="text-sm text-[#666]">{isAr ? "تتبع السائقين والطلبات في الوقت الفعلي" : "Real-time driver and order tracking"}</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-emerald-600 font-black">{isAr ? "مباشر" : "Live"}</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.labelEn} className="bg-white rounded-xl p-4 shadow-sm border border-[#E8E4DC] text-center">
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#666] mt-0.5">{isAr ? s.labelAr : s.labelEn}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8E4DC]">
          <MapContainer
            center={[26.2235, 50.5876]}
            zoom={13}
            style={{ height: "500px", width: "100%" }}
            ref={setMapRef}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
            {driversData.map(driver => (
              <Marker key={driver.id} position={[driver.lat, driver.lng]} icon={makeIcon(getColor(driver.status), "🚗")} eventHandlers={{ click: () => setSelected(driver) }}>
                <Popup><b>{isAr ? driver.nameAr : driver.nameEn}</b><br/>{getStatusLabel(driver.status)}</Popup>
              </Marker>
            ))}
            {orders_active.map(order => (
              <Marker key={order.id} position={[order.lat, order.lng]} icon={makeIcon("#F39C12", "📦")}>
                <Popup><b>{order.id}</b><br/>{isAr ? order.fromAr : order.fromEn}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4DC]">
          <div className="p-4 border-b border-[#F0ECE4]">
            <h2 className="font-black text-[#0F2A47]">{isAr ? "السائقون" : "Drivers"}</h2>
          </div>
          <div className="p-3 space-y-2 overflow-y-auto" style={{ maxHeight: "520px" }}>
            {driversData.map(driver => (
              <button key={driver.id} onClick={() => { setSelected(driver); flyTo(driver.lat, driver.lng) }}
                className={"w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-start " + (selected && selected.id === driver.id ? "border-[#0F2A47] bg-[#0F2A47]/5" : "border-[#F0ECE4] hover:border-[#C8A951]/30")}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm" style={{ backgroundColor: getColor(driver.status) }}>
                  {(isAr ? driver.nameAr : driver.nameEn).charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-black text-xs text-[#222]">{isAr ? driver.nameAr : driver.nameEn}</p>
                  <Badge status={getStatusBadge(driver.status)} label={getStatusLabel(driver.status)} className="mt-0.5" />
                </div>
                {driver.orders > 0 && (
                  <div className="w-5 h-5 bg-[#E74C3C] rounded-full flex items-center justify-center">
                    <span className="text-white text-[9px] font-black">{driver.orders}</span>
                  </div>
                )}
              </button>
            ))}
            <div className="pt-3 mt-3 border-t border-[#F0ECE4]">
              <p className="text-xs font-black text-[#444] mb-2">{isAr ? "الطلبات النشطة" : "Active Orders"}</p>
              {orders_active.map(order => (
                <div key={order.id} onClick={() => flyTo(order.lat, order.lng)} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FBF8F2] mb-2 cursor-pointer">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm bg-orange-50">📦</div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-[#222]">{order.id}</p>
                    <p className="text-[10px] text-[#666]">{isAr ? order.fromAr : order.fromEn}</p>
                  </div>
                  <Badge status={order.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
