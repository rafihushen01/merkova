import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaTiktok,
  FaYoutube,
  FaLinkedinIn,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaArrowUp,
} from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import bkash from "../../payments/Bikash.avif";
import cashondelivery from "../../payments/cash on delivery.avif";
import nagad from "../../payments/Nagad.avif";
import sslgomerz from "../../payments/sslgomez.avif";
import upay from "../../payments/Upay.svg";
import mastercard from "../../payments/Mastercard.svg";
import merkovalogo from "../../assets/Logo.png";

const Footer = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  const styles = {
    container: {
      backgroundColor: "#000b1d",
      color: "#ffffff",
      padding: "80px 10% 30px",
      fontFamily: "'Inter', 'Poppins', sans-serif",
      borderTop: "4px solid #FFD700",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 -10px 40px rgba(0,0,0,0.5)",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "50px",
      marginBottom: "50px",
      position: "relative",
      zIndex: 2,
    },
    header: {
      fontSize: "20px",
      fontWeight: "800",
      marginBottom: "25px",
      color: "#ffffff",
      letterSpacing: "1px",
      textTransform: "uppercase",
    },
    linkWrapper: {
      position: "relative",
      width: "fit-content",
      marginBottom: "14px",
      cursor: "pointer",
    },
    link: {
      fontSize: "15px",
      color: "#94a3b8",
      textDecoration: "none",
      transition: "0.3s ease",
      display: "block",
    },
    description: {
      fontSize: "14px",
      color: "#8892b0",
      lineHeight: "1.8",
      marginBottom: "25px",
      maxWidth: "300px",
    },
    contactItem: {
      display: "flex",
      gap: "15px",
      fontSize: "14px",
      color: "#cbd5e1",
      marginBottom: "18px",
      cursor: "pointer",
      alignItems: "flex-start",
      transition: "0.3s",
    },
    paymentGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "15px",
      marginTop: "20px",
    },
    paymentImg: {
      width: "100%",
      maxWidth: "60px",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      filter: "brightness(0.8) grayscale(30%)",
    },
    socialIcon: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "40px",
      height: "40px",
      backgroundColor: "#111d2f",
      borderRadius: "12px",
      marginRight: "12px",
      cursor: "pointer",
      transition: "0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      border: "1px solid rgba(255,215,0,0.1)",
    },
    bottom: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "25px",
      fontSize: "13px",
      color: "#64748b",
      paddingTop: "30px",
      borderTop: "1px solid rgba(255,255,255,0.05)",
    },
    developerCredit: {
      fontSize: "14px",
      fontWeight: "700",
      color: "#FFD700",
      background: "rgba(255,215,0,0.08)",
      border: "1px solid rgba(255,215,0,0.25)",
      borderRadius: "999px",
      padding: "8px 14px",
      letterSpacing: "0.3px",
      textShadow: "0 0 10px rgba(255,215,0,0.35)",
    },
    developerName: {
      color: "#ffffff",
      fontWeight: "800",
      marginLeft: "6px",
      cursor: "pointer",
      textDecoration: "underline",
      textUnderlineOffset: "3px",
    },
    scrollTop: {
      position: "fixed",
      bottom: "40px",
      right: "40px",
      backgroundColor: "#FFD700",
      color: "#000b1d",
      width: "55px",
      height: "55px",
      borderRadius: "15px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      boxShadow: "0 10px 25px rgba(255,215,0,0.3)",
      zIndex: 1000,
      transition: "0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "scale(1)" : "scale(0.5)",
    },
  };

  return (
    <footer style={styles.container}>
      {/* Dynamic Animated Styles */}
      <style>{`
        .merkova-link:hover .link-text { color: #FFD700 !important; transform: translateX(5px); }
        .merkova-link .hover-line {
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background: #FFD700;
          transition: width 0.3s ease;
          box-shadow: 0 0 8px #FFD700;
        }
        .merkova-link:hover .hover-line { width: 100%; }
        .social-hover:hover { 
          background: #FFD700 !important; 
          color: #000b1d !important; 
          transform: translateY(-8px) rotate(8deg);
          box-shadow: 0 10px 20px rgba(255,215,0,0.2);
        }
        .payment-hover:hover {
          filter: brightness(1.1) grayscale(0%);
          transform: translateY(-5px) scale(1.1);
        }
        .contact-hover:hover { color: #FFD700 !important; }
        .logo-anim { transition: 0.5s ease; }
        .logo-anim:hover { filter: drop-shadow(0 0 15px rgba(255,215,0,0.4)); transform: scale(1.02); }
      `}</style>

      <div style={styles.grid}>
        {/* Column 1: Brand Power */}
        <div>
          <img
            src={merkovalogo}
            alt="Merkova"
            className="logo-anim"
            style={{ width: "180px", marginBottom: "25px", cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
          <p style={styles.description}>
            <strong>Merkova</strong> is a trillion-dollar e-commerce ecosystem. We bridge global markets with hyper-secure logistics and verified elite sellers for an unparalleled shopping experience.
          </p>

          <div style={styles.contactItem} className="contact-hover" onClick={() => navigate("/location")}>
            <FaMapMarkerAlt color="#FFD700" size={18} />
            <span>Rahman Regnum Centre, Level-6, Dhaka, BD</span>
          </div>

          <div style={styles.contactItem} className="contact-hover" onClick={() => navigate("/support")}>
            <FaPhoneAlt color="#FFD700" />
            <span>+880 1989-678448</span>
          </div>

          <div style={styles.contactItem} className="contact-hover">
            <FaClock color="#FFD700" />
            <span>Support: 8 AM – 10 PM (Daily)</span>
          </div>

          <div style={styles.contactItem} className="contact-hover" onClick={() => navigate("/contact")}>
            <FaEnvelope color="#FFD700" />
            <span>executive@merkova.com</span>
          </div>
        </div>

        {/* Column 2: Merkova Corporate (Individual Links) */}
        <div>
          <h3 style={styles.header}>Merkova</h3>
          <div style={styles.linkWrapper} className="merkova-link" onClick={() => navigate("/about")}>
            <span style={styles.link} className="link-text">About Merkova</span>
            <div className="hover-line"></div>
          </div>
          <div style={styles.linkWrapper} className="merkova-link" onClick={() => navigate("/blog")}>
            <span style={styles.link} className="link-text">Merkova Blog</span>
            <div className="hover-line"></div>
          </div>
          <div style={styles.linkWrapper} className="merkova-link" onClick={() => navigate("/affiliate")}>
            <span style={styles.link} className="link-text">Affiliate Program</span>
            <div className="hover-line"></div>
          </div>
          <div style={styles.linkWrapper} className="merkova-link" onClick={() => navigate("/cookies")}>
            <span style={styles.link} className="link-text">Cookies Policy</span>
            <div className="hover-line"></div>
          </div>
          <div style={styles.linkWrapper} className="merkova-link" onClick={() => navigate("/careers")}>
            <span style={styles.link} className="link-text">Careers</span>
            <div className="hover-line"></div>
          </div>
          <div style={styles.linkWrapper} className="merkova-link" onClick={() => navigate("/contact")}>
            <span style={styles.link} className="link-text">Contact Us</span>
            <div className="hover-line"></div>
          </div>
        </div>

        {/* Column 3: Customer Care (Individual Links) */}
        <div>
          <h3 style={styles.header}>Customer Care</h3>
          <div style={styles.linkWrapper} className="merkova-link" onClick={() => navigate("/returns")}>
            <span style={styles.link} className="link-text">Returns & Refunds</span>
            <div className="hover-line"></div>
          </div>
          <div style={styles.linkWrapper} className="merkova-link" onClick={() => navigate("/privacy")}>
            <span style={styles.link} className="link-text">Privacy Policy</span>
            <div className="hover-line"></div>
          </div>
          <div style={styles.linkWrapper} className="merkova-link" onClick={() => navigate("/warranty")}>
            <span style={styles.link} className="link-text">Warranty Policy</span>
            <div className="hover-line"></div>
          </div>
          <div style={styles.linkWrapper} className="merkova-link" onClick={() => navigate("/help")}>
            <span style={styles.link} className="link-text">Help Center</span>
            <div className="hover-line"></div>
          </div>
           <div style={styles.linkWrapper} className="merkova-link" onClick={() => navigate("/help")}>
            <span style={styles.link} className="link-text">Shipping Info</span>
            <div className="hover-line"></div>
          </div>
          <div style={styles.linkWrapper} className="merkova-link" onClick={() => navigate("/terms")}>
            <span style={styles.link} className="link-text">Terms & Conditions</span>
            <div className="hover-line"></div>
          </div>
          <div style={styles.linkWrapper} className="merkova-link" onClick={() => navigate("/emi")}>
            <span style={styles.link} className="link-text">EMI Policy</span>
            <div className="hover-line"></div>
          </div>
        </div>

        {/* Column 4: Secure Payments */}
        <div>
          <h3 style={styles.header}>Secure Payments</h3>
          <div style={styles.paymentGrid}>
            <img src={mastercard} className="payment-hover" style={styles.paymentImg} onClick={() => navigate("/payments")} alt="Mastercard" />
            <img src={bkash} className="payment-hover" style={styles.paymentImg} onClick={() => navigate("/payments")} alt="bKash" />
            <img src={nagad} className="payment-hover" style={styles.paymentImg} onClick={() => navigate("/payments")} alt="Nagad" />
            <img src={upay} className="payment-hover" style={styles.paymentImg} onClick={() => navigate("/payments")} alt="Upay" />
            <img src={sslgomerz} className="payment-hover" style={styles.paymentImg} onClick={() => navigate("/payments")} alt="SSL" />
          </div>

          <div style={{ marginTop: "25px", background: "rgba(255,255,255,0.03)", padding: "15px", borderRadius: "12px", border: "1px solid rgba(255,215,0,0.1)" }}>
             <p style={{fontSize: '11px', color: '#FFD700', marginBottom: '10px', fontWeight: 'bold'}}>AVAILABLE NATIONWIDE</p>
             <img
               src={cashondelivery}
               className="payment-hover"
               style={{ width: "110px", cursor: "pointer", borderRadius: '5px' }}
               onClick={() => navigate("/payments")}
               alt="COD"
             />
          </div>
        </div>
      </div>

      <div style={styles.bottom}>
        <p>© {new Date().getFullYear()} <strong>Merkova Inc.</strong> All rights reserved. Engineering the Future of Commerce.</p>
        <p style={styles.developerCredit}>
          Developer And Founder
          <span
            style={styles.developerName}
            onClick={() => window.open("https://mdrafikhan.vercel.app")}
          >
            Md Rafi Khan
          </span>
        </p>
        <div style={{ display: "flex" }}>
          <span style={styles.socialIcon} className="social-hover" onClick={() => window.open('https://facebook.com')}><FaFacebookF /></span>
          <span style={styles.socialIcon} className="social-hover" onClick={() => window.open('https://tiktok.com')}><FaTiktok /></span>
          <span style={styles.socialIcon} className="social-hover" onClick={() => window.open('https://youtube.com')}><FaYoutube /></span>
          <span style={styles.socialIcon} className="social-hover" onClick={() => window.open('https://linkedin.com')}><FaLinkedinIn /></span>
          <span style={styles.socialIcon} className="social-hover" onClick={() => window.open('https://instagram.com')}><FaInstagram /></span>
          <span style={styles.socialIcon} className="social-hover" onClick={() => window.open('https://twitter.com')}><BsTwitterX /></span>
        </div>
      </div>

      {/* Futuristic Scroll Top */}
      <div 
        style={styles.scrollTop} 
        onClick={scrollToTop}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-10px) scale(1.1)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        <FaArrowUp size={22} />
      </div>
    </footer>
  );
};

export default Footer;
