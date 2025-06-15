import React, { useContext,useState,useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { UserContext } from "../UserContext";

const Header2 = () => {

  const navigate = useNavigate();
  const loggedData = useContext(UserContext);

    const [planName, setPlanName] = useState("");
    const [planColor, setPlanColor] = useState("");
  
    useEffect(() => {
      const storedPlanName = localStorage.getItem("planName");
      console.log("Stored Plan Name:", storedPlanName);
      
      const storedPlanColor = localStorage.getItem("planColor");
      console.log("Stored Plan Color:", storedPlanColor);
      
      if (storedPlanName) setPlanName(storedPlanName);
      if (storedPlanColor) setPlanColor(storedPlanColor);
    }, []);


  // function to handle Logout
  function handleLogout()
  {
      localStorage.removeItem("pixybox-user");
      loggedData.setLoggedUser(null);

      sessionStorage.setItem("loggedOut", "true");
      // navigate('/login?loggedOut=true');
      navigate('/login');
  }


  return (

    <header className="text-gray-400 w-full h-auto fixed top-0 z-20 py-3 bg-[#060d17] body-font border-b-2 border-red-500">
      <div className="container mx-auto gap-3 flex flex-wrap p-2 flex-col sm:flex-row sm:justify-around items-center">
        <a className="flex title-font font-medium items-center text-white md:mb-0">
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-red-500 rounded-full" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg> */}
            <span className="ml-3 text-red-500 font-bold text-2xl cursor-pointer"><a href="/home">PixyBox</a></span>
        </a>
        

        <nav id="navbar" className="md:mx-auto gap-2 sm:gap-4 flex flex-wrap font-mono items-center text-base sm:text-lg 2xl:text-xl justify-center">
            <NavLink 
                to="/home"
                className={({ isActive }) => 
                  isActive ? 'mx-2 text-white cursor-pointer w-auto' : 'mx-2 hover:text-white cursor-pointer w-auto'
                }
              >Home</NavLink>
            <NavLink 
                to="/about"
                className={({ isActive }) => 
                  isActive ? 'mx-2 text-white cursor-pointer w-auto' : 'mx-2 hover:text-white cursor-pointer w-auto'
                }
              >About</NavLink>
            <NavLink 
                to="/reviews"
                className={({ isActive }) => 
                  isActive ? 'mx-2 text-white cursor-pointer w-auto' : 'mx-2 hover:text-white cursor-pointer w-auto'
                }
              >Reviews</NavLink>
                              {/* Show plan name if exists */}
            {planName && (
              <div
                className={`text-white px-4 py-1 rounded-lg font-semibold text-sm bg-gradient-to-r ${planColor}`}
              >
                Plan: {planName}
              </div>
            )}
        </nav>

        <button id="logout" onClick={handleLogout} className="inline-flex text-white font-mono items-center bg-red-600 border-2 border-red-600 py-1 px-3 md:py-2 md:px-5 focus:outline-none hover:bg-red-700 hover:border-red-700 rounded text-base  md:mt-0 active:bg-red-700 active:border-red-700">
        Logout
        </button>
             
      </div>
    </header>
  );
};

export default Header2;
