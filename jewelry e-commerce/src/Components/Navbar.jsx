import React, { useState, useContext } from "react";
import Navstyles from "./Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, clearCart } = useContext(CartContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const userInfo = localStorage.getItem("userInfo");

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    clearCart();
    localStorage.removeItem("userInfo");
    navigate("/");
    closeMenu();
  };

  return (
    <>
      <nav className={Navstyles.navbar}>
        {/* Logo */}
        <div className={Navstyles.logo}>
          <Link to="/" className={Navstyles.logoLink}>
            AURELIA
          </Link>
        </div>

        {/* Desktop nav links */}
        <ul className={Navstyles.navLinks}>
          <li><Link to="/jewelry" className={Navstyles.navLink}>ALL JEWELRY</Link></li>
          <li><Link to="/rings" className={Navstyles.navLink}>RINGS</Link></li>
          <li><Link to="/earrings" className={Navstyles.navLink}>EARRINGS</Link></li>
          <li><Link to="/bracelets" className={Navstyles.navLink}>BRACELETS</Link></li>
          <li><Link to="/necklaces" className={Navstyles.navLink}>NECKLACES</Link></li>
          <li><Link to="/sale" className={Navstyles.navLink}>% OFF</Link></li>
          {(() => {
            const user = userInfo ? JSON.parse(userInfo) : null;
            if (user && (user.isSeller || user.isAdmin)) {
              return (
                <>
                  <li><Link to="/add-product" className={Navstyles.navLink} style={{ color: "#cda052" }}>ADD PRODUCT</Link></li>
                  <li><Link to={`/seller/${user._id}`} className={Navstyles.navLink} style={{ fontWeight: "700" }}>MY STORE</Link></li>
                </>
              );
            }
            return null;
          })()}
        </ul>

        {/* Desktop actions */}
        <div className={Navstyles.actions}>

          {/* ── Theme toggle (desktop) ── */}
          <button
            className={`${Navstyles.themeToggle} ${Navstyles.hideOnMobile}`}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={theme === "light" ? "Dark mode" : "Light mode"}
          >
            <span className={Navstyles.themeIcon}>
              {theme === "light" ? "🌙" : "☀️"}
            </span>
          </button>

          {/* Cart */}
          <Link to="/checkout" className={Navstyles.iconBtn} aria-label="Bag">
            <div className={Navstyles.cartIconWrapper}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {cartCount > 0 && <span className={Navstyles.cartBadge}>{cartCount}</span>}
            </div>
          </Link>

          {/* Orders (desktop) */}
          <Link to="/orders" className={`${Navstyles.iconBtn} ${Navstyles.hideOnMobile}`} aria-label="Track orders">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <span className={Navstyles.iconLabel}>ORDERS</span>
          </Link>

          {/* Profile (desktop) */}
          {userInfo && (
            <Link to="/profile" className={`${Navstyles.iconBtn} ${Navstyles.hideOnMobile}`} aria-label="Profile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          )}

          {/* Profile/Login icon for mobile */}
          <Link
            to={userInfo ? "/profile" : "/login"}
            className={`${Navstyles.iconBtn} ${Navstyles.hideOnDesktop}`}
            aria-label={userInfo ? "Profile" : "Login"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          {/* Login (desktop, logged-out) */}
          {!userInfo && (
            <Link to="/login" className={`${Navstyles.iconBtn} ${Navstyles.hideOnMobile}`} aria-label="Login">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
          )}

          {/* Hamburger */}
          <button
            className={`${Navstyles.hamburger} ${menuOpen ? Navstyles.open : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <div className={`${Navstyles.mobileMenu} ${menuOpen ? Navstyles.open : ""}`}>
        <ul className={Navstyles.mobileNavLinks}>
          <li><Link to="/jewelry" className={Navstyles.mobileNavLink} onClick={closeMenu}>ALL JEWELRY</Link></li>
          <li><Link to="/rings" className={Navstyles.mobileNavLink} onClick={closeMenu}>RINGS</Link></li>
          <li><Link to="/earrings" className={Navstyles.mobileNavLink} onClick={closeMenu}>EARRINGS</Link></li>
          <li><Link to="/bracelets" className={Navstyles.mobileNavLink} onClick={closeMenu}>BRACELETS</Link></li>
          <li><Link to="/necklaces" className={Navstyles.mobileNavLink} onClick={closeMenu}>NECKLACES</Link></li>
          <li><Link to="/sale" className={Navstyles.mobileNavLink} onClick={closeMenu}>% OFF</Link></li>

          {userInfo && (
            <>
              <li>
                <Link to="/orders" className={Navstyles.mobileNavLink} onClick={closeMenu}>
                  ORDERS
                </Link>
              </li>
              <li>
                <Link to="/profile" className={Navstyles.mobileNavLink} onClick={closeMenu}>
                  PROFILE
                </Link>
              </li>
              <li>
                <button className={Navstyles.mobileNavLink} style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", padding: "18px 0" }} onClick={handleLogout}>
                  LOGOUT
                </button>
              </li>
            </>
          )}

          {(() => {
            const user = userInfo ? JSON.parse(userInfo) : null;
            if (user && (user.isSeller || user.isAdmin)) {
              return (
                <>
                  <li><Link to="/add-product" className={Navstyles.mobileNavLink} onClick={closeMenu} style={{ color: "#cda052" }}>ADD PRODUCT</Link></li>
                  <li><Link to={`/seller/${user._id}`} className={Navstyles.mobileNavLink} onClick={closeMenu} style={{ fontWeight: "700" }}>MY STORE</Link></li>
                </>
              );
            }
            return null;
          })()}

          {/* ── Theme toggle (mobile drawer) ── */}
          <li>
            <button
              className={Navstyles.mobileThemeToggle}
              onClick={() => { toggleTheme(); closeMenu(); }}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              <span className={Navstyles.mobileThemeIcon}>{theme === "light" ? "🌙" : "☀️"}</span>
              <span>{theme === "light" ? "DARK MODE" : "LIGHT MODE"}</span>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;