import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import axios from 'axios';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userId = searchParams.get('userId');
  const token = searchParams.get('token');
  const api = import.meta.env.VITE_BACKEND_API_URL
   const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return; 
    didRun.current = true;

    const userId = searchParams.get("userId");
    const token = searchParams.get("token");

    const verifyEmail = async () => {
      try {
        const res = await axios.post(`${api}/api/v1/account/verify-email`, { userId, token });
        toast.success(res.data || "Email verified successfully!");
        navigate("/");
      } catch (error: unknown) {
        let message = "Verification link expired or invalid.";

        if (axios.isAxiosError(error) && error.response) {
          message = error.response.data as string || message;
        }

        toast.error(message);
        navigate("/login");
      }
    };

    if (userId && token) {
      verifyEmail();
    } else {
      toast.error("Missing verification info.");
      navigate("/login");
    }
  }, []);

  return (
    <div>
      <h3 className="text-center mt-auto">Verifying Email...</h3>
    </div>
  );
};

export default EmailVerification;
