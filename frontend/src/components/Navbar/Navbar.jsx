import React, { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'

const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token ,setToken, cartItems } = useContext(StoreContext);
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const total = getTotalCartAmount();
    setCartItemCount(total);
  }, [cartItems, getTotalCartAmount]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate('/')
  }

  // Define a "Liquid" spring transition for reusability
  const liquidTransition = { type: "spring", stiffness: 400, damping: 10 };

  return (
    <motion.div 
      className='navbar'
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 1. Logo remains untouched (No glass effect) */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Link to='/'><img className='logo' src={assets.logo} alt="" /></Link>
      </motion.div>

      {/* 2. Menu Items with Glass Effect */}
      <ul className="navbar-menu">
        {['home', 'menu', 'mob-app', 'contact'].map((item) => {
           // Helper to map state names to href/to
           const isLink = item === 'home';
           const path = isLink ? '/' : `#${item === 'mob-app' ? 'app-download' : item === 'menu' ? 'explore-menu' : 'footer'}`;
           const label = item === 'mob-app' ? 'mobile app' : item === 'contact' ? 'contact us' : item;
           
           // Wrap logic to decide between Link or <a>
           const Component = isLink ? Link : 'a';

           return (
             <Component 
               key={item}
               to={isLink ? path : undefined} 
               href={!isLink ? path : undefined}
               onClick={() => setMenu(item)} 
               className={`glass-water-item ${menu === item ? "active" : ""}`}
             >
                <motion.span
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   transition={liquidTransition}
                >
                  {label}
                </motion.span>
             </Component>
           )
        })}
      </ul>

      <div className="navbar-right">
        {/* 3. Search Icon Bubble */}
        <motion.div 
          className="glass-water-item icon-bubble"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
          whileTap={{ scale: 0.9 }}
          transition={liquidTransition}
        >
          <img src={assets.search_icon} alt="" />
        </motion.div>

        {/* 4. Cart Icon Bubble */}
        <motion.div
          key={getTotalCartAmount()}
          className="glass-water-item icon-bubble"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
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
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500 }}
                />
              )}
            </AnimatePresence>
          </Link>
        </motion.div>

        {/* 5. Sign In Button / Profile */}
        {!token ? (
          <motion.button 
            className="glass-water-item" // Applied here
            onClick={() => setShowLogin(true)}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.3)" }}
            whileTap={{ scale: 0.95 }}
            transition={liquidTransition}
            style={{ fontSize: '16px', fontWeight: 500 }} // Inline override to match button needs
          >
            sign in
          </motion.button>
        ) : (
          <div className='navbar-profile'>
             {/* Profile Icon Bubble */}
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