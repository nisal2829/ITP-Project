import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import { app } from '../../firebase';
import { updateUserStart, updateUserFailure, updateUserSuccess, deleteUserStart, deleteUserSuccess, deleteUserFailure, signout } from '../../redux/savinda/User/userSlice';
import './css/profile.css';

export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/savinda/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/savinda/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
      alert('User deleted successfully');
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('api/savinda/auth/signout');
      dispatch(signout());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="user-profile">
      <h1 className="user-profile-name">Profile</h1>
      <form onSubmit={handleSubmit} className="user-profile-form">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <center>
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt="profile"
          className="user-profile-img"
          onClick={() => fileRef.current.click()}
        /></center>
        <p className="user-profile-emage uploading error">
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

        <input
          defaultValue={currentUser.username}
          type="text"
          id="username"
          placeholder="Username"
          className="user-profile-username"
          onChange={handleChange}
        />
        <input
          defaultValue={currentUser.email}
          type="email"
          id="email"
          placeholder="Email"
          className="user-profile-email"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="user-profile-password"
          onChange={handleChange}
        />
        <button className="user-profile-submit-btn">
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>

      <div className="flex">
        <span onClick={handleDeleteAccount} className="button-like button-like-danger">
          Close Account
        </span>
        <span onClick={handleSignOut} className="button-like button-like-danger">
          Sign Out
        </span>
        <Link className="button-like" to="/sadditem">
          Add Item
        </Link>
        <Link className="button-like" to="/sitems">
          My Item Details
        </Link>
      </div>

      <p className="user-profile-errors-button">{error && 'Something went wrong'}</p>
      <p className="user-profile-update-success-button">
        {updateSuccess && 'User updated successfully'}
      </p>
    </div>
  );
}
