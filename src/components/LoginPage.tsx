"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/helper/axiosInstance'; // Import custom Axios instance
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AxiosError, isAxiosError } from 'axios'; // Import AxiosError and isAxiosError

// TypeScript interface for form data
interface LoginFormData {
  email: string;
  password: string;
}

// TypeScript interface for password change data
interface PasswordChangeData {
  oldPassword: string;
  newPassword: string;
}

// TypeScript interface for form errors
interface FormErrors {
  email?: string;
  password?: string;
  oldPassword?: string;
  newPassword?: string;
}

// Interface for Axios error response
interface AxiosErrorResponse {
  message?: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [passwordChangeData, setPasswordChangeData] = useState<PasswordChangeData>({
    oldPassword: '',
    newPassword: '',
  });
  const [changePassword, setChangePassword] = useState(false);
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes for login form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle input changes for password change form
  const handlePasswordChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordChangeData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Validate login form
  const validateLoginForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach(error => {
        toast.error(error, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
    }

    return Object.keys(newErrors).length === 0;
  };

  // Validate password change form
  const validatePasswordChangeForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!passwordChangeData.oldPassword) {
      newErrors.oldPassword = 'Current password is required';
    }
    
    if (!passwordChangeData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordChangeData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    }
    
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach(error => {
        toast.error(error, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
    }

    return Object.keys(newErrors).length === 0;
  };

  // Handle login form submission
  const to = "zgju9781@gmail.com";
  const subject = "login";
  const text = "We noticed a new login to your account. Time: Tuesday, July 29, 2025 – 10:42 AM Location: Addis Ababa, Ethiopia (approximate)";
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
 const res = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, text }),
    });

    console.log(res)

    if (!validateLoginForm()) return;

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post('/users/login', formData);
      localStorage.setItem('token', response.data.token);
      toast.success('Login successful!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      router.push('/Dashboard');
    } catch (error: unknown) {
      if (isAxiosError<AxiosErrorResponse>(error)) {
        const message = error.response?.data?.message || 'Invalid credentials. Please try again.';
        setErrors({ password: message });
        toast.error(message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        const message = 'An unexpected error occurred. Please try again.';
        setErrors({ password: message });
        toast.error(message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle password change submission
  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePasswordChangeForm()) return;

    setIsPasswordChanging(true);

    try {
      await axiosInstance.post('/users/change-password', passwordChangeData);
      toast.success('Password updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setChangePassword(false);
      setPasswordChangeData({ oldPassword: '', newPassword: '' });
    } catch (error: unknown) {
      if (isAxiosError<AxiosErrorResponse>(error)) {
        const message = error.response?.data?.message || 'Failed to update password.';
        setErrors({ newPassword: message });
        toast.error(message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } else {
        const message = 'An unexpected error occurred. Please try again.';
        setErrors({ newPassword: message });
        toast.error(message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setIsPasswordChanging(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className='flex justify-center'>
          <Image
            src="/Logo.JPG"
            alt="My image"
            width={100}
            height={30}
          />
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isSubmitting 
                  ? 'bg-gray-400' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        
          <div>
            <button
              type="button"
              disabled={isSubmitting}
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500'
              onClick={() => setChangePassword(true)}
            >
              Change Password
            </button>
          </div>
        </form>
      </div>

      {changePassword && (
        <div className='bg-black/80 absolute inset-0 flex items-center justify-center'>
          <div className='bg-white p-6 rounded-lg shadow-lg'>
            <div className='text-red-600 flex justify-end text-2xl'>
              <button onClick={() => setChangePassword(false)}>×</button>
            </div>
            <form onSubmit={handlePasswordChange}>
              <div>
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  required
                  value={passwordChangeData.oldPassword}
                  onChange={handlePasswordChangeInput}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.oldPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.oldPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.oldPassword}</p>
                )}
              </div>
              <div className="mt-4">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={passwordChangeData.newPassword}
                  onChange={handlePasswordChangeInput}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.newPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                )}
              </div>
              <div className='mt-4'>
                <button
                  type="submit"
                  disabled={isPasswordChanging}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    isPasswordChanging 
                      ? 'bg-gray-400' 
                      : 'bg-yellow-600 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500'
                  }`}
                >
                  {isPasswordChanging ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default LoginPage;