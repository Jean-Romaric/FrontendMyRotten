"use client";

import { UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function UtilisateursPage() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem( "token");
  const [modalOpen, setModalOpen] = useState(false);
  
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    isAdmin: "false",
  });

  const AddUser = async (e) => {
    e.preventDefault();

    console.log(values);
    
    if (!values.username) {
      toast.error("Entrez un username!");
      return;
    }

    if (!values.email) {
      toast.error("Entrez une addresse mail!");
      return;
    }

    if (!values.email) {
      toast.error("Entrez un mot de passe!");
      return;
    }

    const optionsADD = {
      method: "POST",
      url: `http://localhost:5000/user/register`,
      data: {
        ...values,
      },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.request(optionsADD);
      await fetchUsers();
      toast.success(data.message);
      console.log(data);
      setModalOpen(false)
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

  const DeleteUser = async (id) => {
    const optionsDelete = {
      method: "DELETE",
      url: `http://localhost:5000/user/${id}`,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.request(optionsDelete);
      await fetchUsers();
      toast.success(data.message);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const optionsUsers = {
    method: "GET",
    url: "http://localhost:5000/user/",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="h-full flex flex-col p-6">
        <h2 className="mb-10 text-gray-700 font-semibold text-2xl">
          Liste des utilisateurs
        </h2>
        <div className="flex justify-end mx-7">
          <UserPlus
            className="bg-green-500 p-2 rounded-3xl hover:cursor-pointer shadow-md"
            size={40}
            color="#ffffff"
            strokeWidth={3}
            absoluteStrokeWidth
            onClick={() => setModalOpen(true)}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* component */}
          <div className="px-7 py-4 flex justify-center">
            <table className="mt-5 w-full text-md bg-white shadow-lg rounded mb-4">
              <tbody>
                <tr className="border-b">
                  <th className="text-left p-3 px-5">Username</th>
                  <th className="text-left p-3 px-5">Email</th>
                  <th className="text-left p-3 px-5">Password</th>
                  <th className="text-left p-3 px-5">Role</th>
                  <th />
                </tr>
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-b-2 border-gray-200 hover:bg-blue-100 bg-gray-100"
                  >
                    <td className="p-3 px-5">
                      <input
                        type="text"
                        value={user.username}
                        className="bg-transparent border-1 px-2 rounded-md border-gray-300 py-2"
                      />
                    </td>
                    <td className="p-3 px-5">
                      <input
                        type="text"
                        value={user.email}
                        className="bg-transparent border-1 px-2 rounded-md border-gray-300 py-2"
                      />
                    </td>
                    <td className="p-3 px-5">
                      <input
                        type="password"
                        placeholder="*******"
                        className="bg-transparent border-1 px-2 rounded-md border-gray-300 py-2"
                      />
                    </td>
                    <td className="p-3 px-5">
                      <select className="bg-transparent  border-gray-300 py-2">
                        <option value={user.isAdmin}>
                          {user.isAdmin ? "Admin" : "Utilisateur"}
                        </option>
                        {user.isAdmin && (
                          <option value="false">Utilisateur</option>
                        )}
                        {!user.isAdmin && <option value="true">Admin</option>}
                      </select>
                    </td>
                    <td className="p-3 px-5 flex justify-end">
                      <button
                        type="button"
                        className="mr-3 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => DeleteUser(user._id)}
                        className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {modalOpen && (
          <>
            <div className="fixed inset-0 z-40 min-h-full overflow-y-auto overflow-x-hidden transition flex items-center">
              {/* overlay */}
              <div
                aria-hidden="true"
                className="fixed inset-0 w-full h-full bg-black/50 cursor-pointer"
              ></div>
              {/* Modal */}
              <div className="relative w-full cursor-pointer pointer-events-none transition my-auto p-4">
                <div className="w-full py-2 bg-white cursor-default pointer-events-auto dark:bg-gray-800 relative rounded-xl mx-auto max-w-sm">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="absolute top-2 right-2 rtl:right-auto rtl:left-2"
                  >
                    <svg
                      xlinktitle="Close"
                      className="h-4 w-4 hover:rotate-180 transition-all ease-in-out duration-500 cursor-pointer text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillrule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        cliprule="evenodd"
                      />
                    </svg>
                    <span className="sr-only">Close</span>
                  </button>
                  <div className="space-y-2 p-2">
                    <div className="p-2 space-y-2 text-center dark:text-white">
                      <h2
                        className="text-xl font-bold tracking-tight"
                        id="page-action.heading"
                      >
                        Nouveau Utilisateur
                      </h2>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div
                      aria-hidden="true"
                      className="border-t border-gray-300 px-2"
                    />
                    <div className="grid grid-cols-1 place-items-center px-4 py-2">
                      <form className="space-y-4">
                        <div>
                          <label
                            htmlfor="Full Name"
                            className="mb-2 text-gray-400 text-md"
                          >
                            Username
                            <span className="text-red-600 inline-block p-1 text-sm">
                              *
                            </span>
                          </label>
                          <input
                            name="username"
                            onChange={(e) =>
                              setValues({
                                ...values,
                                [e.target.name]: e.target.value,
                              })
                            }
                            className="border p-3 shadow-sm  border-gray-300 placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                            type="text"
                            placeholder="Username"
                            required=""
                          />
                        </div>
                        <div>
                          <label
                            htmlfor="email"
                            className="mb-2 text-gray-400 text-md"
                          >
                            Email
                            <span className="text-red-600 inline-block p-1 text-sm">
                              *
                            </span>
                          </label>
                          <input
                            name="email"
                            onChange={(e) =>
                              setValues({
                                ...values,
                                [e.target.name]: e.target.value,
                              })
                            }
                            className="border p-3  shadow-sm  border-gray-300 placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                            type="email"
                            placeholder="Email"
                            required=""
                          />
                        </div>
                        <div>
                          <label
                            htmlfor="subject"
                            className="mb-2 text-gray-400 text-md"
                          >
                            Password
                            <span className="text-red-600 inline-block p-1 text-sm">
                              *
                            </span>
                          </label>
                          <input
                            name="password"
                            onChange={(e) =>
                              setValues({
                                ...values,
                                [e.target.name]: e.target.value,
                              })
                            }
                            className="border p-3  shadow-sm  border-gray-300 placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                            type="password"
                            placeholder="*******"
                            required=""
                          />
                        </div>
                        <div>
                          <label
                            htmlfor="email"
                            className="mb-2 text-gray-400 text-md"
                          >
                            confirm password
                            <span className="text-red-600 inline-block p-1 text-sm">
                              *
                            </span>
                          </label>
                          <input
                            name="confirm_password"
                            onChange={(e) =>
                              setValues({
                                ...values,
                                [e.target.name]: e.target.value,
                              })
                            }
                            className="border p-3  shadow-sm  border-gray-300 placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                            type="password"
                            placeholder="********"
                            required=""
                          />
                        </div>
                        <div>
                          <label
                            htmlfor="role"
                            className="mb-2 text-gray-400 text-md"
                          >
                            Rôle
                            <span className="text-red-600 st inline-block p-1 text-sm">
                              *
                            </span>
                          </label>
                          <select
                            name="isAdmin"
                            className="p-3 border-b-2 border-gray-300 placeholder:text-base focus:outline-none ease-in-out duration-300 w-full"
                            onChange={(e) =>
                              setValues({
                                ...values,
                                [e.target.name]: e.target.value,
                              })
                            }
                          >
                            <option value="false">Utilisateur</option>
                            <option value="true">Administrateur</option>
                          </select>
                        </div>
                      </form>
                    </div>
                    <div
                      aria-hidden="true"
                      className="border-b border-gray-300 mt-5 px-2"
                    />
                    <div className="px-6 py-2">
                      <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
                        <button
                          type="button"
                          onClick={() => setModalOpen(false)}
                          className="font-semibold inline-flex items-center justify-center py-1 gap-1 rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset dark:focus:ring-offset-0 min-h-[2.25rem] px-4 text-sm text-gray-800 bg-white border-gray-300 hover:bg-gray-200 hover:cursor-pointer focus:ring-primary-600 focus:text-primary-600 focus:bg-primary-50 focus:border-primary-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:text-gray-200 dark:focus:text-primary-400 dark:focus:border-primary-400 dark:focus:bg-gray-800"
                        >
                          Annuler
                        </button>
                        <button onClick={AddUser} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                          Envoyer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <ToastContainer position="top-right" />
      </div>
    </>
  );
}