import { NextResponse } from 'next/server'
import { jwtDecode } from "jwt-decode";
import axios from "axios";


// This function can be marked `async` if using `await` inside
export  async function middleware(request) {
    let userRole = "095";

    console.log('running defence');
    const token = request.cookies.get('token');



    if(token){

        const optionsUser = {
            method: 'GET',
            url: 'https://myrottentomato.onrender.com/user/me',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${token.value}`
            }
        };
    
        const fetchUser = async () => {
            try {
                 const { data } = await axios.request(optionsUser);
                 userRole = await data.isAdmin    
                 console.log(data);
                 
            }catch(err){
                 console.log(err);
            }
        }
        
        
        await fetchUser();
    
        console.log(userRole);

        if(userRole == false && request.nextUrl.pathname.startsWith('/dashboard')){
            return NextResponse.redirect(new URL('/',request.url))
        }
    }
    

    if(!token){
        return NextResponse.redirect(new URL('/',request.url))
    }



    return NextResponse.next();
  }
   
  // See "Matching Paths" below to learn more
  export const config = {
    matcher: ['/updateProfil/:path*', '/dashboard/:path*'],
  }