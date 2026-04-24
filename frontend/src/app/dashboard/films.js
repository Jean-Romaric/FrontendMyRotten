"use client";

import { PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function FilmsPage() {
  const [films, setFilms] = useState([]);
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);//ici
  const [pageActuelle, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

   useEffect(() => {//ici
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);


  const AddMovie = async (...params) => {
    const MovieInfo = {
      idFilm: params[0],
      title: params[1],
      genres: params[2],
      popularite: params[3],
      dateDesortie: params[4],
      image: params[5],
      description: params[6]
    };

    try {
      const { data } = await axios.post(
        `https://myrottentomato.onrender.com/movie`,
        MovieInfo,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      console.log(data);
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error.response?.data.message);
    }
  };

  const optionsFilms = {
    method: "GET",
    url: "https://api.themoviedb.org/3/discover/movie",
    params: {
      include_adult: "false",
      include_video: "true",
      language: "fr-FR",
      page: pageActuelle,
      sort_by: "popularity.desc",
    },
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MTlhYjU3ZmMzOTZlMzlhZWQzNGE0MDI4NzBmOTJkYSIsIm5iZiI6MTc0MTc1ODE3Mi4xMiwic3ViIjoiNjdkMTFlZGM2NDQ0Mzk4NGIxMWRmNGQ4Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.UtI6BWvO-8wG28olyeTvC4tUmih3U5nMNQdB5m0sKog",
    },
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
        const { data } = await axios.request(optionsFilms);
        setFilms(data.results);
        setTotalPages(data.total_pages);
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
          Liste des films disponibles{" "}
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
                    onClick={() =>
                      AddMovie(
                        film.id,
                        film.title,
                        film.genre_ids,
                        film.popularity,
                        film.release_date,
                        film.poster_path,
                        film.overview,
                      )
                    }
                    className="hover:cursor-pointer"
                  >
                    <PlusCircle fill="green" size={30} />
                  </button>
                </div>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${film.poster_path}`}
                  alt={film.title}
                  className="w-full h-60 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{film.title}</h3>
                  <p className="text-gray-500">
                    Popularités: {film.popularity}
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
            onClick={() => setPage(pageActuelle + 1)}
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