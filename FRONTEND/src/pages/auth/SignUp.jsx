import React, { useState, useEffect } from 'react';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { signupThunk } from '../../features/auth/authThunks';

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [avatar, setAvatar] = useState("./default_user.png");
  const [preview, setPreview] = useState(null);

  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  // profile is loaded and user is authenticated, redirect to home
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, username, email, password, confirmPassword, gender } = formData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const data = new FormData();
      data.append("fullName", fullName);
      data.append("username", username);
      data.append("email", email);
      data.append("password", password);
      data.append("gender", gender);

      if (avatar && typeof avatar === "object") {
        data.append("avatar", avatar);
      } else {
        const res = await fetch("/default_user.png");
        const blob = await res.blob();
        const file = new File([blob], "default_user.png", { type: blob.type });
        data.append("avatar", file);
      }

      const user = await dispatch(signupThunk(data)).unwrap();
      if (user?.username) {
        toast.success(`Welcome, ${user.username}`);
      } else {
        toast.error("Registration failed.");
      }
    } catch (error) {
      toast.error(error || "Signup failed");
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
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className='bg-black/40 backdrop-blur-md p-8 rounded-2xl shadow-md w-[24rem] space-y-5 border border-white/40'
      >
        <div className="text-2xl font-bold text-center text-white">Sign Up</div>

        {/* Full Name */}
        <label className='flex items-center gap-3 p-2 border border-gray-300 rounded-xl'>
          <FaUser className='text-gray-500' />
          <input
            type='text'
            name='fullName'
            placeholder="Full Name"
            className="outline-none w-full text-white placeholder:text-gray-600 bg-transparent"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </label>
        {/* Username */}
        <label className='flex items-center gap-3 p-2 border border-gray-300 rounded-xl'>
          <FaUser className='text-gray-500' />
          <input
            type='text'
            name='username'
            placeholder="Username"
            className="outline-none w-full text-white placeholder:text-gray-600 bg-transparent"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        {/* Email */}
        <label className='flex items-center gap-3 p-2 border border-gray-300 rounded-xl'>
          <MdEmail className='text-gray-500' />
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

        {/* Password */}
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

        {/* Confirm Password */}
        <label className='flex items-center gap-3 p-2 border border-gray-300 rounded-xl'>
          <RiLockPasswordFill className='text-gray-500' />
          <input
            type='password'
            name='confirmPassword'
            placeholder="Confirm Password"
            className="outline-none w-full text-white placeholder:text-gray-600 bg-transparent"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>

        {/* Gender */}
        <div className="w-full text-white">
          <label className="block mb-2 text-sm">Gender</label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleChange}
                className="accent-blue-500"
                required
              />
              <span>Male</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleChange}
                className="accent-pink-500"
                required
              />
              <span>Female</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="other"
                checked={formData.gender === "other"}
                onChange={handleChange}
                className="accent-purple-500"
                required
              />
              <span>Other</span>
            </label>
          </div>
        </div>

        {/* Avatar Upload */}
        <div className="flex flex-col-reverse items-center gap-3 justify-between p-2 pr-10">
          <span className="text-white text-sm font-medium">Upload Avatar</span>
          <label className='text-white cursor-pointer'>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setAvatar(file);
                if (file) setPreview(URL.createObjectURL(file));
              }}
              hidden
            />
            <div className="mt-3 flex justify-center">
              <img
                src={preview || "/default_user.png"}
                alt="avatar preview"
                className="w-15 h-15 rounded-full object-cover border border-white shadow-md"
              />
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium"
        >
          Sign Up
        </button>

        <div className="text-center text-white">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-300 font-semibold hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};
export default SignUp;