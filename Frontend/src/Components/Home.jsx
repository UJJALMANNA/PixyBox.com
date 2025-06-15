import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import Header2 from './Header2';
import SubscriptionPlans from './SubscriptionPlans';

const Home = () => {
  const { loginSuccess, setLoginSuccess } = useContext(UserContext);
  const [genres, setGenres] = useState();
  const [selectedGenre, setSelectedGenre] = useState('All'); // Track the selected genre

  const [movies, setMovies] = useState([]);
  const [activeTab, setActiveTab] = useState('Normal'); // Track the active tab (all or my)
  const [movieNames, setMovieNames] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(''); // Store selected movie


  // Fetch movies according to the genre
  const fetchMovies = async () => {
    try {
      if (selectedGenre === 'All') {
        const response = await fetch(`${import.meta.env.VITE_FLASK_APP}/movies/genres/all`, {method: "GET"});
        const data = await response.json();
        console.log(data)
        setMovies(data);
      }
      else {
        const response = await fetch(`${import.meta.env.VITE_FLASK_APP}/movies/genres/${selectedGenre}`, {method: "GET"});
        const data = await response.json();
        console.log(data)
        setMovies(data);
      }
      
    }
    catch (error) {
      console.log('Error fetching movies:', error);
    }
  };

  // Fetch the names of all the movies
  useEffect(()=>{
      const getMovieNames = async() =>{
          await fetch(`${import.meta.env.VITE_FLASK_APP}/movies/titles`, {method: "GET"})
          .then((res)=>res.json())
          .then((data)=>{
              setMovieNames(data);
          })
          .catch((err)=>{
              console.log(err)
          })
      }

      getMovieNames();
      fetchMovies();
  },[])



  useEffect(() => {
    setTimeout(() => {
      setLoginSuccess(null);
    }, 3000);
  }, []);


  // Get the list of all the genres
  useEffect(() => {
    const getGenres = async () => {
      await fetch(`${import.meta.env.VITE_FLASK_APP}/genres`, { method: 'GET' })
        .then((res) => res.json())
        .then((data) => {
          setGenres(data);
        })
        .catch((err) => console.log(err));
    };

    getGenres();
  }, []);


  // Handle genre selection
  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
  };

  // Fetch movies whenever the selected genre is changed
  useEffect(() => {
    fetchMovies();
  }, [selectedGenre]);


  // Handle tab switch
  const handleTabSwitch = (tab) => {
      setActiveTab(tab);
      if (tab === 'Normal')
      {
          setSelectedGenre('All');
          fetchMovies();
      }
      else {
        setMovies([]);
      }
  };


  // Handle movie recommendation click
  const handleRecommendClick = async(event) => {
    event.preventDefault();
    if (selectedMovie) {
        await fetch(`${import.meta.env.VITE_FLASK_APP}/recommend/${selectedMovie}`, {method: "GET"})
        .then((res)=>res.json())
        .then((data)=>{
          console.log(data)
            setMovies(data)
        })
        .catch((err)=>{
            console.log(err)
        })
    } 
    else {
      console.log('Please select a movie');
    }
  };



  return (
    <>
      <Header2 />

      <section className="mt-44 sm:mt-10">
        {loginSuccess && (
          <div id="alert-msg" className="flex sticky h-20 sm:h-16 items-center justify-center bg-gray-900">
            <div className="flex w-5/6 sm:w-4/6 lg:w-3/6 xl:[600px] rounded-lg items-center p-4 mb-4 text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-800 dark:bg-green-100 dark:border-green-500" role="alert">
              <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <div className="ms-3 text-sm font-medium">{loginSuccess}</div>
            </div>
          </div>
        )}

        <div className="container px-5 py-1 mx-auto">
            <div className="grid grid-cols-2 w-full text-gray-400">
              <div className="flex justify-center">
                <h3 className={`cursor-pointer ${activeTab === 'Normal' ? 'text-white' : ''}`} onClick={() => handleTabSwitch('Normal')}>Find Your Picks</h3>
              </div>

              <div className="flex justify-center">
                <h3 className={`cursor-pointer ${activeTab === 'AI' ? 'text-white' : ''}`} onClick={() => handleTabSwitch('AI')}>PixyBox AI</h3>
              </div>
            </div>

            {/* Conditionally render the genre section based on the active tab */}
            {activeTab === 'Normal' && (
                <>
                  <div className="mt-6">
                    <div className="flex overflow-x-auto px-1 space-x-4 py-4 scrollbar-custom">
                      {/* Default 'All' genre */}
                      <div
                        className={`w-fit border-2 border-red-600 rounded-full text-white py-2 px-4 text-center cursor-pointer transition-transform duration-200 hover:bg-red-600 ${
                          selectedGenre === 'All' ? 'bg-red-600' : ''
                        }`}
                        onClick={() => handleGenreSelect('All')}
                      >
                        <h5>All</h5>
                      </div>

                      {/* Map through genres and render them */}
                      {genres &&
                        genres.map((genre, index) => (
                          <div
                            key={index}
                            className={`w-fit border-2 border-red-600 rounded-full text-white py-2 px-4 text-center cursor-pointer transition-transform duration-200 hover:bg-red-600 ${
                              selectedGenre === genre ? 'bg-red-600' : ''
                            }`}
                            onClick={() => handleGenreSelect(genre)} >
                            <h5>{genre}</h5>
                          </div>
                        ))}
                    </div>
                  </div>


                  <div className="text-white container px-3 py-4 my-20 bg-gray-900">
                    <div className="flex items-center justify-center flex-wrap scrollbar-custom py-4">
                      {/* Render the movies if they exist */}
                      {movies.length > 0 && movies.map((movie, index) => (
                        <div key={index} className="p-4 md:w-1/2 lg:w-1/3 xl:w-1/4 w-64 h-96 bg-gray-900 flex-shrink-0">
                          <div className="group h-full bg-gray-800 bg-opacity-40 rounded-xl flex flex-col overflow-hidden border-2 border-red-600 relative">
                            <div className="h-full w-full">
                              <img src={movie.poster_path} alt='Movie Poster' className='w-100 h-100 object-cover' />
                            </div>
                            <div className="movie-desc flex flex-col justify-between absolute bottom-0 left-0 w-full h-full bg-[#060d17e0] p-6 z-10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                              <h3 className='text-xl font-bold'>{movie.title}</h3>
                              <p className="text-sm text-white overflow-y-auto max-h-36 scrollbar-custom scrollbar-thin pr-2">{movie.overview}</p>
                              <div className="text-xs text-white flex justify-between">
                                <span>{movie.runtime} mins</span>
                                <span>{movie.release_date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

              </>
            )}




            {activeTab === "AI" && (
              <>
                <div className="flex flex-col mt-10 sm:mt-20 text-center w-full mb-14 sm:mb-10">
                    <h1 className="md:text-2xl text-xl font-medium title-font font-mono text-white">Your next favorite movie is just a click away!</h1>
                </div>

                <div className="lg:w-1/2 md:w-2/3 mx-auto mb-6">
                    <form className="flex flex-col justify-center items-center sm:flex-wrap -m-2 sm:flex-row">

                        <div className="p-2 w-5/6 sm:w-1/2">
                          <div className="relative flex flex-col gap-2 sm:gap-4">
                            {/* <label className="leading-7 text-md text-gray-400">Select a movie which you like</label> */}
                            <select required className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-500 focus:border-red-500 focus:bg-gray-900 focus:ring-2 focus:ring-red-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out h-11 appearance-none" value={selectedMovie} onChange={(e) => setSelectedMovie(e.target.value)}>

                              <option value="" disabled>Select a movie</option>
                              {movieNames.map((movieName, index) => (
                                <option key={index} value={movieName}>{movieName}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="p-2 mt-4 w-fit font-mono pb-6">
                            <button onClick={handleRecommendClick} className="flex mx-auto bg-red-600 text-white border-red-600 border-2 py-2 px-6 focus:outline-none hover:bg-red-700 hover:border-red-700 rounded text-lg active:bg-red-700 active:border-red-700">Recommend</button>
                        </div>
                    </form>
                </div>
                

                <div className="text-white container px-3 py-4 my-20 bg-gray-900">
                  <div className="flex items-center justify-center flex-wrap scrollbar-custom py-4">
                    {/* Render the movies if they exist */}
                    {movies.length > 0 && movies.map((movie, index) => (
                      <div key={index} className="p-4 md:w-1/2 lg:w-1/3 xl:w-1/4 w-64 h-96 bg-gray-900 flex-shrink-0">
                        <div className="group h-full bg-gray-800 bg-opacity-40 rounded-xl flex flex-col overflow-hidden border-2 border-red-600 relative">
                          <div className="h-full w-full">
                            <img src={movie.poster_path} alt='Movie Poster' className='w-100 h-100 object-cover' />
                          </div>
                          <div className="movie-desc flex flex-col justify-between absolute bottom-0 left-0 w-full h-full bg-[#060d17e0] p-6 z-10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                            <h3 className='text-xl font-bold'>{movie.title}</h3>
                            <p className="text-sm text-white overflow-y-auto max-h-36 scrollbar-custom scrollbar-thin pr-2">{movie.overview}</p>
                            <div className="text-xs text-white flex justify-between">
                              <span>{movie.runtime} mins</span>
                              <span>{movie.release_date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </>
            )}

        </div>
      </section>
      <SubscriptionPlans />
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-sm">© 2023 PixyBox. All rights reserved.</p>
        </div>
      </footer>   

    </>
  );
};

export default Home;
