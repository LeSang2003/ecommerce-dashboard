import { Navigate, useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-7xl font-bold text-indigo-600">404</h1>
      <p className="text-xl mt-4 font-semibold">Page not found</p>
      <p className="text-gray-400 mt-2">
        The page you are looking for doesn't exist
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Go back
      </button>
    </div>
  );
}
export default NotFound;
