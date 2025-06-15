import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import Header from "./Header";

const Login = () => {

  const loggedData = useContext(UserContext);
  const {setLoginSuccess} = loggedData;
  
  const [userCred, setUserCred] = useState({
    email:"",
    password:""
  })
  
  const navigate = useNavigate();
  
  // putting some dummy message
  const [message, setMessage] = useState({
    type:"invisible-msg",
    text:""
  })
  

  // THIS IS TO CHECK WHETHER WE ARE ARRIVING ON THE LOGIN PAGE AFTER LOGGING OUT OR NOT

  /* const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const loggedOut = queryParams.get('loggedOut'); */
  
  
  useEffect(()=>{
      const loggedOut = sessionStorage.getItem("loggedOut");
      if(loggedOut)
      {
          setMessage({type:"logged out", text:"Logged out ! Please login to continue."});

          // making the message invisible again after 3 seconds
          setTimeout(()=>{
              setMessage({type:"invisible-msg", text:""});
          }, 3000)

          // queryParams.set('loggedOut','false');
          sessionStorage.removeItem("loggedOut");          
      }

  },[])



  // Handle change in input fields
  function handleInput(event)
  {
      // console.log(event.target.name, event.target.value);

      setUserCred((prev)=>{
          return {...prev, [event.target.name] : event.target.value}
      })
  }


  function handleSubmit(event)
  {
    // this will prevent the deafult behaviour of the component, which is re-rendering
    event.preventDefault();

    fetch(`${import.meta.env.VITE_REACT_APP}/login`, {

      method:"POST",
      body: JSON.stringify(userCred),
      // always send header while sending POST requests
      headers:{
          "Content-Type":"application/json"
      }
    })
    .then((res)=>{
        console.log(res);

        if(res.status===404)
        {
          setMessage({type:"not found", text:"User not found !"});
        }
        else if(res.status===401)
        {
          setMessage({type:"wrong pass", text:"Incorrect password !"});
        }

        // making the message invisible again after 8 seconds
        setTimeout(()=>{
          setMessage({type:"invisible-msg", text:""});
        }, 3000)

        return res.json();
    })

    .then((data)=>{
        console.log("The data we are getting -->");
        console.log(data);
        // This "then" gets called everytime but we want to perform some operation only if we get the token

        if(data.token !== undefined)
        {
          setMessage({ type: "success", text: data.message })

          // Store success message in context
          setLoginSuccess(data.message);

          // storing the token in our local storage
          localStorage.setItem("pixybox-user", JSON.stringify(data));

          // storing the data in the context variable
          loggedData.setLoggedUser(data);
          console.log(loggedData);

          setMessage({type:"invisible-msg", text:""});
      
          // automatically navigate to a different page
          navigate('/home');
        }

    })
    .catch((err)=>{
      console.log(err);
      setMessage({ type: "failure", text: err.message });

      // making the message invisible again after 8 seconds
      setTimeout(() => {
          setMessage({ type: "invisible-msg", text: "" });
      }, 3000)

    })
  }



  return (

    <>
        <Header/>

        <section className="bg-gray-900 body-font relative sm:mt-4">
            <div className="container px-5 py-6 sm:py-6 mx-auto">
                <div className="flex flex-col text-center w-full mb-10">
                    <h1 className="md:text-2xl text-xl font-medium title-font font-mono text-white">Your next favourite movie is waiting — log in now!</h1>
                </div>

                <div className="lg:w-1/2 md:w-2/3 mx-auto">
                    <form onSubmit={handleSubmit} className="flex flex-col items-center sm:flex-wrap -m-2 sm:flex-row">

                        <div className="p-2 w-5/6 sm:w-1/2">
                            <div className="relative">
                                <label className="leading-7 text-sm text-gray-400">Enter your Email</label>
                                <input required onChange={handleInput} type="email" value={userCred.email} name="email" className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-500 focus:border-red-500 focus:bg-gray-900 focus:ring-2 focus:ring-red-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
                            </div>
                        </div>

                        <div className="p-2 w-5/6 sm:w-1/2">
                            <div className="relative">
                                <label className="leading-7 text-sm text-gray-400">Enter your Password</label>
                                <input required onChange={handleInput} type="password" value={userCred.password} name="password" className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-500 focus:border-red-500 focus:bg-gray-900 focus:ring-2 focus:ring-red-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
                            </div>
                        </div>

                        <div className="p-2 mt-4 w-full font-mono">
                            <button className="flex mx-auto bg-red-600 text-white border-red-600 border-2 py-2 px-6 focus:outline-none hover:bg-red-700 hover:border-red-700 rounded text-lg active:bg-red-700 active:border-red-700">Login</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* <div className="p-2 w-full pt-4 border-t border-gray-800 text-center"></div> */}
            <p className='text-white text-lg pb-10 w-auto text-center font-mono font-semibold'>New User ? <Link className='text-red-500 text-xl' to={"/register"}>Register</Link></p>


            <div id="alert-msg" className="flex sticky h-28 items-center justify-center bg-gray-900">

                {message.type === "wrong pass" && (
                  <div className="flex w-5/6 sm:w-4/6 lg:w-3/6 xl:[600px] rounded-lg items-center p-4 mb-4 text-yellow-800 border-t-4 border-yellow-300 bg-yellow-50 dark:text-yellow-800 dark:bg-yellow-100 dark:border-yellow-500" role="alert">
                    <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <div className="ms-3 text-sm font-medium">{message.text}</div>
                  </div>
                )}

                {message.type === "not found" && (
                  <div className="flex w-5/6 sm:w-4/6 lg:w-3/6 xl:[600px] rounded-lg items-center p-4 mb-4 text-yellow-800 border-t-4 border-yellow-300 bg-yellow-50 dark:text-yellow-800 dark:bg-yellow-100 dark:border-yellow-500" role="alert">
                    <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <div className="ms-3 text-sm font-medium">{message.text}</div>
                  </div>
                )}

                {message.type === "failure" && (
                    <div className="flex w-5/6 sm:w-4/6 lg:w-3/6 xl:[600px] rounded-lg items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-800 dark:bg-red-100 dark:border-red-500" role="alert">
                      <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                      </svg>
                      <div className="ms-3 text-sm font-medium">{message.text}</div>
                    </div>
                )}

                {message.type === "logged out" && (
                    <div className="flex w-5/6 sm:w-4/6 lg:w-3/6 xl:[600px] rounded-lg items-center p-4 mb-4 text-gray-800 border-t-4 border-gray-300 bg-gray-50 dark:text-gray-800 dark:bg-gray-100 dark:border-gray-500" role="alert">
                      <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                      </svg>
                      <div className="ms-3 text-sm font-medium">{message.text}</div>
                    </div>
                )}

            </div>
        </section>

    </>
    
  );
};

export default Login;
