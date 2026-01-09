import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import './FoodDisplay.css'
import FoodItem from '../FoodItem/FoodItem'
import { StoreContext } from '../../Context/StoreContext'

const FoodDisplay = ({category}) => {

  // 1. Get searchTerm from Context
  const { food_list, searchTerm } = useContext(StoreContext);

  // 2. Logic: Filter based on Category AND Search Term
  const filteredItems = food_list.filter((item) => {
    const matchesCategory = category === "All" || category === item.category;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div 
      className='food-display' 
      id='food-display'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        Top dishes near you
      </motion.h2>
      <div className='food-display-list'>
        {filteredItems.map((item, index)=>{
          return (
            <FoodItem 
              key={item._id} 
              image={item.image} 
              name={item.name} 
              desc={item.description} 
              price={item.price} 
              id={item._id}
              index={index}
            />
          )
        })}
      </div>
    </motion.div>
  )
}

export default FoodDisplay