import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import OAuth from '../../components/hiruni/OAuth';
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
    type: "",
    quentity: "",
    status: "",
    profilePicture: "",
  });

  // Image upload handler
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
            [field]: downloadURL
          }));
        });
      }
    );
  };

  const handleImage1Click = () => {
    fileRef1.current.click();
  };

  // Improved Form Validation
  const validateForm = () => {
    const errors = {};

    // Name validation: required, min length
    if (!formData.namee.trim()) {
      errors.namee = 'Name is required';
    } else if (formData.namee.length < 3) {
      errors.namee = 'Name must be at least 3 characters long';
    }

    // Type validation: required
    if (!formData.type.trim()) {
      errors.type = 'Type is required';
    }

    // Quantity validation: required, must be a number and greater than 0
    if (!formData.quentity || isNaN(formData.quentity) || formData.quentity <= 0) {
      errors.quentity = 'Quantity must be a positive number';
    }

    // Status validation: required
    if (!formData.status.trim()) {
      errors.status = 'Status is required';
    }

    // Image validation: required
    if (!formData.profilePicture) {
      errors.profilePicture = 'Profile picture is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form data
    if (!validateForm()) {
      return;
    }

    try {
      const res = await fetch('/api/hiruni/auth/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create item');
      }

      alert('Item added successfully');
      navigate('/items');
    } catch (error) {
      setError('Something went wrong!');
      console.log(error);
    }
  };

  return (
    <div className="add-item-container">
      <h1>Equipment</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder='Name'
          value={formData.namee}
          onChange={(e) => setFormData({ ...formData, namee: e.target.value })}
        />
        {formErrors.namee && <p className="error-message">{formErrors.namee}</p>}

        <input
          type="text"
          placeholder='Type'
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        />
        {formErrors.type && <p className="error-message">{formErrors.type}</p>}

        <input
          type="text"
          placeholder='Quantity'
          value={formData.quentity}
          onChange={(e) => setFormData({ ...formData, quentity: e.target.value })}
        />
        {formErrors.quentity && <p className="error-message">{formErrors.quentity}</p>}

        <input
          type="text"
          placeholder='Status'
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        />
        {formErrors.status && <p className="error-message">{formErrors.status}</p>}

        <div>
          <button className="upload-btn" type="button" onClick={handleImage1Click}>
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
        {formErrors.profilePicture && <p className="error-message">{formErrors.profilePicture}</p>}

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

        <button className="submit-btn" type="submit" disabled={imagePercent > 0 && imagePercent < 100}>
          Submit
        </button>
      </form>
      <OAuth />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
