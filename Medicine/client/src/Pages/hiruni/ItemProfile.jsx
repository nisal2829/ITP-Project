import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../firebase'; // Adjust the path as per your project structure
import './css/itemprofile.css';
import { useReactToPrint } from 'react-to-print';

export default function ItemProfile() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [orderIdToDelete, setOrderIdToDelete] = useState('');
  const [showModal, setShowModal] = useState(false);
  const componentPDF = useRef(); // Reference for PDF generation

  useEffect(() => {
    if (currentUser?._id) {
      fetchOrders();
    }
  }, [currentUser]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/hiruni/auth/user/${currentUser._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
      // Fetch images for all orders
      data.forEach(order => {
        fetchFirebaseImages(order);
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchFirebaseImages = async (order) => {
    if (order.profilePicture) {
      order.profilePicture = await fetchFirebaseImage(order.profilePicture);
    }
    if (order.alternateProfilePicture) {
      order.alternateProfilePicture = await fetchFirebaseImage(order.alternateProfilePicture);
    }
    setOrders(prevOrders => prevOrders.map(o => o._id === order._id ? order : o));
  };

  const fetchFirebaseImage = async (imageUrl) => {
    const storageRef = ref(storage, imageUrl);
    try {
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  };

  const handleDeleteOrder = async () => {
    try {
      const res = await fetch(`/api/hiruni/user/deleteitem/${orderIdToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderIdToDelete));
        setShowModal(false);
      } else {
        const data = await res.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: 'Total Item Report',
    onBeforeGetContent: () => setIsGeneratingPDF(true),
    onAfterPrint: () => {
      setIsGeneratingPDF(false);
      alert('Data saved in PDF');
    }
  });

  return (
    <div className="table-auto">
      <h2 className="my-8 text-center font-bold text-4xl text-gray-800">Item Information</h2>

      <div ref={componentPDF}>
        {orders.length > 0 ? (
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Type</Table.HeadCell>
              <Table.HeadCell>Quantity</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Photo</Table.HeadCell>
              {!isGeneratingPDF && <Table.HeadCell>Action</Table.HeadCell>}
            </Table.Head>
            <Table.Body>
              {orders.map(({ _id, namee, type, quentity, status, profilePicture }) => (
                <Table.Row key={_id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{namee}</Table.Cell>
                  <Table.Cell>{type}</Table.Cell>
                  <Table.Cell>{quentity}</Table.Cell>
                  <Table.Cell>{status}</Table.Cell>
                  <Table.Cell>
                    {profilePicture && (
                      <img src={profilePicture} alt="Profile" className="h-20 w-20 object-cover rounded" />
                    )}
                  </Table.Cell>
                  {!isGeneratingPDF && (
                    <Table.Cell>
                      <Link to={`/update-item/${_id}`}>
                        <Button id="edit-btn" className="text-green-500"><b>Edit Item</b></Button>
                      </Link>
                      <Button id="delete-btn" className="text-red-500" onClick={() => {
                        setShowModal(true);
                        setOrderIdToDelete(_id);
                      }}>
                        <b>Delete Order</b>
                      </Button>
                    </Table.Cell>
                  )}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <p>No orders available yet!</p>
        )}
      </div>

      <br />

      <button id='genratebtn' onClick={generatePDF} disabled={isGeneratingPDF}>
        {isGeneratingPDF ? 'Generating PDF...' : 'Generate Report'}
      </button>

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
            <h3 className="mb-5 text-lg font-normal text-gray-500">Are you sure you want to delete this order?</h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteOrder}>Yes, I am sure</Button>
              <Button color="gray" onClick={() => setShowModal(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
