/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import axios from "axios";
import { FolderHeart, Heart } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState(null);//ici
  const [films, setFilms] = useState([]);
  const [userFavoris, setUserFilms] = useState([]);
  const [user, setUser] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [pageActuelle, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {//ici
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const getFilmbyID = (id) => {
    router.push(`/detail/${id}`);
  };
  console.log(films);//ici

  const removeToken = () => {
    localStorage.removeItem("token");
    Cookies.remove("token");
    router.push("/");
  };

  const optionsFilms = {
    method: "GET",
    url: "https://myrottentomato.onrender.com/movie",
    headers: {
      accept: "application/json",
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

  const fetchUser = async () => {
    try {
      const { data } = await axios.request(optionsUser);
      setUser(data);
      setUserFilms(data.favoris);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const { data } = await axios({
          method: "GET",
          url: `https://myrottentomato.onrender.com/movie`,//ici pble
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

    fetchFilms();
    fetchUser();
  }, [pageActuelle]);

  const AddFavori = async (id, title, image) => {
    const film = [id, title, image];

    console.log(film);

    try {
      const { data } = await axios({
        method: "POST",
        url: `https://myrottentomato.onrender.com/user/${user._id}`,
        data: {
          favori: film,
        },
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data);
      await fetchUser();
      toast.success(data.message);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteFavori = async (favori) => {
    console.log(favori);

    try {
      const { data } = await axios.put(
        `https://myrottentomato.onrender.com/user/favori/${user._id}`,
        {
          favori: favori,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      await fetchUser();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <>
      <header className="bg-gray-950 text-white shadow-lg py-4 sticky top-0 z-50 flex justify-between px-6 border-b border-gray-800">
        <div className="container mx-auto flex items-center justify-between px-4">
          <a
            href="#"
            className="flex items-center text-primary hover:text-secondary"
          >
            <svg
              className="h-8 w-8 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            ></svg>
            <span className="text-2xl font-bold">WSC2</span>
          </a>
        </div>
        <div className="flex gap-3 mx-10">
          {token ? (
            <>
              <a
                className="inline-flex items-center justify-center rounded-xl bg-white  px-3 py-2 text-sm font-semibold text-black shadow-sm transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                href=""
                onClick={() => router.push("/updateProfil")}
              >
                Profile
              </a>

              {user.isAdmin && (
                <>
                  <a
                    className="px-4 hover:border-b-1 border-gray-500 border-opacity-0 hover:border-opacity-100 hover:text-blue-500 duration-200 cursor-pointer"
                    href=""
                    onClick={() => router.push("/dashboard")}
                  >
                    Dashboard
                  </a>
                </>
              )}
              <a
                className="inline-flex items-center justify-center rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                href=""
                onClick={removeToken}
              >
                Déconnexion
              </a>
            </>
          ) : (
            <>
              <a
                className="hidden items-center justify-center rounded-xl bg-white px-5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex"
                href=""
                onClick={() => router.push("/inscription")}
              >
                Sign in
              </a>

              <a
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                href=""
                onClick={() => router.push("/connexion")}
              >
                Login
              </a>
            </>
          )}
        </div>
      </header>

      <div
        className="relative bg-gray-900 text-white"
        style={{
          backgroundImage: `url('/bgWs2.jpg')`,
          height: "672px",
        }}
      >
        <div className="absolute z-2 w-full flex flex-col gap-8 lg:flex-row justify-center  my-60">
          <div className="lg:w-1/2">
            <h1 className="text-7xl font-semibold leading-tight mb-4 mx-20">
              Welcome to WSC2
            </h1>
          </div>
        </div>
        <div className="overflow-auto bg-black h-full opacity-75"></div>
      </div>
      <div className="mx-auto max-w-7xl bg-white p-5">
        <div className="flex justify-between">
          <h1 className="text-3xl text-center m-10 font-semibold  text-gray-900">
            Tous nos films
          </h1>
          {token && (
            <>
              <div
                className="flex gap-2 m-10 font-semibold hover:cursor-pointer"
                onClick={() => setOpenModal(true)}
              >
                <FolderHeart
                  size={25}
                  color="#000000"
                  strokeWidth={2}
                  absoluteStrokeWidth
                />
                <span  className="text-gray-900">Mes favoris</span>
              </div>
            </>
          )}
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {films.map((film, index) => (
            <article
              key={index}
              className="overflow-hidden rounded-2xl border border-gray-200 transition-all duration-300 hover:scale-[102%]"
            >
              <div className="absolute top-3 right-3  text-gray-200  w-6 h-6 text-center">
                {userFavoris.includes(film.title) == false && (
                  <button
                    className="hover:cursor-pointer"
                    onClick={() => AddFavori(film._id, film.title, film.image)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="w-7 h-7 text-red-500 "
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <img
                src={`https://image.tmdb.org/t/p/w500/${film.image}`}
                className="h-auto w-full object-cover"
                alt={film.title}
              />
              <div className="p-5 ">
                <h2 className="text-2xl text-gray-900">{film.title}</h2>
                <p className="line-clamp-3 text-black">Popularités: {film.popularite}</p>
                <a
                  className="text-blue-700 "
                  href=""
                  onClick={() => getFilmbyID(film._id)}
                >
                  voir +
                </a>
              </div>
            </article>
          ))}
        </div>
        {openModal && (
          <>
            <div
              id="modal"
              className="fixed inset-0 z-50 flex items-center justify-center"
            >
              <div className="fixed inset-0 bg-black/50" />
              <div className="relative w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 ">
                    Mes favoris
                  </h3>
                  <button
                    id="closeModalButton"
                    onClick={() => setOpenModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg
                      className="h-6 w-6 inline-block ml-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  {userFavoris.length < 1 && (
                    <span className="text-gray-400 text-xl">Aucun favori</span>
                  )}
                  <div className="flex flex-col md:grid md:grid-cols-5 gap-3">
                    {userFavoris.map((favori, index) => (
                      <>
                        <div
                          className="group cursor-pointer relative"
                          onClick={() => deleteFavori(index)}
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/w500/${favori[2]}`}
                            alt={favori[1]}
                            className="w-30 object-cover rounded-lg transition-transform transform scale-100 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 flex bg-black items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-white font-semibold px-4 py-2 rounded-lg  transition-colors">
                              {favori[1]}
                            </button>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

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
      </div>

      <footer className="bg-gradient-to-br from-black via-gray-800 to-gray-900 text-gray-300 py-10 mt-10">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
          <div className="text-center md:text-left w-full md:w-1/3 pr-10">
            <h2 className="text-2xl font-bold text-white">WSC</h2>
            <p className="mt-2 text-gray-100">
              Creating stunning web experiences with modern design principles.
            </p>
          </div>

          <div className="w-full md:w-1/3 flex flex-col items-center md:items-start space-y-3">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <a href="#" className="hover:text-white transition duration-300">
              About Us
            </a>
            <a href="#" className="hover:text-white transition duration-300">
              Contact
            </a>
          </div>

          <div className="w-full md:w-1/3 flex justify-center md:justify-end space-x-4">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition duration-300 transform hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 12a10 10 0 10-11 9.95V14.9h-3v-3h3v-2.2c0-3 1.8-4.6 4.4-4.6 1.3 0 2.6.2 2.6.2v3h-1.5c-1.5 0-2 .9-2 1.8V12h3.4l-.5 3H15v7.05A10 10 0 0022 12z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition duration-300 transform hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.4 4.6c-.8.4-1.7.6-2.6.8.9-.6 1.6-1.4 1.9-2.5-.9.5-1.8.9-2.8 1.1-.8-.9-2-1.4-3.2-1.4-2.4 0-4.3 2-4.3 4.4 0 .3 0 .7.1 1C7.1 7.8 4.2 6.2 2.2 3.8c-.4.6-.6 1.4-.6 2.2 0 1.5.7 2.8 1.8 3.6-.7 0-1.4-.2-2-.5v.1c0 2.1 1.5 3.8 3.4 4.2-.4.1-.7.2-1.1.2-.3 0-.5 0-.8-.1.5 1.6 2 2.8 3.7 2.8-1.4 1.1-3.1 1.7-5 1.7-.3 0-.6 0-.8-.1 1.8 1.2 3.9 1.9 6.2 1.9 7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2.1-2.2z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition duration-300 transform hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.2c-5.4 0-9.8 4.4-9.8 9.8 0 4.9 3.6 8.9 8.3 9.7V14.9H7.9V12h2.6V9.8c0-2.6 1.6-4 3.9-4 1.1 0 2 .1 2.3.1v2.7h-1.6c-1.3 0-1.6.6-1.6 1.5V12h3.2l-.5 2.9H13v6.8c4.7-.8 8.3-4.8 8.3-9.7 0-5.4-4.4-9.8-9.8-9.8z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="text-center text-gray-100 text-sm mt-8">
          &copy; 2024 WSC. All rights reserved.
        </div>
      </footer>

      <ToastContainer />
    </>
  );
}