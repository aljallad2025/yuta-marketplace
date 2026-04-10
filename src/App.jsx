import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LangProvider } from './i18n/LangContext'
import { CategoriesProvider } from './store/categoriesStore.jsx'
import { StoresProvider } from './store/storesStore.jsx'
import { AppProvider } from './store/appStore.jsx'
import { AuthProvider } from './store/authStore.jsx'
import ProtectedRoute from './components/ProtectedRoute'

// Home
import HomePage from './pages/HomePage'
import ReactNativePage from './pages/ReactNativePage'

// Auth login pages
import AdminLogin from './pages/auth/AdminLogin'
import VendorLogin from './pages/auth/VendorLogin'
import DriverLogin from './pages/auth/DriverLogin'

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
import AdminApprovals from './pages/admin/AdminApprovals'

// Vendor (Supplier) Dashboard
import VendorLayout from './pages/vendor/VendorLayout'
import VendorDashboard from './pages/vendor/VendorDashboard'
import VendorProducts from './pages/vendor/VendorProducts'
import VendorOrders from './pages/vendor/VendorOrders'
import VendorAnalytics from './pages/vendor/VendorAnalytics'
import VendorWallet from './pages/vendor/VendorWallet'
import VendorReviews from './pages/vendor/VendorReviews'
import VendorSettings from './pages/vendor/VendorSettings'

// Driver Dashboard
import DriverDashboard from './pages/driver/DriverDashboard'

export default function App() {
  return (
    <LangProvider>
    <AuthProvider>
    <CategoriesProvider>
    <StoresProvider>
    <AppProvider>
    <BrowserRouter>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<HomePage />} />

        {/* ── Auth pages (public) ──────────────────────────────── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/driver/login" element={<DriverLogin />} />

        {/* ── Web Platform (public) ────────────────────────────── */}
        <Route path="/web" element={<WebLayout />}>
          <Route index element={<WebHome />} />
          <Route path="marketplace" element={<WebMarketplace />} />
          <Route path="store" element={<WebStore />} />
          <Route path="checkout" element={<WebCheckout />} />
          <Route path="taxi" element={<WebTaxi />} />
          <Route path="orders" element={<WebOrders />} />
          <Route path="account" element={<WebAccount />} />
        </Route>

        {/* Mobile App Preview (public) */}
        <Route path="/mobile" element={<MobileApp />} />

        {/* React Native App Info */}
        <Route path="/react-native" element={<ReactNativePage />} />

        {/* ── Admin Dashboard (protected: admin) ───────────────── */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin" loginPath="/admin/login">
            <AdminLayout />
          </ProtectedRoute>
        }>
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
          <Route path="approvals" element={<AdminApprovals />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* ── Vendor Dashboard (protected: vendor) ─────────────── */}
        <Route path="/vendor" element={
          <ProtectedRoute role="vendor" loginPath="/vendor/login">
            <VendorLayout />
          </ProtectedRoute>
        }>
          <Route index element={<VendorDashboard />} />
          <Route path="products" element={<VendorProducts />} />
          <Route path="orders" element={<VendorOrders />} />
          <Route path="analytics" element={<VendorAnalytics />} />
          <Route path="wallet" element={<VendorWallet />} />
          <Route path="reviews" element={<VendorReviews />} />
          <Route path="settings" element={<VendorSettings />} />
        </Route>

        {/* ── Driver Dashboard (protected: driver) ─────────────── */}
        <Route path="/driver" element={
          <ProtectedRoute role="driver" loginPath="/driver/login">
            <DriverDashboard />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </AppProvider>
    </StoresProvider>
    </CategoriesProvider>
    </AuthProvider>
    </LangProvider>
  )
}
