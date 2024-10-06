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
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        console.error('Image upload failed:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setupdatediscount((prev) => ({
            ...prev,
            [field]: downloadURL,
          }));
        });
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
        const response = await fetch(`/api/savinda/user/getitem/${id}`);
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

    if (!updatediscount.namee.trim()) {
      errors.namee = "Name is required";
    }
    if (!updatediscount.brand.trim()) {
      errors.brand = "Brand is required";
    }
    if (!updatediscount.description.trim()) {
      errors.description = "Description is required";
    }
    if (!updatediscount.suppliername.trim()) {
      errors.suppliername = "Supplier Name is required";
    }
    if (!updatediscount.price || isNaN(updatediscount.price) || Number(updatediscount.price) <= 0) {
      errors.price = "Valid price is required";
    }
    if (!updatediscount.quentity || isNaN(updatediscount.quentity) || Number(updatediscount.quentity) <= 0) {
      errors.quentity = "Valid quantity is required";
    }
    if (!updatediscount.returndate.trim()) {
      errors.returndate = "Return Date is required";
    }
    if (!updatediscount.manufacturedate.trim()) {
      errors.manufacturedate = "Manufacture date is required";
    }
    if (!updatediscount.purchasedate.trim()) {
      errors.purchasedate = "Purchase Date required";
    }
    if (!updatediscount.percriptionrequired.trim()) {
      errors.percriptionrequired = "Prescription status is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/savinda/user/updateitem`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: updatediscount._id,
          ...updatediscount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Updated successfully");
        navigate('/sitems');
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
        <h1 className="form-title">Update Item</h1><br/><br/>


      <input 
        type="text" 
        placeholder='Name' 
        name="namee"
        onChange={handleInputChange}
        value={updatediscount.namee}
      />
      {formErrors.namee && <p className="error">{formErrors.namee}</p>}

      <input 
        type="text" 
        placeholder='Brand' 
        name="brand"
        onChange={handleInputChange}
        value={updatediscount.brand}
      />
      {formErrors.brand && <p className="error">{formErrors.brand}</p>}

      <input 
        type="text" 
        placeholder='Description' 
        name="description"
        onChange={handleInputChange}
        value={updatediscount.description}
      />
      {formErrors.description && <p className="error">{formErrors.description}</p>}

      <input 
        type="text" 
        placeholder='Supplier Name' 
        name="suppliername"
        onChange={handleInputChange}
        value={updatediscount.suppliername}
      />
      {formErrors.suppliername && <p className="error">{formErrors.suppliername}</p>}

      <input 
        type="text" 
        placeholder='Price' 
        name="price"
        onChange={handleInputChange}
        value={updatediscount.price}
      />
      {formErrors.price && <p className="error">{formErrors.price}</p>}

      <input 
        type="text" 
        placeholder='Quantity' 
        name="quentity"
        onChange={handleInputChange}
        value={updatediscount.quentity}
      />
      {formErrors.quentity && <p className="error">{formErrors.quentity}</p>}

      <input 
        type="text" 
        placeholder='Return Date' 
        name="returndate"
        onChange={handleInputChange}
        value={updatediscount.returndate}
      />
      {formErrors.returndate && <p className="error">{formErrors.returndate}</p>}

      <input 
        type="text" 
        placeholder='Manufacture Date' 
        name="manufacturedate"
        onChange={handleInputChange}
        value={updatediscount.manufacturedate}
      />
      {formErrors.manufacturedate && <p className="error">{formErrors.manufacturedate}</p>}

      <input 
        type="date" 
        placeholder='Purchase Date' 
        name="purchasedate"
        onChange={handleInputChange}
        value={updatediscount.purchasedate}
      />
      {formErrors.purchasedate && <p className="error">{formErrors.purchasedate}</p>}

      <input 
        type="text" 
        placeholder='Prescription Required' 
        name="percriptionrequired"
        onChange={handleInputChange}
        value={updatediscount.percriptionrequired}
      />
      {formErrors.percriptionrequired && <p className="error">{formErrors.percriptionrequired}</p>}

      <div className="flex justify-center items-center gap-4">
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

      <div className="flex justify-center items-center gap-4">
        <img
          src={
            updatediscount.profilePicture ||
            'https://media.istockphoto.com/id/1294866141/vector/picture-reload.jpg?s=612x612&w=is&k=20&c=Ei6q4n6VkP3B0R30d1VdZ4i11CFbyaEoAFy6_WEbArE='
          }
          alt="Profile"
          className="h-12 w-12 rounded-full object-cover border border-gray-300"
        />
      </div>

      {imagePercent > 0 && <div>Uploading {imagePercent}%</div>}
<center>
      <button className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleUpdate} disabled={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update'}
      </button></center>
    </div>
  );
}

export default UpdateUser;
