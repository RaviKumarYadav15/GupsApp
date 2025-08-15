import React, { useState, useEffect } from 'react';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '../../features/auth/authThunks';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

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


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white text-lg gap-4">
        <p className='text-6xl'>GupsApp</p>
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-lg tracking-wide">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
      <form onSubmit={handleSubmit} className='bg-black/40 backdrop-blur-md p-8 rounded-2xl shadow-md w-[24rem] space-y-6 border border-white/40'>
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
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="text-center text-white">
          Don't have an account? <Link to="/signup" className="text-blue-200 font-semibold hover:underline">Sign Up</Link>
        </div>
      </form>
    </div>
  );
};
export default Login;