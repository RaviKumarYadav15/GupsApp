import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfileThunk } from "../features/auth/authThunks.js";

const AppLoader = ({ children }) => {
  const dispatch = useDispatch();
  const {authLoading} = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white text-lg gap-4">
        <p className="text-6xl">GupsApp</p>
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg tracking-wide">Checking authentication...</p>
      </div>
    );
  }

  return children;
};

export default AppLoader;