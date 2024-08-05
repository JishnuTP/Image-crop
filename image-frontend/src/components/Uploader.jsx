import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getCroppedImg } from '../utils/crop';

const Uploader = () => {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    if (!image || !croppedArea) return;

    try {
      const croppedImg = await getCroppedImg(image, croppedArea);
      console.log('Cropped Image Base64:', croppedImg); // Debug log
      setCroppedImage(croppedImg);
    } catch (e) {
      console.error('Error cropping image:', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!croppedImage) return;

    try {
      const base64Image = croppedImage.split(',')[1];
      const uploadResponse = await axios.post('http://localhost:5000/api/upload', { image: base64Image }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (uploadResponse.status !== 200) throw new Error('Upload failed');
      alert('Image uploaded successfully');
      navigate('/');
    } catch (err) {
      console.error('Error uploading image', err);
      alert('Error uploading image');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-400 to-blue-500 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Upload and Crop Image</h2>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="mb-4 border border-gray-300 rounded p-2 w-full"
        />
        {image && (
          <div className="relative w-full h-80 mb-4">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
        )}
        {croppedImage && (
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold mb-2">Cropped Image Preview</h3>
            <img 
              src={croppedImage} 
              alt="Cropped" 
              className="max-w-full h-auto mb-4"
            />
          </div>
        )}
        <button 
          onClick={handleCrop} 
          className="bg-blue-500 text-white flex px-4 py-2 rounded shadow hover:bg-blue-600 transition"
        >
          Crop
        </button>
        <button 
          onClick={handleSubmit} 
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition mt-4"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Uploader;







/// crop image using react-cropper ====   un-command to run croping in this method -also 
//uncommand backend route post method and comment above code



// import React, { useState, useRef } from 'react';
// import Cropper from 'react-cropper';
// import 'cropperjs/dist/cropper.css';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Uploader = () => {
//   const [image, setImage] = useState(null);
//   const [croppedImage, setCroppedImage] = useState(null);
//   const cropperRef = useRef(null);
//   const navigate = useNavigate();

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleCrop = () => {
//     const cropper = cropperRef.current.cropper;
//     const croppedCanvas = cropper.getCroppedCanvas();
//     const croppedImgUrl = croppedCanvas.toDataURL();
//     setCroppedImage(croppedImgUrl);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!croppedImage) return;

//     try {
//       const response = await fetch(croppedImage);
//       const blob = await response.blob();
//       const formData = new FormData();
//       formData.append('image', blob);

//       const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (uploadResponse.status !== 200) throw new Error('Upload failed');
//       alert('Image uploaded successfully');
//       navigate('/');
//     } catch (err) {
//       console.error('Error uploading image', err);
//       alert('Error uploading image');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-400 to-blue-500 p-4">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
//         <h2 className="text-2xl font-bold mb-4 text-center">Upload and Crop Image</h2>
//         <input 
//           type="file" 
//           accept="image/*" 
//           onChange={handleFileChange} 
//           className="mb-4 border border-gray-300 rounded p-2 w-full"
//         />
//         {image && (
//           <div className="relative w-full h-80 mb-4">
//             <Cropper
//               src={image}
//               style={{ height: 400, width: '100%' }}
//               initialAspectRatio={1}
//               aspectRatio={1}
//               guides={false}
//               ref={cropperRef}
//               viewMode={1}
//               dragMode="move"
//               crop={handleCrop}
//             />
//           </div>
//         )}
//         {croppedImage && (
//           <div className="text-center mb-4">
//             <h3 className="text-lg font-semibold mb-2">Cropped Image Preview</h3>
//             <img 
//               src={croppedImage} 
//               alt="Cropped" 
//               className="max-w-full h-auto mb-4"
//             />
//           </div>
//         )}
//         <button 
//           onClick={handleSubmit} 
//           className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
//         >
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Uploader;
