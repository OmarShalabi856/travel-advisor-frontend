import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import crypto from 'crypto';
import type { Trip } from "../models/Trip";
import type { UserProfileToken } from "../models/UserProfileToken";
import type { UpdateTrip } from "../models/UpdateTrip";
import { handleError } from "../helpers/handleError";


//const api = "https://travel-advisor-os-f6990bee5198.herokuapp.com"

const api = import.meta.env.VITE_BACKEND_API_URL;


export const loginAPI = async (username: string, password: string) => {
  try {
    username = username.trim();
    const data = await axios.post<UserProfileToken>(`${api}/api/v1/account/login`,
      {
        username: username,
        password: password
      }
    );
    return data;
  }
  catch (error) {
    handleError(error)
  }
}

export const registerAPI = async (email: string, username: string, password: string) => {
  try {
    email = email.trim();
    const data = await axios.post<any>(
      `${api}/api/v1/account/register`,
      { email, username, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const uploadImageCloudinary = async (files: FileList) => {
  const uploadUrls: string[] = [];

  for (const file of Array.from(files)) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "travel-advisor");
    formData.append("folder", "trips/uploads");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dooaepjfa/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        uploadUrls.push(data.secure_url);
      } else {
        throw new Error(data.error?.message || "Unknown upload error");
      }
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast.error(`Failed to upload ${file.name}: ${error.message}`);
    }
  }

  return uploadUrls;
};

export const addTrip = async (trip: Trip) => {
  try {
    const { data } = await axios.post<Trip>(`${api}/api/v1/trip/add-trip`, trip);
    return data;

  } catch (error) {
    handleError(error);
  }

};

export const getUserTrips = async () => {
  try {
    const { data } = await axios.get(`${api}/api/v1/trip/get-my-trips`);
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const getTripById = async (id: string | number) => {
  try {
    const { data } = await axios.get(`${api}/api/v1/trip/${id}`);
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const refreshTokenAPI = async (refreshToken: string) => {
  return await axios.post(`${api}/api/v1/account/refresh`, {
    refreshToken,
  });
}
export const updateTrip = async (trip: UpdateTrip) => {
  try {
    const { data } = await axios.put<UpdateTrip>(`${api}/api/v1/trip/update-trip`, trip);
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteTrip = async (id: number) => {
  try {
    const { data } = await axios.delete(`${api}/api/v1/trip/${id}`);
    return data;
  } catch (error) {
    // handleError(error);
  }
};


export const getAllTrips = async (
  pageNumber: number,
  pageCount: number,
  country?: string,
  priceMin?: number,
  priceMax?: number,
  nightsMin?: number,
  nightsMax?: number
) => {
  try {
    const params = new URLSearchParams();
    params.append("pageCount", pageCount.toString());
    if (country) params.append("country", country);
    if (priceMin !== undefined) params.append("priceMin", priceMin.toString());
    if (priceMax !== undefined) params.append("priceMax", priceMax.toString());
    if (nightsMin !== undefined) params.append("nightsMin", nightsMin.toString());
    if (nightsMax !== undefined) params.append("nightsMax", nightsMax.toString());

    const { data } = await axios.get(`${api}/api/v1/trip/home/${pageNumber}?${params.toString()}`);
    console.log(data)
    return data; // expected: { totalCount, trips }
  } catch (error) {
    // Optional: log or show error
    console.error("Error fetching trips:", error);
    return { totalCount: 0, trips: [] }; // ✅ Prevent UI crash
  }
};



export const getTripsCount = async () => {
  try {
    const { data } = await axios.get(`${api}/api/v1/trip/trips-count`);
    return data;
  } catch (error) {
    // handleError(error);
  }
};

export const sendResetPasswordLinkAPI = async (username:string) => {
  try {
    const { data } = await axios.post(`${api}/api/v1/account/request-password-reset`,{username});
    return data;
  } catch (error) {
    // handleError(error);
  }
}

export const deleteImageCloudinary = async (publicId: string) => {
  const res = await axios.post(`${api}/api/v1/cloudinary/delete`, { publicId });
  return res.data;

};



