import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from "./Components/Navbar"
import HomePage from "./pages/HomePage"
import CategoryPage from "./pages/CategoryPage"
import AllJewelry from "./pages/AllJewelry"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import SellerSignup from "./pages/SellerSignup"
import Verify from "./pages/Verify"
import AddProduct from "./pages/AddProduct"
import ProductDetails from "./pages/ProductDetails"
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout"
import SalePage from "./pages/SalePage"
import EditProduct from "./pages/EditProduct"
import Sellers from "./pages/Sellers"
import SellerStore from "./pages/SellerStore"
import Footer from "./Components/Footer"
import SellerRoute from "./Components/SellerRoute"
import PaymentCallback from "./pages/PaymentCallback"
import ScrollToTop from "./Components/ScrollToTop"

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sellers" element={<Sellers />} />
        <Route path="/seller/:sellerId" element={<SellerStore />} />

        <Route path="/jewelry" element={<AllJewelry />} />
        <Route path="/rings" element={<CategoryPage category="Rings" title="RINGS" />} />
        <Route path="/earrings" element={<CategoryPage category="Earrings" title="EARRINGS" />} />
        <Route path="/bracelets" element={<CategoryPage category="Bracelets" title="BRACELETS" />} />
        <Route path="/necklaces" element={<CategoryPage category="Necklaces" title="NECKLACES" />} />
        <Route path="/sale" element={<SalePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/seller-signup" element={<SellerSignup />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/add-product" element={<SellerRoute><AddProduct /></SellerRoute>} />
        <Route path="/edit-product/:id" element={<SellerRoute><EditProduct /></SellerRoute>} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-callback" element={<PaymentCallback />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
