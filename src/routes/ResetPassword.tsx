import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "react-toastify";

const schema = z
  .object({
    password: z.string()
      .min(8, 'Password must be at least 12 characters')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/[a-z]/, 'Must include a lowercase letter')
      .regex(/[0-9]/, 'Must include a number')
      .regex(/[^A-Za-z0-9]/, 'Must include a special character'),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const api = import.meta.env.VITE_BACKEND_API_URL

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!userId || !token) {
      toast.error("Invalid or missing reset link.");
      navigate("/login");
    }
  }, [userId, token]);

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
  if (submitting) return;
  setSubmitting(true);
  try {
    await axios.post(`${api}/api/v1/account/reset-password`, {
      userId,
      token,
      newPassword: data.password,
    });
    toast.success("Password reset successfully!");
    navigate("/login");
  } catch (error: any) {
    toast.error(error?.response?.data || "Reset failed.");
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-sm bg-white p-6 shadow rounded"
      >
        <h3 className="text-xl text-center mb-4">Reset Your Password</h3>

        <input
          type="password"
          placeholder="New Password"
          {...register("password")}
          className="border p-2 rounded"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword")}
          className="border p-2 rounded"
        />
        {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? "Processing..." : "Reset Password"}
        </button>

      </form>
    </div>
  );
};

export default ResetPassword;
