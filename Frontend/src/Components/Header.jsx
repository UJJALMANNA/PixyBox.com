import React from "react";

const Header = () => {


  return (

    <header className="text-gray-400 w-full h-auto fixed top-0 z-10 py-3 bg-[#060d17] body-font border-b-2 border-red-500">

      <div className="container mx-auto gap-3 flex flex-wrap p-2 flex-col sm:flex-row items-center">
        <a className="flex title-font font-medium items-center text-white md:mb-0">
          {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-red-500 rounded-full" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg> */}
          <span className="ml-3 text-red-500 font-bold text-2xl cursor-pointer"><a href="/home">PixyBox</a></span>
        </a>

      </div>
    </header>
  );
};

export default Header;
