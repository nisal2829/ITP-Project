import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/allpets.css';

export default function AllDetails() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/hiruni/auth/users/items`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
      // Initially set filtered orders to all orders
      setFilteredOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleSearch = () => {
    filterData(searchQuery);
  };

  const filterData = (query) => {
    const filteredData = orders.filter(order =>
      order.namee && order.namee.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredOrders(filteredData);
  };

  return (
    <div className='all-details-container'>
      <div className='search-container'>
        <input
          type='text'
          placeholder='Search by Name'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='search-input'
        />
        <button onClick={handleSearch} className='search-button'>Search</button>
      </div>
      {filteredOrders.length > 0 ? (
        <div className='order-list'>
          {filteredOrders.map((order) => (
            <Link to={'/'} key={order.itemId} className='order-item'>
              <div className='order-details'>
                <div className='image-container'>
                  {order.profilePicture && (
                    <img src={order.profilePicture} alt='Profile' className='order-image' />
                  )}
                </div>
                <div className='details-container'>
                  <p className='pet-name'>{order.namee}</p>
                  <p className='pet-type'>
                    <span>Type:</span> {order.status}
                  </p>
                  <p className='pet-status'>Status: {order.brand}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className='no-orders-message'>No matching orders found!</p>
      )}
    </div>
  );
}
