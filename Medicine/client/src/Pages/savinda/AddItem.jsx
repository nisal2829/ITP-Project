import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import OAuth from '../../components/savinda/OAuth';
import { app } from '../../firebase';
import { useSelector } from 'react-redux';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import './css/addpet.css';

export default function AddItem() {
  const [imagePercent, setImagePercent] = useState(0);
  const fileRef1 = useRef(null);
  const [imageError, setImageError] = useState(false);
  const [image1, setImage1] = useState(undefined);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    userId: currentUser._id,
    namee: "",
    brand: "",
    suppliername: "",
    price: "",
    quentity: "",
    returndate: "",
    manufacturedate: "",
    purchasedate: "",
    description: "",
    percriptionrequired: "",
    profilePicture: "",
  });

  useEffect(() => {
    if (image1) {
      handleFileUpload(image1);
    }
  }, [image1]);

  const handleFileUpload = async (image) => {
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
            profilePicture: downloadURL
          }));
        });
      }
    );
  };

  const handleImage1Click = () => {
    fileRef1.current.click();
  };

  const validateForm = () => {
    const errors = {};
    const today = new Date();
    const manufactureDateObj = new Date(formData.manufacturedate);
    const returndateObj = new Date(formData.returndate);

    if (!formData.namee.trim()) errors.namee = 'Name is required';
    if (!formData.brand.trim()) errors.brand = 'Brand is required';
    if (!formData.suppliername.trim()) errors.suppliername = 'Supplier Name is required';
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) errors.price = 'Price must be a positive number';
    if (!formData.quentity || isNaN(formData.quentity) || formData.quentity <= 0) errors.quentity = 'Quantity must be a positive integer';
    if (!formData.manufacturedate) errors.manufacturedate = 'Manufacture date is required';
    if (manufactureDateObj > today) errors.manufacturedate = 'Manufacture date cannot be in the future';
    if (!formData.returndate) errors.returndate = 'Return Date is required';
    if (returndateObj <= manufactureDateObj) errors.returndate = 'Return Date must be after the manufacture date';
    if (!formData.purchasedate.trim()) errors.purchasedate = 'Purchase Date are required';
    if (!formData.percriptionrequired.trim()) errors.percriptionrequired = 'Prescription Required field is required (Yes/No)';
    if (!formData.profilePicture) errors.profilePicture = 'Profile picture is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      const res = await fetch('/api/savinda/auth/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create item');
      }

      alert('Item added successfully');
      navigate('/sitems');
    } catch (error) {
      setError('Something went wrong!');
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLetterInput = (e) => {
    if (!/^[a-zA-Z\s]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="add-pet-container">
      <h1>Add Item</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="namee"
          placeholder='Name'
          value={formData.namee}
          onChange={handleInputChange}
          onKeyPress={handleLetterInput}
        />
        {formErrors.namee && <p className="error">{formErrors.namee}</p>}

        <input
          type="text"
          name="brand"
          placeholder='Brand'
          value={formData.brand}
          onChange={handleInputChange}
          onKeyPress={handleLetterInput}
        />
        {formErrors.brand && <p className="error">{formErrors.brand}</p>}

        <input
          type="text"
          name="suppliername"
          placeholder='Supplier Name'
          value={formData.suppliername}
          onChange={handleInputChange}
        />
        {formErrors.suppliername && <p className="error">{formErrors.suppliername}</p>}

        <input
          type="number"
          name="price"
          placeholder='Price'
          value={formData.price}
          onChange={handleInputChange}
        />
        {formErrors.price && <p className="error">{formErrors.price}</p>}

        <input
          type="number"
          name="quentity"
          placeholder='Quantity'
          value={formData.quentity}
          onChange={handleInputChange}
        />
        {formErrors.quentity && <p className="error">{formErrors.quentity}</p>}

        <input
          type="date"
          name="manufacturedate"
          placeholder='Manufacture Date'
          value={formData.manufacturedate}
          onChange={handleInputChange}
        />
        {formErrors.manufacturedate && <p className="error">{formErrors.manufacturedate}</p>}

        <input
          type="date"
          name="returndate"
          placeholder='Return Date'
          value={formData.returndate}
          onChange={handleInputChange}
          min={formData.manufacturedate ? new Date(formData.manufacturedate).toISOString().split('T')[0] : ''}
        />
        {formErrors.returndate && <p className="error">{formErrors.returndate}</p>}

        <input
          type="date"
          name="purchasedate"
          placeholder='Purchase Date'
          value={formData.purchasedate}
          onChange={handleInputChange}
        />
        {formErrors.purchasedate && <p className="error">{formErrors.purchasedate}</p>}

        <input
          type="text"
          name="description"
          placeholder='Description'
          value={formData.description}
          onChange={handleInputChange}
        />

        <input
          type="text"
          name="percriptionrequired"
          placeholder='Prescription Required (Yes/No)'
          value={formData.percriptionrequired}
          onChange={handleInputChange}
        />
        {formErrors.percriptionrequired && <p className="error">{formErrors.percriptionrequired}</p>}

        <div>
          <button className="upload-button" type="button" onClick={handleImage1Click}>
            Upload Picture
          </button>
          <input
            ref={fileRef1}
            type="file"
            accept="image/*"
            onChange={(e) => setImage1(e.target.files[0])}
            hidden
          />
        </div>
        {formErrors.profilePicture && <p className="error">{formErrors.profilePicture}</p>}

        <div>
          <img
            src={formData.profilePicture || 'https://media.istockphoto.com/id/1294866141/vector/picture-reload.jpg?s=612x612&w=is&k=20&c=Ei6q4n6VkP3B0R30d1VdZ4i11CFbyaEoAFy6_WEbArE='}
            alt='Profile'
            onClick={handleImage1Click}
          />
        </div>

        <p className="upload-progress-errors">
          {imageError ? (
            <span>Error uploading image (file size must be less than 2 MB)</span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span>{`Uploading: ${imagePercent}%`}</span>
          ) : imagePercent === 100 ? (
            <span>Image uploaded successfully</span>
          ) : (
            ''
          )}
        </p>

        <button id='submit-button' type="submit" disabled={imagePercent > 0 && imagePercent < 100}>
          Submit
        </button>
      </form>
      <OAuth />
      {error && <p className="error">{error}</p>}
    </div>
  );
}