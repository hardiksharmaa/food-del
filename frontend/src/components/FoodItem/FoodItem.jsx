import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ image, name, price, desc , id, index = 0 }) => {

    const [itemCount, setItemCount] = useState(0);
    const {cartItems,addToCart,removeFromCart,url,currency} = useContext(StoreContext);

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                delay: index * 0.1,
                duration: 0.5,
                ease: "easeOut"
            }
        }
    }

    const floatingVariants = {
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2
            }
        }
    }

    return (
        <motion.div 
            className='food-item'
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
                z: 50,
                transition: { duration: 0.3 }
            }}
            style={{ perspective: 1000 }}
        >
            <motion.div 
                className='food-item-img-container'
                variants={floatingVariants}
                animate="animate"
            >
                <motion.img 
                    className='food-item-image' 
                    src={url+"/images/"+image} 
                    alt="" 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                />
                {!cartItems[id]
                ?<motion.div
                    className='add-wrapper'
                    animate={{ 
                        filter: [
                            "drop-shadow(0px 0px 0px rgba(255,76,36,0))",
                            "drop-shadow(0px 0px 15px rgba(255,76,36,0.8))",
                            "drop-shadow(0px 0px 0px rgba(255,76,36,0))"
                        ]
                    }}
                    transition={{ 
                        filter: { duration: 2, repeat: Infinity },
                    }}
                >
                    <motion.img 
                        className='add' 
                        onClick={() => addToCart(id)} 
                        src={assets.add_icon_white} 
                        alt="" 
                        whileHover={{ scale: 1.2, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                    />
                </motion.div>
                :<motion.div 
                    className="food-item-counter"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                        <motion.img 
                            src={assets.remove_icon_red} 
                            onClick={()=>removeFromCart(id)} 
                            alt="" 
                            whileHover={{ scale: 1.2, rotate: -90 }}
                            whileTap={{ scale: 0.9 }}
                        />
                        <motion.p
                            key={cartItems[id]}
                            initial={{ scale: 1.5 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                        >{cartItems[id]}</motion.p>
                        <motion.img 
                            src={assets.add_icon_green} 
                            onClick={()=>addToCart(id)} 
                            alt="" 
                            whileHover={{ scale: 1.2, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                        />
                    </motion.div>
                }
            </motion.div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p> <img src={assets.rating_starts} alt="" />
                </div>
                <p className="food-item-desc">{desc}</p>
                <motion.p 
                    className="food-item-price"
                    whileHover={{ scale: 1.1 }}
                >{currency}{price}</motion.p>
            </div>
        </motion.div>
    )
}

export default FoodItem
