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
  const componentPDF = useRef();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/savinda/auth/user/${currentUser._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);

      // Fetch images from Firebase for each order
      data.forEach(order => {
        if (order.profilePicture) {
          fetchFirebaseImage(order.profilePicture, 'profilePicture', order._id);
        }
        if (order.alternateProfilePicture) {
          fetchFirebaseImage(order.alternateProfilePicture, 'alternateProfilePicture', order._id);
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
      setOrders(prevOrders => prevOrders.map(order => {
        if (order._id === orderId) {
          return {
            ...order,
            [field]: downloadUrl
          };
        }
        return order;
      }));
    } catch (error) {
      console.error(`Error fetching image from Firebase for ${field}:`, error);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      const res = await fetch(`/api/savinda/user/deleteitem/${orderIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setOrders(prevOrders =>
          prevOrders.filter(order => order._id !== orderIdToDelete)
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
    }
  });

  return (
    <div className="table-auto">
      <h2 className="my-8 text-center font-bold text-4xl text-gray-800">Item Information</h2>

      <div ref={componentPDF} style={{ width: '100%' }}>
        {orders.length > 0 ? (
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Brand</Table.HeadCell>
              <Table.HeadCell>Supplier Name</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell>Quantity</Table.HeadCell>
              <Table.HeadCell>Return Date</Table.HeadCell>
              <Table.HeadCell>Manufacture Date</Table.HeadCell>
              <Table.HeadCell>Purchase Date</Table.HeadCell>
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell>Prescription Required</Table.HeadCell>
              <Table.HeadCell>Photo</Table.HeadCell>
              {!isGeneratingPDF && <Table.HeadCell>Action</Table.HeadCell>}
            </Table.Head>
            <Table.Body>
              {orders.map((order) => (
                <Table.Row key={order._id} >
                  <Table.Cell>{order.namee}</Table.Cell>
                  <Table.Cell>{order.brand}</Table.Cell>
                  <Table.Cell>{order.suppliername}</Table.Cell>
                  <Table.Cell>{order.price}</Table.Cell>
                  <Table.Cell>{order.quentity}</Table.Cell>
                  <Table.Cell>{order.returndate}</Table.Cell>
                  <Table.Cell>{order.manufacturedate}</Table.Cell>
                  <Table.Cell>{order.purchasedate}</Table.Cell>
                  <Table.Cell>{order.description}</Table.Cell>
                  <Table.Cell>{order.percriptionrequired}</Table.Cell>
                  <Table.Cell>
                    {order.profilePicture && (
                      <img src={order.profilePicture} alt="Profile" className="h-20 w-20 object-cover rounded" />
                    )}
                  </Table.Cell>
                  {!isGeneratingPDF && (
                    <Table.Cell>
                      <Link to={`/supdate-item/${order._id}`}>
                        <Button id="edit-btn" className="text-green-500">
                          <b>Edit Item</b>
                        </Button>
                      </Link>
                      <Button id="delete-btn" className="text-red-500" onClick={() => {
                        setShowModal(true);
                        setOrderIdToDelete(order._id);
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
          <p>You have no orders yet!</p>
        )}
      </div>

      <button id='genratebtn' onClick={generatePDF} disabled={isGeneratingPDF}>
        {isGeneratingPDF ? 'Generating PDF...' : 'Generate Report'}
      </button>

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
            <h3 className="mb-5 text-lg font-normal text-gray-500">
              Are you sure you want to delete this order?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteOrder}>
                Yes, I am sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
