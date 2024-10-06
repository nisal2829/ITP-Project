import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../firebase'; // Adjust the path as per your project structure
import { FaTrash, FaEdit } from 'react-icons/fa'; // Importing Font Awesome icons
import { useReactToPrint } from 'react-to-print';
import './css/Staffprofile.css';

export default function StaffDetailsProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); // Add filteredOrders state
  const [orderIdToDelete, setOrderIdToDelete] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const componentPDF = useRef();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (searchKey) {
      // Filter orders based on search key
      const filteredData = orders.filter(
        (order) =>
          order.firstName.toLowerCase().includes(searchKey.toLowerCase()) ||
          order.staffId.toString().includes(searchKey)
      );
      setFilteredOrders(filteredData);
    } else {
      setFilteredOrders(orders); // Show all orders if no search key is provided
    }
  }, [searchKey, orders]); // Re-run the effect when searchKey or orders change

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/nisal/auth/Staff/${currentUser._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
      setFilteredOrders(data);

      // Fetch images from Firebase for each order
      data.forEach((order) => {
        if (order.profilePicture) {
          fetchFirebaseImage(order.profilePicture, 'profilePicture', order._id);
        }
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchFirebaseImage = async (imageUrl, field, orderId) => {
    const storageRef = ref(storage, imageUrl);
    try {
      const downloadUrl = await getDownloadURL(storageRef);
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order._id === orderId) {
            return {
              ...order,
              [field]: downloadUrl,
            };
          }
          return order;
        })
      );
    } catch (error) {
      console.error(`Error fetching image from Firebase for ${field}:`, error);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      const res = await fetch(`/api/nisal/user/deleteStaff/${orderIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderIdToDelete)
        );
      }

      setShowModal(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: 'Total Item Report',
    onBeforeGetContent: () => {
      setIsGeneratingPDF(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsGeneratingPDF(false);
      alert('Data saved in PDF');
    },
  });

  return (
    <div className="container mt-5">
      <div className="searchbtn">
        <input
          type="search"
          onChange={(e) => setSearchKey(e.target.value)} // Set search key as the user types
          placeholder="Staff Id or Name"
          className="in"
        />
      </div>
      <h2 className="text-center mb-4">Staff Information</h2>
      <div ref={componentPDF} style={{ width: '100%' }}>
        {filteredOrders.length > 0 ? (
          <Table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Staff Id</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Department</th>
                <th>Position</th>
                <th>Assigned Shifts</th>
                <th>Work Schedule</th>
                <th>Photos</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.staffId}</td>
                  <td>{order.firstName}</td>
                  <td>{order.lastName}</td>
                  <td>{order.emaill}</td>
                  <td>{order.phoneNumber}</td>
                  <td>{order.department}</td>
                  <td>{order.position}</td>
                  <td>{order.assignedShifts}</td>
                  <td>{order.workSchedule}</td>
                  <td>
                    {order.profilePicture && (
                      <img
                        src={order.profilePicture}
                        alt="Profile"
                        className="img-thumbnail"
                        style={{ width: '100px', height: '100px' }}
                      />
                    )}
                  </td>
                  <td className="d-flex gap-2">
                    <Link to={`/Nupdate-staff/${order._id}`} className="btn btn-primary btn-sm">
                      <FaEdit />
                    </Link>
                    <Button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setShowModal(true);
                        setOrderIdToDelete(order._id);
                      }}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center">No staff found!</p>
        )}
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)} size="md">
        <Modal.Header closeButton />
        <Modal.Body className="text-center">
          <HiOutlineExclamationCircle size={50} className="mb-4 text-danger" />
          <h4>Are you sure you want to delete this staff member?</h4>
          <div className="mt-4 d-flex justify-content-center gap-3">
            <Button className="btn btn-danger" onClick={handleDeleteOrder}>
              Yes, I am sure
            </Button>
            <Button className="btn btn-secondary" onClick={() => setShowModal(false)}>
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <button onClick={generatePDF}>Generate Report</button>
    </div>
  );
}
