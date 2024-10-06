import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/updateitem.css';
import { app } from '../../firebase';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';

function UpdateUser() {
  const [imagePercent, setImagePercent] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();
  const fileRef1 = useRef(null);

  const [image1, setImage1] = useState(undefined);
  const [updatediscount, setupdatediscount] = useState({
    namee: "",
    type: "",
    quentity: "",
    status: "",
    profilePicture: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (image1) {
      handleFileUpload(image1, 'profilePicture');
    }
  }, [image1]);

  const handleFileUpload = (image, field) => {
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
        console.error('Image upload failed:', error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setupdatediscount((prev) => ({
          ...prev,
          [field]: downloadURL,
        }));
      }
    );
  };

  const handleImage1Click = () => {
    if (fileRef1.current) {
      fileRef1.current.click();
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/hiruni/user/getitem/${id}`);
        const data = await response.json();

        if (data.success) {
          setupdatediscount(data.data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleInputChange = (e) => {
    setupdatediscount({
      ...updatediscount,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let errors = {};

    if (!updatediscount.namee.trim()) errors.namee = "Name is required";
    if (!updatediscount.type.trim()) errors.type = "Type is required";
    if (!updatediscount.quentity || isNaN(updatediscount.quentity) || Number(updatediscount.quentity) <= 0) {
      errors.quentity = "Valid quantity is required";
    }
    if (!updatediscount.status.trim()) errors.status = "Status is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/hiruni/user/updateitem`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: updatediscount._id,
          ...updatediscount,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Updated successfully");
        navigate('/items');
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="service-update">

    <center><h1>Update</h1></center>



      <input
        type="text"
        name="namee"
        placeholder="Name"
        onChange={handleInputChange}
        value={updatediscount.namee}
      />
      {formErrors.namee && <p className="error">{formErrors.namee}</p>}

      <input
        type="text"
        name="type"
        placeholder="Type"
        onChange={handleInputChange}
        value={updatediscount.type}
      />
      {formErrors.type && <p className="error">{formErrors.type}</p>}

      <input
        type="number"
        name="quentity"
        placeholder="Quantity"
        onChange={handleInputChange}
        value={updatediscount.quentity}
      />
      {formErrors.quentity && <p className="error">{formErrors.quentity}</p>}

      <input
        type="text"
        name="status"
        placeholder="Status"
        onChange={handleInputChange}
        value={updatediscount.status}
      />
      {formErrors.status && <p className="error">{formErrors.status}</p>}

      <div className="flex">
        <button
          type="button"
          onClick={handleImage1Click}
          className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Update Picture
        </button>
      </div>

      <input
        type="file"
        ref={fileRef1}
        onChange={(e) => setImage1(e.target.files[0])}
        style={{ display: 'none' }}
      />

      <div className="flex">
        <img
          src={
            updatediscount.profilePicture ||
            'https://media.istockphoto.com/id/1294866141/vector/picture-reload.jpg?s=612x612&w=is&k=20&c=Ei6q4n6VkP3B0R30d1VdZ4i11CFbyaEoAFy6_WEbArE='
          }
          alt="Profile"
        />
      </div>

      {imagePercent > 0 && <div className="uploading-status">Uploading {imagePercent}%</div>}
      
      <button onClick={handleUpdate} disabled={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update'}
      </button>
    </div>
  );
}

export default UpdateUser;
