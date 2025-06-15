import React from "react";
import { useState, useEffect } from "react";
import { Link} from "react-router-dom";
import Header from "./Header";

const Register = () => {
  const [countries, setCountries] = useState([]);
  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    country: ""
  });


  // putting some dummy message
  const [message, setMessage] = useState({
    type: "invisible-msg",
    text: "dummy",
  });


  // Fetching country data (including flags) from the API
  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch("https://restcountries.com/v3.1/all?fields=name,flags");
      const data = await response.json();
      setCountries(data);
    };
    fetchCountries();
  }, []);


  function handleInput(event) {
    // console.log(event.target.name, event.target.value);
    setUserDetail((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  }


  // Handle country change
  const handleCountryChange = (event) => {
    setUserDetail((prev) => {
      return { ...prev, country: event.target.value };
    });
  }


  function handleSubmit(event) {
    // this will prevent the deafult behaviour of the component, which is re-rendering
    event.preventDefault();
    console.log(userDetail);

    fetch("http://localhost:2020/register", {
      method: "POST",
      body: JSON.stringify(userDetail),

      // always send header while sending POST requests
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {

        if(data.message === "already registered")
        {
            setMessage({ type: "duplicate", text: "This email has already been registered." });
            // making the message invisible again after 8 seconds
            setTimeout(() => {
                setMessage({ type: "invisible-msg", text: "" });
            }, 3000);
        }

        else if(data.message === "successful registration")
        {
            setMessage({ type: "success", text: "Congratulations ! You have been registered successfully." });

            // setting the input fields blank after submitting
            setUserDetail({
              name: "",
              email: "",
              password: "",
              age: "",
              country:""
            });
    
            // making the message invisible again after 8 seconds
            setTimeout(() => {
                setMessage({ type: "invisible-msg", text: "" });
            }, 3000);
        }

      })
      .catch((err) => {
          setMessage({ type: "failure", text: err.message });

          // making the message invisible again after 8 seconds
          setTimeout(() => {
              setMessage({ type: "invisible-msg", text: "dummy" });
          }, 3000);

      })
  }


  return (

    <>
        <Header/>

        <section className="bg-gray-900 body-font -mt-6 relative md:mt-4">
            <div className="container px-5 py-1 sm:py-6 mx-auto">
                <div className="flex flex-col text-center w-full mb-10">
                    <h1 className="md:text-2xl text-xl font-medium title-font font-mono text-white">Join us and discover your next favourite movie!</h1>
                </div>

                <div className="lg:w-1/2 md:w-2/3 mx-auto">
                    <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center sm:flex-wrap -m-2 sm:flex-row">

                        <div className="p-2 w-5/6 sm:w-1/2">
                            <div className="relative">
                                <label className="leading-7 text-sm text-gray-400">Enter your Name</label>
                                <input required maxLength={20} onChange={handleInput} type="text" value={userDetail.name} name="name" className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-500 focus:border-red-500 focus:bg-gray-900 focus:ring-2 focus:ring-red-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
                            </div>
                        </div>
                        <div className="p-2 w-5/6 sm:w-1/2">
                            <div className="relative">
                                <label className="leading-7 text-sm text-gray-400">Enter your Email</label>
                                <input required onChange={handleInput} type="email" value={userDetail.email} name="email" className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-500 focus:border-red-500 focus:bg-gray-900 focus:ring-2 focus:ring-red-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
                            </div>
                        </div>

                        <div className="p-2 w-5/6 sm:w-1/2">
                            <div className="relative">
                                <label className="leading-7 text-sm text-gray-400">Enter your Password</label>
                                <input required minLength={6} onChange={handleInput} type="password" value={userDetail.password} name="password" className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-500 focus:border-red-500 focus:bg-gray-900 focus:ring-2 focus:ring-red-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
                            </div>
                        </div>
                        <div className="p-2 w-5/6 sm:w-1/2">
                            <div className="relative">
                                <label className="leading-7 text-sm text-gray-400">Enter your Age</label>
                                <input required min={12} max={100} onChange={handleInput} type="number" value={userDetail.age} name="age" className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-500 focus:border-red-500 focus:bg-gray-900 focus:ring-2 focus:ring-red-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
                            </div>
                        </div>


                        {/* Country Select */}
                        <div className="p-2 w-5/6 sm:w-1/2">
                          <div className="relative">
                            <label className="leading-7 text-sm text-gray-400">Select your Country</label>
                            <select required value={userDetail.country} onChange={handleCountryChange}
                              className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-500 focus:border-red-500 focus:bg-gray-900 focus:ring-2 focus:ring-red-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out h-11">

                              <option value="" disabled></option>
                              {countries.map((country) => (
                                <option key={country.name.common} value={country.name.common}>
                                  {country.name.common}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        

                        <div className="p-2 mt-4 w-full font-mono pb-6">
                            <button className="flex mx-auto bg-red-600 text-white border-red-600 border-2 py-2 px-6 focus:outline-none hover:bg-red-700 hover:border-red-700 rounded text-lg active:bg-red-700 active:border-red-700">Register</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* <div className="p-2 w-full pt-4 border-t border-gray-800 text-center"></div> */}
            <p className='text-white text-lg pb-10 w-auto text-center font-mono font-semibold'>Already Registered ? <Link className='text-red-500 text-xl' to={"/login"}>Login</Link></p>


            {/* Alert messages */}
            <div id="alert-msg" className="flex sticky h-28 items-center justify-center bg-gray-900">

                  {message.type === "success" && (
                    <div className="flex w-5/6 sm:w-4/6 lg:w-3/6 xl:[600px] rounded-lg items-center p-4 mb-4 text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-800 dark:bg-green-100 dark:border-green-500" role="alert">
                      <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                      </svg>
                      <div className="ms-3 text-sm font-medium">{message.text}</div>
                    </div>
                  )}

                  {message.type === "duplicate" && (
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

            </div>
        </section>

    </>
    
  );
};

export default Register;
