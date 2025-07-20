import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import Papa from 'papaparse'
import { toast } from 'react-toastify'
import { useAuth } from '../services/useAuth'
import { addTrip, uploadImageCloudinary } from '../services/backend-api'
import type { Trip } from '../models/Trip'

const schema = z.object({
  title: z.string().min(1, 'Invalid title').max(30, "Max Length Of Title is 30 Characters"),
  type: z.string().min(1, 'Invalid type'),
  country: z.string().min(1, 'Invalid country'),
  city: z.string().min(1, 'Invalid city').max(30, "Max Length Of City is 30 Characters"),
  description: z.string().min(1, 'Description is required'),
  nights: z.number().min(1, 'At least 1 night'),
  price: z.number().min(0, 'Price must be non-negative'),
  rating: z.number().min(1).max(5),
  imageUrls: z.any().refine((files) => files?.length > 0 && files.length <= 6, {
    message: 'Add between 1 and 6 images',
  }),
  userId: z.string().min(1, 'UserId required'),
})

type FormData = z.infer<typeof schema>

const AddDestination = () => {

  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const [countries, setCountries] = useState<string[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/Data/allCountries.csv')
      .then((res) => res.text())
      .then((text) => {
        const result = Papa.parse<string[]>(text, { header: true })
        const countryList = result.data.map((row: any) => row.Country).filter(Boolean)
        setCountries(countryList)
      })
  }, [])
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const uploadedUrls = await uploadImageCloudinary(data.imageUrls);
      const trip: Trip = {
        ...data,
        imageUrls: uploadedUrls,
      };
      addTrip(trip);
      toast.success("Trip added successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      toast.error("Failed to add trip. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="mt-[70px] flex flex-col items-center justify-center min-h-screen p-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-md bg-white p-6 shadow rounded"
      >
        <div className="flex flex-row items-center gap-3">
          <img className="size-10" src="/notepad.png" />
          <h3 className="text-lg font-semibold">Add New Trip</h3>
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
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.country && <span className="text-red-500">{errors.country.message}</span>}

        <input {...register('city')} placeholder="City" className="border p-2 rounded" />
        {errors.city && <span className="text-red-500">{errors.city.message}</span>}

        <textarea {...register('description')} placeholder="Description" className="border p-2 rounded h-28 resize-none" />
        {errors.description && <span className="text-red-500">{errors.description.message}</span>}

        <input type="number" {...register('nights', { valueAsNumber: true })} placeholder="Nights" className="border p-2 rounded" />
        {errors.nights && <span className="text-red-500">{errors.nights.message}</span>}

        <input type="number" {...register('price', { valueAsNumber: true })} placeholder="Price ($)" className="border p-2 rounded" />
        {errors.price && <span className="text-red-500">{errors.price.message}</span>}

        <input type="number" {...register('rating', { valueAsNumber: true })} placeholder="Rating (1-5)" className="border p-2 rounded" />
        {errors.rating && <span className="text-red-500">{errors.rating.message}</span>}

        <input type="file" multiple accept="image/*" {...register('imageUrls')} onChange={(e) => {
          if (e.target.files && e.target.files.length > 6) {
            e.target.value = '';
            alert('You can upload a maximum of 6 images.');
          }
        }}
          className="border p-2 rounded" />
        {errors.imageUrls && <span className="text-red-500">{errors.imageUrls.message?.toString()}</span>}

        <input type="hidden" value={user?.userId} {...register('userId')} />

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? "Adding..." : "Add Trip"}
        </button>

      </form>
    </div>
  )
}

export default AddDestination

