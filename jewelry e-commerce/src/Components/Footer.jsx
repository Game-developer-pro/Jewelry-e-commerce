import React from 'react';
import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.column}>
            <h3 className={styles.heading}>Help</h3>
            <ul className={styles.list}>
              <li><Link to="#">FAQs</Link></li>
              <li><Link to="#">Order Status</Link></li>
              <li><Link to="#">Shipping & Delivery</Link></li>
              <li><Link to="#">Returns & Exchanges</Link></li>
              <li><Link to="#">Warranty</Link></li>
              <li><Link to="#">Contact Us</Link></li>
              <li><Link to="#">Help Code</Link></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.heading}>Stores & Services</h3>
            <ul className={styles.list}>
              <li><Link to="#">Our Stores</Link></li>
              <li><Link to="#">Piercing Services Near You</Link></li>
              <li><Link to="#">Piercing Aftercare</Link></li>
              <li><Link to="#">Corporate Events & Gifting</Link></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.heading}>Resources</h3>
            <ul className={styles.list}>
              <li><Link to="#">Jewelry Care</Link></li>
              <li><Link to="#">Our Materials</Link></li>
              <li><Link to="#">Size Guides</Link></li>
              <li><Link to="#">How To Guides</Link></li>
              <li><Link to="#">Blogs</Link></li>
              <li><Link to="#">Aurelia + Terms & Conditions</Link></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.heading}>About Aurelia</h3>
            <ul className={styles.list}>
              <li><Link to="#">Our Mission</Link></li>
              <li><Link to="#">Sustainability</Link></li>
              <li><Link to="#">Commitments</Link></li>
              <li><Link to="#">Modern Slavery Policy</Link></li>
              <li><Link to="#">Accessibility Statement</Link></li>
              <li><Link to="#">Supplier Code Of Conduct</Link></li>
              <li><Link to="#">Careers</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.certifications}>
          <h3 className={styles.certHeading}>Our Certifications And Partnerships</h3>
          <div className={styles.certLogos}>
            <div className={styles.certLogo}>
              <span>BUTTERFLY MARK</span>
            </div>
            <div className={styles.certLogo}>
              <span>WE SUPPORT UN GLOBAL COMPACT</span>
            </div>
            <div className={styles.certLogo}>
              <span>WATCH & JEWELLERY INITIATIVE 2030</span>
            </div>
            <div className={styles.certLogo}>
              <span>SCIENCE BASED TARGETS</span>
            </div>
            <div className={styles.certLogo}>
              <span>BSR</span>
            </div>
            <div className={styles.certLogo}>
              <span>WOMEN'S EMPOWERMENT PRINCIPLES</span>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <div className={styles.divider}></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
