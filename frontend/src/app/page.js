/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import axios from "axios";
import { FolderHeart } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [films, setFilms] = useState([]);
  const [userFavoris, setUserFilms] = useState([]);
  const [user, setUser] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [pageActuelle, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const getFilmbyID = (id) => {
    router.push(`/detail/${id}`);
  };

  const removeToken = () => {
    localStorage.removeItem("token");
    Cookies.remove("token");
    router.push("/");
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data);
      setUserFilms(data.favoris);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/movie");
        setFilms(data.movies);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFilms();
    fetchUser();
  }, [pageActuelle]);

  const AddFavori = async (id, title, image) => {
    try {
      const { data } = await axios.post(
        `http://localhost:5000/user/${user._id}`,
        { favori: [id, title, image] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchUser();
      toast.success(data.message);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteFavori = async (favori) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/user/favori/${user._id}`,
        { favori },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(data.message);
      await fetchUser();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="bg-gray-950 text-white shadow-lg py-4 sticky top-0 z-50 flex justify-between px-6 border-b border-gray-800">
        <span className="text-2xl font-bold text-indigo-400">WSC2</span>

        <div className="flex gap-4 items-center">
          {token ? (
            <>
              <button onClick={() => router.push("/updateProfil")} className="hover:text-indigo-400 transition">
                Profile
              </button>

              {user.isAdmin && (
                <button onClick={() => router.push("/dashboard")} className="hover:text-indigo-400 transition">
                  Dashboard
                </button>
              )}

              <button onClick={removeToken} className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <button onClick={() => router.push("/inscription")} className="text-gray-300 hover:text-white">
                Sign in
              </button>
              <button onClick={() => router.push("/connexion")} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg">
                Login
              </button>
            </>
          )}
        </div>
      </header>

      {/* HERO */}
      <div className="relative h-[600px]" style={{ backgroundImage: `url('/bgWs2.jpg')` }}>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative flex items-center justify-center h-full">
          <h1 className="text-6xl font-bold text-white">
            Welcome to <span className="text-indigo-400">WSC2</span>
          </h1>
        </div>
      </div>

      {/* FILMS */}
      <div className="bg-gray-950 text-white p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold text-indigo-400">Tous nos films</h1>

          {token && (
            <div onClick={() => setOpenModal(true)} className="flex gap-2 cursor-pointer hover:text-indigo-400">
              <FolderHeart size={22} />
              Mes favoris
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {films.map((film, index) => (
            <div key={index} className="bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition border border-gray-800">

              <div className="absolute p-2">
                <button onClick={() => AddFavori(film._id, film.title, film.image)} className="text-red-500 text-xl">
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
              </div>

              <img src={`https://image.tmdb.org/t/p/w500/${film.image}`} className="h-72 w-full object-cover" />

              <div className="p-4">
                <h2 className="text-lg font-semibold">{film.title}</h2>
                <p className="text-gray-400 text-sm">Popularité: {film.popularite}</p>
                <button onClick={() => getFilmbyID(film._id)} className="text-indigo-400 mt-2">
                  Voir +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-4 mt-6">
          <button onClick={() => setPage(pageActuelle - 1)} className="bg-indigo-600 px-4 py-2 rounded">
            Précédent
          </button>
          <button onClick={() => setPage(pageActuelle + 1)} className="bg-indigo-600 px-4 py-2 rounded">
            Suivant
          </button>
        </div>
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="bg-gray-900 text-white p-6 rounded-xl">
            <h2 className="text-xl mb-4 text-indigo-400">Mes favoris</h2>

            {userFavoris.length === 0 && <p>Aucun favori</p>}

            {userFavoris.map((f, i) => (
              <div key={i} onClick={() => deleteFavori(i)} className="cursor-pointer">
                {f[1]}<button  className="mt-4 bg-red-500 px-3 py-1 rounded">Fermer</button>

              </div>
            ))}

            <button onClick={() => setOpenModal(false)} className="mt-4 bg-red-500 px-3 py-1 rounded">
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-gray-950 text-center text-gray-500 py-6 border-t border-gray-800">
        © 2025 fait par JeanAkpoue et ça Team.
      </footer>

      <ToastContainer />
    </>
  );
}