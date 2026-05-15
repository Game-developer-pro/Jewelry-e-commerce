import React, { useState, useContext } from "react";
import Navstyles from "./Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const userInfo = localStorage.getItem('userInfo');

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
    // Close menu if open
    closeMenu();
  };

  return (
    <>
      <nav className={Navstyles.navbar}>
        <div className={Navstyles.logo}>
          <Link to="/" className={Navstyles.logoLink}>MEJURI</Link>
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
                  <li><Link to="/add-product" className={Navstyles.navLink} style={{ color: '#cda052' }}>ADD PRODUCT</Link></li>
                  <li><Link to={`/seller/${user._id}`} className={Navstyles.navLink} style={{ fontWeight: '700' }}>MY STORE</Link></li>
                </>
              );
            }
            return null;
          })()}
        </ul>

        <div className={Navstyles.actions}>
          {/* Search — hidden on mobile to keep bar clean */}
          <div className={Navstyles.searchContainer}>
            <button
              className={Navstyles.iconBtn}
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Toggle search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <input
              type="text"
              placeholder="SEARCH"
              className={`${Navstyles.searchInput} ${searchOpen ? Navstyles.active : ""}`}
            />
          </div>

          <button className={`${Navstyles.iconBtn} ${Navstyles.hideOnMobile}`} aria-label="Find a store">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className={Navstyles.iconLabel}>STORES</span>
          </button>

          {userInfo ? (
            <button className={`${Navstyles.iconBtn} ${Navstyles.hideOnMobile}`} onClick={handleLogout} aria-label="Logout" title="Logout">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          ) : (
            <Link to="/login" className={`${Navstyles.iconBtn} ${Navstyles.hideOnMobile}`} aria-label="Login" title="Login">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
          )}

          <button className={`${Navstyles.iconBtn} ${Navstyles.hideOnMobile}`} aria-label="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>

          <Link to="/checkout" className={`${Navstyles.iconBtn} ${Navstyles.hideOnMobile}`} aria-label="Bag">
            <div className={Navstyles.cartIconWrapper}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {cartCount > 0 && <span className={Navstyles.cartBadge}>{cartCount}</span>}
            </div>
          </Link>

          {/* Hamburger — visible on mobile */}
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

      {/* Mobile Drawer */}
      <div className={`${Navstyles.mobileMenu} ${menuOpen ? Navstyles.open : ""}`}>
        <ul className={Navstyles.mobileNavLinks}>
          <li><Link to="/jewelry" className={Navstyles.mobileNavLink} onClick={closeMenu}>ALL JEWELRY</Link></li>
          <li><Link to="/rings" className={Navstyles.mobileNavLink} onClick={closeMenu}>RINGS</Link></li>
          <li><Link to="/earrings" className={Navstyles.mobileNavLink} onClick={closeMenu}>EARRINGS</Link></li>
          <li><Link to="/bracelets" className={Navstyles.mobileNavLink} onClick={closeMenu}>BRACELETS</Link></li>
          <li><Link to="/necklaces" className={Navstyles.mobileNavLink} onClick={closeMenu}>NECKLACES</Link></li>
          <li><Link to="/sale" className={Navstyles.mobileNavLink} onClick={closeMenu}>% OFF</Link></li>
          {(() => {
            const user = userInfo ? JSON.parse(userInfo) : null;
            if (user && (user.isSeller || user.isAdmin)) {
              return (
                <>
                  <li><Link to="/add-product" className={Navstyles.mobileNavLink} onClick={closeMenu} style={{ color: '#cda052' }}>ADD PRODUCT</Link></li>
                  <li><Link to={`/seller/${user._id}`} className={Navstyles.mobileNavLink} onClick={closeMenu} style={{ fontWeight: '700' }}>MY STORE</Link></li>
                </>
              );
            }
            return null;
          })()}
        </ul>
        <div className={Navstyles.mobileActions}>
          {userInfo ? (
            <button className={Navstyles.iconBtn} onClick={handleLogout} aria-label="Logout" title="Logout">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          ) : (
            <Link to="/login" className={Navstyles.iconBtn} onClick={closeMenu} aria-label="Login" title="Login">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
          )}
          <button className={Navstyles.iconBtn} aria-label="Wishlist">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <Link to="/checkout" className={Navstyles.iconBtn} onClick={closeMenu} aria-label="Bag">
            <div className={Navstyles.cartIconWrapper}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {cartCount > 0 && <span className={Navstyles.cartBadge}>{cartCount}</span>}
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;