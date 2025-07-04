import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';

type Trip = {
  id: string;
  imageUrls: string[];
  title: string;
  description: string;
  price: number;
  country: string;
  nights: number;
};

const TripDetails = () => {
  const { id } = useParams();
  const [tripDetails, setTripDetails] = useState<Trip | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const api = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await axios.get<Trip>(`${api}/api/v1/trip/details/${id}`);
        console.log(response)
        setTripDetails(response.data);
      } catch (err) {
        console.error("Failed to fetch trip", err);
      }
    };
    fetchTrip();
  }, []);

  if (!tripDetails) return <div className="p-4">Loading...</div>;

  const { imageUrls, title, description, price, country, nights } = tripDetails;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="relative h-96 overflow-hidden rounded-lg shadow-lg">
        <img
          src={imageUrls[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
        >
          ›
        </button>
      </div>

      <div className="mt-6 space-y-2">
        <span className="text-sm uppercase text-gray-500">{country}</span>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-700">{description}</p>
        <div className="text-lg font-semibold">
          ${price} / {nights} Nights
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
