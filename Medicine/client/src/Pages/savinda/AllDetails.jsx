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
      const response = await fetch(`/api/savinda/auth/users/items`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
      setFilteredOrders(data); // Initially set filtered orders to all orders
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleSearch = () => {
    filterdata(searchQuery);
  };

  const filterdata = (searchQuery) => {
    const filterData = orders.filter((customer) =>
      customer.namee && customer.namee.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(filterData);
  };

  return (
    <div className='all-ads'>
      <div className='search'>
        <input
          type='text'
          placeholder='Search by Name'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='border p-2 rounded mb-4'
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {filteredOrders.length > 0 ? (
        <div className='a-ad'>
          {filteredOrders.map((order) => (
            <Link to={`/sonepet/${order._id}`} key={order.itemId}>
              <div className='ad-with-photo-name-price'>
                <div className='image-container'>
                  {order.profilePicture && (
                    <img src={order.profilePicture} alt='Profile' />
                  )}
                </div>
                <div className='details-container'>
                  <p className='pet-name'>{order.namee}</p>
                  <p id='pet-price'>
                    <span>Rs </span>{order.price}
                  </p>
                  <p>Brand: {order.brand}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className='text-center text-xl'>No matching orders found!</p>
      )}
    </div>
  );
}
