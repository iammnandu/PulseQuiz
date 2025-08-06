import React, { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom"

const Signin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate=useNavigate();

  const handleSignin = () => {
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    axios
      .post("http://localhost:3000/admin/signin", {
        email,
        password,
      })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        console.log("Signin successful");
        alert("Signin successful");

        setError(""); 
        navigate('/')
      })
      .catch((err) => {
        console.error("Signin error:", err);
        setError("Signin failed. Please check your credentials.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Signin</h1>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleSignin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Signin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signin;