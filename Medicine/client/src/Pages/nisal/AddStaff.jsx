import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { app } from '../../firebase';
import { useSelector } from 'react-redux';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import './css/AddStaff.css';

export default function AddStaff() {
  const [imagePercent, setImagePercent] = useState(0);
  const fileRef1 = useRef(null);
  const [orders, setOrders] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [image1, setImage1] = useState(undefined);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    userId: currentUser._id,
    staffId: '',
    firstName: '',
    lastName: '',
    emaill: '',
    phoneNumber: '',
    department: '',
    position: '',
    assignedShifts: '',
    workSchedule: '',
    profilePicture: '',
  });

  const [isNewStaffId, setIsNewStaffId] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/nisal/auth/Staff/${currentUser._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    if (image1) {
      handleFileUpload(image1, 'profilePicture');
    }
  }, [image1]);

  const handleFileUpload = async (image, field) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
        setError('Image upload failed');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({
            ...prev,
            [field]: downloadURL,
          }));
        });
      }
    );
  };

  const handleImage1Click = () => {
    fileRef1.current.click();
  };

  const handleStaffIdChange = (e) => {
    const value = e.target.value;
    if (value === 'new') {
      setIsNewStaffId(true);
      setFormData({ ...formData, staffId: '' });
    } else {
      setIsNewStaffId(false);
      setFormData({ ...formData, staffId: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (isNewStaffId && !formData.staffId.trim()) {
      setError('Staff ID is required.');
      return;
    }
    if (!formData.firstName.trim()) {
      setError('First Name is required.');
      return;
    }
    if (!formData.lastName.trim()) {
      setError('Last Name is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.emaill.trim()) {
      setError('Email is required.');
      return;
    } else if (!emailRegex.test(formData.emaill)) {
      setError('Invalid email format.');
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phoneNumber.trim()) {
      setError('Phone Number is required.');
      return;
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      setError('Phone Number must be a 10-digit number.');
      return;
    }
    if (!formData.department) {
      setError('Please select a department.');
      return;
    }
    if (!formData.position) {
      setError('Please select a position.');
      return;
    }
    if (!formData.assignedShifts) {
      setError('Assigned shift time is required.');
      return;
    }
    if (!formData.workSchedule) {
      setError('Work schedule is required.');
      return;
    }

    try {
      const res = await fetch('/api/nisal/auth/AddStaff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to add staff');
      }

      alert('Staff added successfully');
      navigate('/NStaffDetailsProfile');
    } catch (error) {
      setError('Something went wrong!');
      console.log(error);
    }
  };

  return (
    <div className="add-staff-container">
      <h1 id="main-topic-of-form">Add Details </h1>
      {error && <p className="error-message">{error}</p>}
      <h1 id="sub-first-topic-of-form">Basic Information</h1>
      <form id="add-staff-form" onSubmit={handleSubmit}>
        <label>Your Staff Id</label>
        <select onChange={handleStaffIdChange}>
          <option value="">Select Staff ID</option>
          {orders.map((order) => (
            <option key={order._id} value={order.staffId}>
              {order.staffId}
            </option>
          ))}
          {orders.length === 0 && <option value="new">Add New Staff ID</option>}
        </select>

        {isNewStaffId && (
          <input
            type="text"
            placeholder="Enter New Staff ID"
            onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
          />
        )}

        <input
          type="text"
          placeholder="First Name"
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Last Name"
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, emaill: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone Number"
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
        />
        <h1 id="sub-second-topic-of-form">Work Information</h1>
        <label>Department</label>
        <select onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
          <option value="">Select Department</option>
          <option value="Human Resources">Human Resources</option>
          <option value="Finance">Finance</option>
          <option value="Engineering">Engineering</option>
          <option value="Sales">Sales</option>
          <option value="Marketing">Marketing</option>
        </select>

        <label>Position</label>
        <select onChange={(e) => setFormData({ ...formData, position: e.target.value })}>
          <option value="">Select Position</option>
          <option value="Manager">Manager</option>
          <option value="Team Lead">Team Lead</option>
          <option value="Developer">Developer</option>
          <option value="Accountant">Accountant</option>
          <option value="Sales Executive">Sales Executive</option>
        </select>

        <h1 id="sub-third-topic-of-form">Manage Schedule</h1>
        <input
          type="time"
          placeholder="Assigned Shifts"
          onChange={(e) => setFormData({ ...formData, assignedShifts: e.target.value })}
        />
        <p>to</p>
        <input
          type="time"
          placeholder="Work Schedule"
          onChange={(e) => setFormData({ ...formData, workSchedule: e.target.value })}
        />

        <input
          type="file"
          ref={fileRef1}
          id="profilePicture"
          hidden
          accept="image/*"
          onChange={(e) => setImage1(e.target.files[0])}
        />
        <div>
          <button className="upload-button" type="button" onClick={handleImage1Click}>
            Upload Profile Picture
          </button>
        </div>
        <div>
          <img
            src={formData.profilePicture || 'https://media.istockphoto.com/id/1294866141/vector/picture-reload.jpg?s=612x612&w=is&k=20&c=Ei6q4n6VkP3B0R30d1VdZ4i11CFbyaEoAFy6_WEbArE='}
            alt=""
            style={{ width: '150px', height: '150px', borderRadius: '50%' }}
          />
        </div>

        <button type="submit">Add Staff</button>
      </form>
    </div>
  );
}
