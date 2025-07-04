import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router';
import Papa from 'papaparse';
import { getTripById, uploadImageCloudinary, addTrip, updateTrip, deleteImageCloudinary } from  '../services/backend-api';
import { useAuth } from '../services/useAuth';
import type { UpdateTrip } from '../models/UpdateTrip';
import { toast } from 'react-toastify';


const schema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Invalid title').max(30, "Max Length Of Title is 30 Characters"),
  type: z.string().min(1, 'Invalid type'),
  country: z.string().min(1, 'Invalid country'),
  city: z.string().min(1, 'Invalid city').max(30, "Max Length Of Title is 30 Characters"),
  description: z.string().min(1, 'Description is required'),
  nights: z.number().min(1, 'At least 1 night'),
  price: z.number().min(0, 'Price must be non-negative'),
  rating: z.number().min(1).max(5),
  existingImageUrls: z.array(z.string()).optional(),
  newImages: z
    .any()
    .optional()
    .refine((files) => !files || files.length <= 6, { message: 'Add up to 6 images' }),
  userId: z.string().min(1, 'UserId required'),
});

type FormData = z.infer<typeof schema>;

export  default function UpdateTrip () {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      existingImageUrls: [],
      newImages: undefined,
    },
  });

  // Fetch trip by id
  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    getTripById(id)
      .then((trip) => {
        if (!trip) {
          setNotFound(true);
          return;
        }
        setOriginalImages(trip.imageUrls || []);
        reset({
          id: trip.id,
          title: trip.title,
          type: trip.type,
          country: trip.country,
          city: trip.city,
          description: trip.description,
          nights: trip.nights,
          price: trip.price,
          rating: trip.rating,
          existingImageUrls: trip.imageUrls || [],
          userId: user?.userId || '',
          newImages: undefined,
        });
      })
      .catch(() => {
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id, reset, user?.userId]);

  useEffect(() => {
    fetch('/Data/allCountries.csv')
      .then((res) => res.text())
      .then((text) => {
        const result = Papa.parse<string[]>(text, { header: true });
        const countryList = result.data.map((row: any) => row.Country).filter(Boolean);
        setCountries(countryList);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (notFound) return <div>Trip not found</div>;

  // Get watched fields
  const existingImages = watch('existingImageUrls') || [];

  const removeImage = (url: string) => {
    setValue(
      'existingImageUrls',
      existingImages.filter((img) => img !== url),
      { shouldValidate: true }
    );
  };


  const onSubmit = async (data: FormData) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const keptImages = data.existingImageUrls || [];
      const removedImages = originalImages.filter((img) => !keptImages.includes(img));
      let uploadedUrls: string[] = [...keptImages];

      if (data.newImages && data.newImages.length > 0) {
        const newUploadedUrls = await uploadImageCloudinary(data.newImages);
        uploadedUrls = [...uploadedUrls, ...newUploadedUrls];
      }

      if (uploadedUrls.length > 6) {
        toast.error('You cannot have more than 6 images.');
        return;
      }

      await Promise.all(removedImages.map(deleteImageCloudinary));

      const updatedTrip: UpdateTrip = {
        id: data.id,
        title: data.title,
        type: data.type,
        country: data.country,
        city: data.city,
        description: data.description,
        nights: data.nights,
        price: data.price,
        rating: data.rating,
        imageUrls: uploadedUrls,
      };

      await updateTrip(updatedTrip);
      toast.success('Trip updated successfully!');
      setTimeout(() => navigate('/my-trips'), 2000);
    } catch {
      toast.error('Failed to update trip. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const totalImages = existingImages.length + files.length;

    if (totalImages > 6) {
      e.target.value = '';
      alert(`You can upload a maximum of 6 photos total. Please remove some existing images.`);
      return;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2 mt-[70px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-md bg-white p-6 shadow rounded"
      >
        <div className="flex flex-row items-center gap-3">
          <img className="size-10" src="/notepad.png" alt="Notepad" />
          <h3 className="text-lg font-semibold">Update Your Trip</h3>
        </div>

        <input {...register('title')} placeholder="Title" className="border p-2 rounded" />
        {errors.title && <span className="text-red-500">{errors.title.message}</span>}

        <select {...register('type')} className="border p-2 rounded">
          <option value="">Select Trip Type</option>
          <option value="Adventure">Adventure</option>
          <option value="Beach">Beach</option>
          <option value="Cultural">Cultural</option>
          <option value="Nature">Nature</option>
          <option value="Luxury">Luxury</option>
        </select>
        {errors.type && <span className="text-red-500">{errors.type.message}</span>}

        <select {...register('country')} className="border p-2 rounded">
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.country && <span className="text-red-500">{errors.country.message}</span>}

        <input {...register('city')} placeholder="City" className="border p-2 rounded" />
        {errors.city && <span className="text-red-500">{errors.city.message}</span>}

        <textarea
          {...register('description')}
          placeholder="Description"
          className="border p-2 rounded h-28 resize-none"
        />
        {errors.description && <span className="text-red-500">{errors.description.message}</span>}

        <input
          type="number"
          {...register('nights', { valueAsNumber: true })}
          placeholder="Nights"
          className="border p-2 rounded"
        />
        {errors.nights && <span className="text-red-500">{errors.nights.message}</span>}

        <input
          type="number"
          {...register('price', { valueAsNumber: true })}
          placeholder="Price ($)"
          className="border p-2 rounded"
        />
        {errors.price && <span className="text-red-500">{errors.price.message}</span>}

        <input
          type="number"
          {...register('rating', { valueAsNumber: true })}
          placeholder="Rating (1-5)"
          className="border p-2 rounded"
        />
        {errors.rating && <span className="text-red-500">{errors.rating.message}</span>}

        <div>
          <label className="block mb-1 font-semibold">Existing Images (click to remove):</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {existingImages.map((url) => (
              <div
                key={url}
                className="relative cursor-pointer"
                onClick={() => removeImage(url)}
                title="Click to remove"
              >
                <img
                  src={url}
                  alt="Trip"
                  className="w-20 h-20 object-cover rounded border"
                />
                <div className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 cursor-pointer select-none">
                  ×
                </div>
              </div>
            ))}
          </div>
        </div>

        <input
          type="file"
          multiple
          accept="image/*"
          {...register('newImages')}
          onChange={handleFileChange}
          className="border p-2 rounded"
        />
        {errors.newImages && <span className="text-red-500">{errors.newImages.message?.toString()}</span>}

        <input type="hidden" value={user?.userId} {...register('userId')} />

        <button
          type="submit"
          disabled={submitting}
          className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
          {submitting ? "Updating..." : "Update Trip"}
        </button>

      </form>
    </div>
  );
};


