/* eslint-disable @next/next/no-img-element */
"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function Acceuil() {
  const [films, setFilms] = useState([]);
  const [user, setUser] = useState({});
  const [movie, setMovie] = useState({});
  const token = localStorage.getItem("token");
  const router = useRouter();
  const params = useParams();
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user_id, setUser_id] = useState("");
  const [movie_id, setMovie_id] = useState("");
  const [commentaire, setCommentaire] = useState([]);

  const optionsFilms = {
    method: "GET",
    url: "http://localhost:5000/movie",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const optionsUser = {
    method: "GET",
    url: "http://localhost:5000/user/me",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const optionsComment = {
    method: "GET",
    url: "http://localhost:5000/comment",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const get_user = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get("http://localhost:5000/user/me", {
        headers,
      });
      setUser_id(response.data._id);
      console.log(response);
    }
  };

  const get_movie = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(
        "http://localhost:5000/movie/" + params.id,
        { headers }
      );
      setMovie_id(response.data._id);
      console.log(response);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const commentaire = {
      user_id: user_id,
      movie_id: movie_id,
      comment: comment,
    };

    try {
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.post(
        "http://localhost:5000/comment",
        commentaire,
        { headers }
      );
      toast.success(response.data.message);
      console.log(response.data);
    } catch (error) {
      setError(error.response.data.message);
      toast.error(error.response.data.message);
      console.log(error.response.data.message);
    } finally {
      setIsLoading(false); // Set loading to false when the request completes
    }
  };

  const DeleteComment = async (id) => {
    try {
      const { data } = await axios.delete(
        `http://localhost5000/comment/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      console.log(data);

      setCommentaire(commentaire.filter((film) => film._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error.response?.data.message);
    }
  };

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const { data } = await axios.request(optionsFilms);
        setFilms(data);
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

    const fetchMovie = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/movie/` + params.id,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMovie(data);
        toast.success(data.message);
        console.log(data);
      } catch (error) {
        toast.error(error.response?.data?.message);
        console.log(error.response?.data.message);
      }
    };

    const fetchComment = async () => {
      try {
        const { data } = await axios.request(optionsComment);
        setCommentaire(data);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };

    const interval = setInterval(() => {
        fetchComment()
    }, 5000)
    

    fetchFilms();
    fetchUser();
    fetchMovie();
    get_user();
    get_movie();
    fetchComment();
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="md:flex items-start justify-center py-12 2xl:px-20 md:px-6 px-4">
        <div className="xl:w-2/6 lg:w-2/5 w-80 md:block hidden">
          <img
            className="w-full"
            alt="image of a girl posing"
            src={`https://image.tmdb.org/t/p/w500/${movie.image}`}
          />
          {/* <img className="mt-6 w-full" alt="image of a girl posing" src="https://i.ibb.co/qxkRXSq/component-image-two.png" /> */}
        </div>
        <div className="md:hidden">
          <img
            className="w-full"
            alt="image of a girl posing"
            src={`https://image.tmdb.org/t/p/w500/${movie.image}`}
          />
        </div>
        <div className="xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6">
          <div className="border-b border-gray-200 pb-6">
            {/* <p className="text-sm leading-none text-gray-600 dark:text-gray-300 ">Balenciaga Fall Collection</p> */}
            <h1 className="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 dark:text-white mt-2">
              {movie.title}
            </h1>
          </div>
          <div>
            <p className="xl:pr-48 text-base lg:leading-tight leading-normal text-gray-600 dark:text-gray-300 mt-7">
              {movie.description}
            </p>
            {/* <p className="text-base leading-4 mt-7 text-gray-600 dark:text-gray-300">Product Code: 8BN321AF2IF0NYA</p> */}
            <p className="text-base leading-4 mt-4 text-gray-600 dark:text-gray-300">
              <span className="font-bold">Date de sortie:</span>{" "}
              {movie.dateDesortie}
            </p>
            <p className="text-base leading-4 mt-4 text-gray-600 dark:text-gray-300">
              <span className="font-bold">Popularité du film:</span>{" "}
              {movie.popularite}
            </p>
            {/* <p className="text-base leading-4 mt-4 text-gray-600 dark:text-gray-300">Depth: 5.1 inches</p>
                        <p className="md:w-96 text-base leading-normal text-gray-600 dark:text-gray-300 mt-4">Composition: 100% calf leather, inside: 100% lamb leather</p> */}
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col mt-5 max-w-xl">
                <label
                  className="mb-2 font-bold text-lg text-gray-900"
                  htmlFor="comment"
                >
                  Leave a Comment:
                </label>
                <textarea
                  onChange={(event) => setComment(event.target.value)}
                  rows="4"
                  className="mb-4 px-3 py-2 border-2 border-gray-300 rounded-lg"
                  id="comment"
                  name="comment"
                ></textarea>
                <div className="flex gap-5">
                  <div className="">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded max-w-[120px]">
                      {isLoading ? "Loading..." : "Commenter"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <div className="my-5">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded max-w-[120px]"
                onClick={() => {
                  router.push("/");
                }}
              >
                Retour
              </button>
            </div>
          </div>

          {/* <div  className="overflow-hidden rounded-2xl border border-gray-200 transition-all duration-300 hover:scale-[102%]">
                                <h1>jhfdihgfhjidf</h1>                            
                            </div> */}
          {commentaire.map((comm, index) => (
            <div
              key={index}
              className="overflow-hidden p-4 my-2 rounded-2xl border border-gray-200 transition-all duration-300 hover:scale-[102%]"
            >
              <div className="flex justify-between">
                <div className="absolute top-3 right-3  text-gray-200  w-6 h-6 text-center">
                  <button
                    onClick={() => DeleteComment(comm._id)}
                    className="hover:cursor-pointer"
                  >
                    <svg
                      class="h-4 w-4 text-red-600"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      {" "}
                      <path stroke="none" d="M0 0h24v24H0z" />{" "}
                      <line x1="4" y1="7" x2="20" y2="7" />{" "}
                      <line x1="10" y1="11" x2="10" y2="17" />{" "}
                      <line x1="14" y1="11" x2="14" y2="17" />{" "}
                      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />{" "}
                      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                    </svg>
                  </button>
                </div>
                <p className="flex flex-wrap">{comm.comment}</p>
                {/* <p>{comm.created_at}</p> */}
              </div>
            </div>
          ))}
          <ToastContainer />
        </div>
      </div>
    </>
  );
}