"use client";

import { Users, Clapperboard, MessageSquareDot } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function StatistiquePage() {
  const [films, setFilms] = useState([]);
  const [users, setUsers] = useState({});
  const token = localStorage.getItem("token");

  const optionsFilms = {
    method: "GET",
    url: "https://myrottentomato.onrender.com/movie",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const optionsUsers = {
    method: "GET",
    url: "https://myrottentomato.onrender.com/user",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const { data } = await axios.request(optionsFilms);
        setFilms(data.movies);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchUsers = async () => {
      try {
        const { data } = await axios.request(optionsUsers);
        setUsers(data);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFilms();
    fetchUsers();
  }, []);

  return (
    <>
      <div className="h-full flex flex-col p-6">
        <h2 className="mb-10 text-gray-700 font-semibold text-2xl">
          Statistiques
        </h2>
        <div className="flex-1 overflow-y-auto">
          <div className="m-6">
            <div className="flex flex-wrap -mx-6">
              <div className="w-full px-6 sm:w-1/2 xl:w-1/3">
                <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-slate-100">
                  <div className="p-3 rounded-full bg-indigo-600 bg-opacity-75">
                    <Users
                      className="rounded-3xl hover:cursor-pointer"
                      size={40}
                      color="#ffffff"
                      strokeWidth={3}
                      absoluteStrokeWidth
                    />
                  </div>
                  <div className="mx-5">
                    <h4 className="text-2xl font-semibold text-gray-700">
                      {users.length}
                    </h4>
                    <div className="text-gray-500">Utilisateurs</div>
                  </div>
                </div>
              </div>
              <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
                <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-slate-100">
                  <div className="p-3 rounded-full bg-orange-600 bg-opacity-75">
                    <Clapperboard
                      className="rounded-3xl hover:cursor-pointer"
                      size={40}
                      color="#ffffff"
                      strokeWidth={3}
                      absoluteStrokeWidth
                    />
                  </div>
                  <div className="mx-5">
                    <h4 className="text-2xl font-semibold text-gray-700">
                      {films.length}
                    </h4>
                    <div className="text-gray-500">Total Films</div>
                  </div>
                </div>
              </div>
              <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 xl:mt-0">
                <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-slate-100">
                  <div className="p-3 rounded-full bg-pink-600 bg-opacity-75">
                    <MessageSquareDot
                      className="rounded-3xl hover:cursor-pointer"
                      size={40}
                      color="#ffffff"
                      strokeWidth={3}
                      absoluteStrokeWidth
                    />
                  </div>
                  <div className="mx-5">
                    <h4 className="text-2xl font-semibold text-gray-700">
                      678
                    </h4>
                    <div className="text-gray-500">Commentaires</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" />
      </div>
    </>
  );
}