import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../services/useAuth';


const schema = z.object({
  name: z.string().min(1, "Username is required"),
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[a-z]/, 'Must include a lowercase letter')
    .regex(/[0-9]/, 'Must include a number')
    .regex(/[^A-Za-z0-9]/, 'Must include a special character'),
}
)

type FormData = z.infer<typeof schema>;

const SignUp = () => {

  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data: FormData) => {
    if (loading) return;
    setLoading(true);
    try {
      await registerUser(data.email, data.name, data.password, from);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-sm bg-white p-6 shadow rounded"
      >
        <div className="flex flex-row justify-start items-center gap-3">
          <img className="size-10" src="/notepad.png" />
          <h3>Create Your Account</h3>
        </div>

        <input
          type="text"
          placeholder="Name"
          {...register('name')}
          className="border p-2 rounded"
        />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}

        <input
          type="email"
          placeholder="Email"
          {...register('email')}
          className="border p-2 rounded"
        />
        {errors.email && <span className="text-red-500">{errors.email.message}</span>}

        <input
          type="password"
          placeholder="Password"
          {...register('password')}
          className="border p-2 rounded"
        />
        {errors.password && <span className="text-red-500">{errors.password.message}</span>}
        <p>Already have an account? <Link to="/login" className="text-blue-800 hover:underline font-medium">Login</Link></p>
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

      </form>
    </div>
  );
};

export default SignUp;
