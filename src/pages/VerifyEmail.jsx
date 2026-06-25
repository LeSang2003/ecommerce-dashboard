import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/api";

function VerifyEmail() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const token = searchParams.get("token");

    console.log("TOKEN =", token);

    // KHÔNG CÓ TOKEN
    if (!token) {
      setMessage("Invalid token");

      return;
    }

    const verify = async () => {
      try {
        await API.get(`/auth/verify?token=${token}`);

        setMessage("Email verified successfully");

        // AUTO LOGIN PAGE
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (err) {
        console.log(err);

        setMessage("Verification failed");
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-xl rounded-2xl p-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Email Verification</h1>

        <p className="text-lg">{message}</p>
      </div>
    </div>
  );
}

export default VerifyEmail;
