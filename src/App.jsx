import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LangProvider } from './i18n/LangContext'
import { CategoriesProvider } from './store/categoriesStore.jsx'
import { StoresProvider } from './store/storesStore.jsx'

// Home
import HomePage from './pages/HomePage'
import DriverPortal from './pages/DriverPortal'

// Web Platform
import WebLayout from './pages/WebLayout'
import WebHome from './pages/WebHome'
import WebMarketplace from './pages/WebMarketplace'
import WebStore from './pages/WebStore'
import WebCheckout from './pages/WebCheckout'
import WebTaxi from './pages/WebTaxi'
import WebOrders from './pages/WebOrders'
import WebAccount from './pages/WebAccount'

// Mobile App
import MobileApp from './pages/MobileApp'

// Admin
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminStores from './pages/admin/AdminStores'
import AdminDrivers from './pages/admin/AdminDrivers'
import AdminOrders from './pages/admin/AdminOrders'
import AdminTaxi from './pages/admin/AdminTaxi'
import AdminLiveMap from './pages/admin/AdminLiveMap'
import AdminFinancial from './pages/admin/AdminFinancial'
import AdminSettings from './pages/admin/AdminSettings'
import AdminCategories from './pages/admin/AdminCategories'

export default function App() {
  return (
    <LangProvider>
    <CategoriesProvider>
    <StoresProvider>
    <BrowserRouter>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<HomePage />} />

        {/* Web Platform */}
        <Route path="/web" element={<WebLayout />}>
          <Route index element={<WebHome />} />
          <Route path="marketplace" element={<WebMarketplace />} />
          <Route path="store" element={<WebStore />} />
          <Route path="checkout" element={<WebCheckout />} />
          <Route path="taxi" element={<WebTaxi />} />
          <Route path="orders" element={<WebOrders />} />
          <Route path="account" element={<WebAccount />} />
        </Route>

        {/* Mobile App Preview */}
        <Route path="/mobile" element={<MobileApp />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="stores" element={<AdminStores />} />
          <Route path="drivers" element={<AdminDrivers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="taxi" element={<AdminTaxi />} />
          <Route path="map" element={<AdminLiveMap />} />
          <Route path="financial" element={<AdminFinancial />} />
          <Route path="wallets" element={<AdminFinancial />} />
          <Route path="analytics" element={<AdminDashboard />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Driver Portal */}
        <Route path="/driver" element={<DriverPortal />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </StoresProvider>
    </CategoriesProvider>
    </LangProvider>
  )
}
