import { useNavigate } from "react-router-dom";

function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow text-center w-96">
        <h1 className="text-3xl font-bold text-red-500 mb-2">403</h1>

        <p className="text-gray-700 mb-4">
          You don’t have permission to access this page.
        </p>

        <p className="text-sm text-gray-400 mb-6">
          (If you are a customer, this page is for admins only)
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccessDenied;
