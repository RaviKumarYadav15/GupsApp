import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfileThunk } from "../features/auth/authThunks.js";
import { setAuthLoading } from "../features/auth/authSlice.js";

const AppLoader = ({ children }) => {
  const dispatch = useDispatch();
  const { authLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    const hasSession = localStorage.getItem("hasSession");
    if (hasSession === "true") {
      dispatch(getProfileThunk());
    } else {
      dispatch(setAuthLoading(false));
    }
  }, [dispatch]);

  return children;
};

export default AppLoader;