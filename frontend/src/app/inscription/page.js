"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

export default function Inscription() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirm_password] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://myrottentomato.onrender.com/user/register",
        {
          username,
          email,
          password,
          confirm_password,
        }
      );

      toast.success(response.data.message);
      router.push("/connexion");
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
            Sign up
          </h2>

          <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                className="w-full px-3 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Email
              </label>
              <input
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
                type="password"
                className="w-full px-3 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setConfirm_password(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Enregistrer"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Have an account?{" "}
            <span
              onClick={() => router.push("/connexion")}
              className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}