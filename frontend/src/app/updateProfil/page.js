"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie'


export default function UpdateProfil() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [old_password, setOldPassword] = useState('');
    const [new_password, setNewPassword] = useState('');
    const [error, setError] = useState(null);
    const [id, setId] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const token = localStorage.getItem('token') 

    

    const DeleteUser = async (id) => {
        console.log("cliqué");
        
        try {
            const { data } = await axios.delete(
               `http://localhost:3000/user/${id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                   Authorization: `Bearer ${token}` 
                },
              }
            );
  
            toast.success(data.message);
            console.log(data);
            localStorage.removeItem("token");
            Cookies.remove('token');
            router.push('/')

          } catch (error) {
            toast.error(error.response?.data?.message);
            console.log(error.response?.data.message);
          }
    }


    const get_user = async () => {
        if (token) {
          const headers = { Authorization: "Bearer " + token };
          const response = await axios.get("http://localhost:3000/user/me", { headers });
          setUsername(response.data.username)
          setEmail(response.data.email)
          setOldPassword(response.data.password)
          setId(response.data._id)
          console.log(response);
        }
    }

    useEffect(() => {
        get_user();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)

        const form  = {
            username: username,
            email: email,
            old_password: old_password,
            new_password: new_password,
          }

          try {
            const token = localStorage.getItem('token')
            if (token) {
                
                const headers = { Authorization: "Bearer " + token };
                const res = await axios.put(`http://localhost:3000/user/${id}`, form, {headers});
                console.log('Update successful:', res);
                if(res.data.message.includes("incorrect")){
                    return  toast.error(res.data.message, { autoClose: 6000 })
                }
                toast.success(res.data.message, { autoClose: 6000 })
                
                console.log(res);
                
              }

            
        } catch (error) {
            console.log(form)
            console.log(error.response.data.message)
            setError(error.response.data.message)
            toast.error(error.response.data.message, { autoClose: 6000 })
        } finally {
            setIsLoading(false)
        }
    };

  return (
    <div>
        <section className="py-10 mt-30 my-auto dark:bg-gray-900">
            <div className="lg:w-[80%] md:w-[90%] w-[96%] mx-auto flex gap-4">
                <div
                    className="lg:w-[88%] sm:w-[88%] w-full mx-auto shadow-md  p-4 rounded-xl h-fit self-center">
                    <div className="">
                        <div className="flex justify-between">
                            <h1
                                className="lg:text-3xl md:text-2xl text-xl font-serif font-extrabold mb-2 dark:text-white">
                                Mon profil
                            </h1>
                            <button onClick={() => router.push('/')} type="button" className="focus:outline-none text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Annuler</button>
                        </div>
                        {/* {error && <div style={{ color: 'red' }}>{error}</div>} */}
                        <form>
                            <div className="flex flex-col lg:flex-row gap-2 justify-center w-full">
                                <div className="w-full  mb-4 mt-6">
                                    <label htmlFor="username" className="mb-2 dark:text-gray-300">Username</label>
                                    <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" className="mt-2 p-2 w-full border-2 rounded-lg dark:text-gray-200 border-gray-200" placeholder="Username"></input>
                                </div>
                                <div className="w-full  mb-4 lg:mt-6">
                                    <label htmlFor="email" className=" dark:text-gray-300">Email</label>
                                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-2 p-2 w-full border-2 rounded-lg dark:text-gray-200 border-gray-200" placeholder="example@gmail.com"></input>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-2 justify-center w-full">
                                <div className="w-full  mb-4 lg:mt-6">
                                    <label htmlFor="old_password" className=" dark:text-gray-300">Old Password</label>
                                    <input value={old_password} onChange={(e) => setOldPassword(e.target.value)} type="password" className="mt-2 p-2 w-full border-2 rounded-lg dark:text-gray-200 border-gray-200" placeholder="*********"></input>
                                </div>

                                <div className="w-full  mb-4 lg:mt-6">
                                    <label htmlFor="new_password" className=" dark:text-gray-300">New Password</label>
                                    <input value={new_password} onChange={(e) => setNewPassword(e.target.value)} type="password" className="mt-2 p-2 w-full border-2 rounded-lg dark:text-gray-200 border-gray-200" placeholder="*********"></input>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <div className="rounded-lg bg-red-500 mt-4 text-white text-md font-semibold">
                                    <button onClick={() => DeleteUser(id)} type="button" className="w-full p-4 hover:cursor-pointer">{isLoading ? 'Loading...' : 'Supprimer mon compte'}</button>
                                </div>
                                <div className="rounded-lg bg-blue-500 mt-4 text-white text-md font-semibold">
                                    <button onClick={handleSubmit} type="submit" className="w-full p-4 hover:cursor-pointer">{isLoading ? 'Loading...' : 'Modifier'}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <ToastContainer />
                </div>
            </div>
        </section>      
    </div>
  )
}