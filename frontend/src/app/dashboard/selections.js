"use client";

import { CircleX } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function SelectionPage() {
  const [films, setFilms] = useState([]);
  const [user, setUser] = useState({});
  const token = localStorage.getItem("token");
  const [pageActuelle, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const DeleteMovie = async (id) => {
    try {
      const { data } = await axios.delete(`https://myrottentomato.onrender.com/movie/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(data.message);
      console.log(data);

      //Met a jour le tableau films en retirant le film supprimé
      setFilms(films.filter((film) => film._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error.response?.data.message);
    }
  };


  const optionsUser = {
    method: "GET",
    url: "https://myrottentomato.onrender.com/user/me",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const { data } = await axios({
          method: "GET",
          url: `https://myrottentomato.onrender.com/movie/page/${pageActuelle}`,
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setFilms(data.movies);
        setTotalPages(data.totalPages);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchUser = async () => {
      try {
        const { data } = await axios.request(optionsUser);
        setUser(data);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFilms();
    fetchUser();
  }, [pageActuelle]);

  return (
    <>
      <div className="h-full flex flex-col p-6">
        <h2 className="mb-10 text-gray-700 font-semibold text-2xl">
          Mes selections
        </h2>
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {films.map((film, index) => (
              <div
                key={index}
                className="relative bg-white shadow-md rounded-lg overflow-hidden  scale-95 hover:scale-100"
              >
                <div className="absolute top-3 right-3  text-gray-200  w-6 h-6 text-center">
                  <button
                    onClick={() => DeleteMovie(film._id)}
                    className="hover:cursor-pointer"
                  >
                    <CircleX fill="red" size={30} />
                  </button>
                </div>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${film.image}`}
                  alt={film.title}
                  className="w-full h-60 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{film.title}</h3>
                  <p className="text-gray-500">
                    Popularités: {film.popularite}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => setPage(pageActuelle - 1)}
            disabled={pageActuelle === 1}
            className="px-4 py-2  rounded disabled:opacity-50 bg-blue-500 text-white font-semibold"
          >
            Précédent
          </button>

          <span className="py-2">
            Page {pageActuelle} / {totalPages}
          </span>

          <button
            onClick={() => {
              setPage(pageActuelle + 1);
            }}
            disabled={pageActuelle === totalPages}
            className="px-4 py-2  rounded disabled:opacity-50 bg-blue-500 text-white font-semibold"
          >
            Suivant
          </button>
        </div>
        <ToastContainer position="top-right" />
      </div>
    </>
  );
}