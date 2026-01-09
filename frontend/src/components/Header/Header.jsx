import React from 'react'
import { motion } from 'framer-motion'
import './Header.css'

const Header = () => {
    return (
        <motion.div 
            className='header'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.div 
                className='header-contents'
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <motion.h2
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >Order your favourite food here</motion.h2>
                <motion.p
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</motion.p>
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    whileHover={{ 
                        scale: 1.1,
                        boxShadow: "0px 10px 30px rgba(255, 255, 255, 0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                >View Menu</motion.button>
            </motion.div>
            {/* Animated gradient overlay */}
            <motion.div 
                className="header-gradient-overlay"
                animate={{
                    background: [
                        "linear-gradient(135deg, rgba(255,76,36,0.1) 0%, rgba(0,0,0,0) 100%)",
                        "linear-gradient(135deg, rgba(255,76,36,0.2) 0%, rgba(0,0,0,0) 100%)",
                        "linear-gradient(135deg, rgba(255,76,36,0.1) 0%, rgba(0,0,0,0) 100%)"
                    ]
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </motion.div>
    )
}

export default Header
