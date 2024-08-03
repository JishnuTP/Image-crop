import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [images, setImages] = useState([]);
    const [latestImage, setLatestImage] = useState(null);

    useEffect(() => {
        // Fetch images from backend
        const fetchImages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/images');
                const fetchedImages = response.data;

                // Find the latest image
                if (fetchedImages.length > 0) {
                    const sortedImages = fetchedImages.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    );
                    setLatestImage(sortedImages[0]);
                    setImages(sortedImages);
                }
            } catch (err) {
                console.error('Error fetching images', err);
            }
        };

        fetchImages();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-4">
            <div className="bg-white p-4 rounded-lg shadow-lg text-center w-full max-w-md mb-6">
                <h1 className="text-2xl font-extrabold text-gray-800 mb-2">Welcome to the Image Upload App</h1>
                <p className="text-sm text-gray-600 mb-4">
                    Go to the{' '}
                    <Link 
                        to="/upload" 
                        className="text-blue-500 hover:text-blue-700 font-semibold"
                    >
                        upload page
                    </Link>{' '}
                    to upload and crop images.
                </p>
                <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRutT5BPMNmZXyGIgjtXNAloc1seEadRp-tsA&s" 
                    alt="Upload" 
                    className="mx-auto rounded-lg shadow-md max-w-full h-32"
                />
            </div>
            {latestImage && (
                <div className="bg-white p-4 rounded-lg shadow-lg text-center w-full max-w-md mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Latest Cropped Image</h2>
                    <img 
                        src={latestImage.url} 
                        alt="Latest Cropped" 
                        className="max-w-full h-auto rounded-lg mx-auto"
                    />
                </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 w-full">
                {images.map((image) => (
                    <div key={image._id} className="bg-white p-2 rounded-lg shadow-md">
                        <img 
                            src={image.url} 
                            alt="Uploaded" 
                            className="max-w-full h-auto rounded-lg"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
