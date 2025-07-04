import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import { useAuth } from '../services/useAuth';
import { sendResetPasswordLinkAPI } from '../services/backend-api';


const schema = z.object({
  username: z.string().min(1, 'Invalid Username'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
}
)

type FormData = z.infer<typeof schema>;

const LogIn = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch, // ✅ add this
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    loginUser(data.username, data.password, from);
  };


  const username = watch("username");
  const [resetLoading, setResetLoading] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-sm bg-white p-6 shadow rounded"
      >
        <div className="flex flex-row justify-start items-center gap-3">
          <img className="size-10" src="/notepad.png" />
          <h3>Login Into Your Account</h3>
        </div>


        <input
          type="username"
          placeholder="Username"
          {...register('username')}
          className="border p-2 rounded"
        />
        {errors.username && <span className="text-red-500">{errors.username.message}</span>}

        <input
          type="password"
          placeholder="Password"
          {...register('password')}
          className="border p-2 rounded"
        />
        {errors.password && <span className="text-red-500">{errors.password.message}</span>}
        <p>Need To Create An account? <Link to="/sign-up" className="text-blue-800 hover:underline font-medium">Sign Up</Link></p>
        <button
          type="button"
          disabled={resetLoading}
          onClick={async () => {
            if (!username) {
              toast.error("Please enter your username first.");
              return;
            }

            setResetLoading(true);
            try {
              await sendResetPasswordLinkAPI(username);
              toast.success("Reset link sent to your email.");
            } catch (err: any) {
              toast.error(err.response?.data || "Something went wrong.");
            } finally {
              setResetLoading(false);
            }
          }}
          className={`text-sm text-blue-700 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed`}
        >
          {resetLoading ? "Sending..." : "Reset Password?"}
        </button>


        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Log In
        </button>
      </form>
    </div>
  );
};

export default LogIn;
