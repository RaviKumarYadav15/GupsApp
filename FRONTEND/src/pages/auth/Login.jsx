import React, { useState, useEffect } from 'react';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '../../features/auth/authThunks';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authLoading, isAuthenticated } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginThunk(formData)).unwrap();
      toast.success("Login successful!");
      setFormData({ email: '', password: '' });
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  };


  // Removed full screen spinner to show button loading state instead

  return (
    <div className='min-h-screen bg-gray-900 flex flex-col md:flex-row items-center justify-center gap-12 p-4'>
      
      {/* Intro/Branding Section */}
      <div className='text-center md:text-left'>
        <div className='flex items-center justify-center md:justify-start gap-4 mb-4'>
          <IoChatboxEllipsesOutline className='text-6xl text-[#574ae2]' />
          <p className='text-6xl font-bold text-white'>GupsApp</p>
        </div>
        <p className='text-xl text-gray-300 max-w-md'>Connect instantly with friends and family. Share your moments in real-time.</p>
      </div>

      <form onSubmit={handleSubmit} className='bg-black/40 backdrop-blur-md p-8 rounded-2xl shadow-md w-full max-w-[24rem] space-y-6 border border-white/40'>
        <div className="text-2xl font-bold text-center text-white">Login</div>

        <label className='flex items-center gap-3 p-2 border border-gray-300 rounded-xl'>
          <FaUser className='text-gray-500' />
          <input
            type='email'
            name='email'
            placeholder="Email"
            className="outline-none w-full text-white placeholder:text-gray-600 bg-transparent"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className='flex items-center gap-3 p-2 border border-gray-300 rounded-xl'>
          <RiLockPasswordFill className='text-gray-500' />
          <input
            type='password'
            name='password'
            placeholder="Password"
            className="outline-none w-full text-white placeholder:text-gray-600 bg-transparent"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium">
          {authLoading ? 'Logging in...' : 'Login'}
        </button>

        <div className="text-center text-white">
          Don't have an account? <Link to="/signup" className="text-blue-200 font-semibold hover:underline">Sign Up</Link>
        </div>
      </form>
    </div>
  );
};
export default Login;