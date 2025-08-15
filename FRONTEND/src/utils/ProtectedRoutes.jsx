import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated,authLoading } = useSelector((state) => state.auth);
  console.log(isAuthenticated)
  console.log(authLoading)
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login',{replace:true});
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading) {
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

  return isAuthenticated ? children : null; // safeguard
};

export default ProtectedRoutes;

// This works, but it may flash the protected component before
//  redirecting (especially on refresh).
//  A cleaner approach is to wait for authLoading to finish before rendering anything: