"use client";

import { useState } from "react";
import { Home, Film, List, Users, BarChart, User, LogOut } from "lucide-react";
import FilmsPage from "./films";
import SelectionPage from "./selections";
import { useRouter } from "next/navigation";
import UtilisateursPage from "./utilisateurs";
import StatistiquePage from "./statistiques";
import UpdatePage from "./updatePage";
import Cookies from "js-cookie";


const menuItems = [
  { name: "Films", icon: Film, key: "films" },
  { name: "Sélections", icon: List, key: "selections" },
  { name: "Utilisateurs", icon: Users, key: "users" },
  { name: "Statistiques", icon: BarChart, key: "stats" },
  { name: "Profil", icon: User, key: "profil" },
];

const sections = {
  films: <FilmsPage />,
  selections: <SelectionPage />,
  users: <UtilisateursPage />,
  stats: <StatistiquePage />,
  profil: <UpdatePage />,
};

export default function Dashboard() {
  const [active, setActive] = useState("films");
  const router = useRouter();

  const removeToken = () => {
    localStorage.removeItem("token");
    Cookies.remove("token");
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4 flex flex-col">
        <h1 className="text-xl font-bold text-center mb-10">PANEL ADMIN</h1>
        <nav className="flex-1">
          <ul>
            <li>
              <button
                onClick={() => router.push("/")}
                className="flex items-center p-3 mb-2 w-full text-left rounded-lg text-gray-700 hover:bg-gray-200"
              >
                <Home className="w-5 h-5 mr-3" />
                Acceuil
              </button>
            </li>
            {menuItems.map((item) => (
              <li key={item.key}>
                <button
                  className={`flex items-center p-3 mb-2 w-full text-left rounded-lg transition-colors ${
                    active === item.key
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActive(item.key)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={removeToken}
                className="flex items-center p-3 mb-2 w-full text-left rounded-lg text-gray-700 hover:bg-gray-200"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Déconnexion
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-3 ">{sections[active]}</div>
    </div>
  );
}