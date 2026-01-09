import React, { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'

const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken, cartItems, setSearchTerm } = useContext(StoreContext);
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  // Handle search logic
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    if (showSearch) setSearchTerm("");
  }

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate('/')
  }

  // --- NEW FUNCTION: Scroll to Top ---
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- NEW LOGIC: Sync Menu with Scroll Position ---
  useEffect(() => {
    const handleScroll = () => {
      // Get the DOM elements by their ID (ensure these IDs exist in your other components)
      const menuSection = document.getElementById('explore-menu');
      const appSection = document.getElementById('app-download');
      const footerSection = document.getElementById('footer');

      // Current scroll position + a buffer (approx navbar height) so it activates early
      const scrollPosition = window.scrollY + 150; 

      // Check positions from bottom to top to prioritize the furthest section reached
      if (footerSection && scrollPosition >= footerSection.offsetTop) {
        setMenu("contact");
      } else if (appSection && scrollPosition >= appSection.offsetTop) {
        setMenu("mob-app");
      } else if (menuSection && scrollPosition >= menuSection.offsetTop) {
        setMenu("menu");
      } else {
        setMenu("home");
      }
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup event listener on unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array means this runs on mount

  // Animation Configs
  const liquidTransition = { type: "spring", stiffness: 300, damping: 20 };

  return (
    <motion.div 
      className='navbar'
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      {/* 1. Logo with bounce effect */}
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        onClick={scrollToTop} 
      >
        <Link to='/'><img className='logo' src={assets.logo} alt="" /></Link>
      </motion.div>

      {/* 2. Menu with "Sliding Pill" Animation */}
      <ul className="navbar-menu">
        {['home', 'menu', 'mob-app', 'contact'].map((item) => {
           const isLink = item === 'home';
           const path = isLink ? '/' : `#${item === 'mob-app' ? 'app-download' : item === 'menu' ? 'explore-menu' : 'footer'}`;
           const label = item === 'mob-app' ? 'mobile app' : item === 'contact' ? 'contact us' : item;
           const Component = isLink ? Link : 'a';
           const isActive = menu === item;

           return (
             <Component 
               key={item}
               to={isLink ? path : undefined} 
               href={!isLink ? path : undefined}
               onClick={() => {
                   setMenu(item);
                   if (item === 'home') scrollToTop();
               }} 
               className={`glass-water-item ${isActive ? "active-text" : ""}`}
               style={{ position: 'relative' }} 
             >
                {/* The Magic Sliding Background */}
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="active-pill"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                {/* The Text Label */}
                <motion.span 
                  style={{ position: 'relative', zIndex: 1 }} 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {label}
                </motion.span>
             </Component>
           )
        })}
      </ul>

      {/* 3. Right Side Icons */}
      <div className="navbar-right">
        
        {/* Search Section */}
        <div className="search-container" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <AnimatePresence>
                {showSearch && (
                    <motion.input
                        initial={{ width: 0, opacity: 0, x: 20 }}
                        animate={{ width: "180px", opacity: 1, x: 0 }}
                        exit={{ width: 0, opacity: 0, x: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        type="text"
                        placeholder="Search..."
                        onChange={handleSearch}
                        className="glass-water-item search-input-glass"
                        style={{ 
                            marginRight: '8px', 
                            padding: "10px 15px",
                            outline: 'none',
                            color: '#49557E'
                        }}
                    />
                )}
            </AnimatePresence>
            
            <motion.div 
              className="glass-water-item icon-bubble"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.8)" }}
              whileTap={{ scale: 0.9 }}
              transition={liquidTransition}
              onClick={handleSearchClick}
            >
              <img src={assets.search_icon} alt="" />
            </motion.div>
        </div>

        {/* Cart Icon */}
        <motion.div
          key={getTotalCartAmount()}
          className="glass-water-item icon-bubble"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.8)" }}
          whileTap={{ scale: 0.9 }}
          transition={liquidTransition}
        >
          <Link to='/cart' className='navbar-search-icon'>
            <img src={assets.basket_icon} alt="" />
            <AnimatePresence>
              {getTotalCartAmount() > 0 && (
                <motion.div 
                  className="dot"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.2 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500 }}
                />
              )}
            </AnimatePresence>
          </Link>
        </motion.div>

        {/* Login / Profile */}
        {!token ? (
          <motion.button 
            className="glass-water-item"
            onClick={() => setShowLogin(true)}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 76, 36, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            transition={liquidTransition}
            style={{ fontWeight: 600, padding: '10px 30px' }}
          >
            sign in
          </motion.button>
        ) : (
          <div className='navbar-profile'>
            <motion.div 
              className="glass-water-item icon-bubble"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <img src={assets.profile_icon} alt="" />
            </motion.div>
            <ul className='navbar-profile-dropdown'>
              <li onClick={()=>navigate('/myorders')}> <img src={assets.bag_icon} alt="" /> <p>Orders</p></li>
              <hr />
              <li onClick={logout}> <img src={assets.logout_icon} alt="" /> <p>Logout</p></li> 
            </ul>
          </div>
        )}

      </div>
    </motion.div>
  )
}

export default Navbar