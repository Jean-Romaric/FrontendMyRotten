"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/user/login", {
        email,
        password,
      });

      toast.success(response.data.message, { autoClose: 1000 });
      localStorage.setItem("token", response.data.token);
      Cookies.set("token", response.data.token);
      router.push("/");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Erreur inconnue";

      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl p-8 text-white">
          <h2 className="text-center text-3xl font-bold text-indigo-400">
            Sign in
          </h2>

          <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                className="w-full px-3 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                className="w-full px-3 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Connexion"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <span
              onClick={() => router.push("/inscription")}
              className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}