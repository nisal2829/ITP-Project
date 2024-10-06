import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { app } from '../../firebase';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import './css/OnePetShow.css';

function OneShow() {
  const [imagePercent, setImagePercent] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();
  const fileRef1 = useRef(null);
  const [image1, setImage1] = useState(undefined);
  const [updatediscount, setupdatediscount] = useState({
    petname: "",
    namee: "",
    price: "",
    description: "",
    profilePicture: "",
  });

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
            [field]: downloadURL
          }));
        });
      }
    );
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

  return (
    <div className="container">
      <div className="bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-6">{updatediscount.namee}</h2>
        
        <div className="flex justify-center mb-4">
          <img
            src={updatediscount.profilePicture || 'https://media.istockphoto.com/id/1294866141/vector/picture-reload.jpg?s=612x612&w=is&k=20&c=Ei6q4n6VkP3B0R30d1VdZ4i11CFbyaEoAFy6_WEbArE='}
            alt="Profile"
            className="h-40 w-40 object-cover border border-gray-300 rounded-lg shadow-md cursor-pointer"
            onClick={() => fileRef1.current.click()}
          />
        </div>
        
        <div className="mb-4 text-center">
          <label className="block text-gray-700 font-semibold">Price:</label>
          <p className="text-gray-900 text-lg">{updatediscount.price}</p>
        </div>
        
        <div className="mb-4 text-center">
          <label className="block text-gray-700 font-semibold">Description:</label>
          <p className="text-gray-900">{updatediscount.description}</p>
        </div>

        <div className="text-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            onClick={() => navigate('/All')}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default OneShow;
