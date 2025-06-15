import React, { useEffect } from 'react'
import { useState, useContext } from 'react';
import Header2 from './Header2'
import Team from './Team';
import { UserContext } from '../UserContext';

const About = () => {

  const loggedData = useContext(UserContext);

  const [reviewDetail, setReviewDetail] = useState({
      user: "",
      rating: 0,
      comment: "",
      name: "",
      country: ""
  });

  // putting some dummy message
  const [message, setMessage] = useState({
    type: "invisible-msg",
    text: "",
  });

  // State to hold the rating value
  // const [rating, setRating] = useState(0);

  // Temporary hover state to preview rating
  const [hoveredRating, setHoveredRating] = useState(0);


  // Function to handle star click and set rating
  const handleStarClick = (index) => {
    // setRating(index);
    console.log(index)
    
    setReviewDetail({
      ...reviewDetail,
      rating: index,
    });
  };


  // Function to render stars based on the rating
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      // Determine the fill color based on hover or actual rating
      const fillColor = i <= (hoveredRating || reviewDetail.rating) ? 'red' : 'gray';
      
      stars.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={fillColor} // Color the star based on hovered or actual rating
          className="w-6 h-6 cursor-pointer transition-all duration-200 ease-in-out"
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => setHoveredRating(i)} // Preview rating on hover
          onMouseLeave={() => setHoveredRating(0)} // Reset hover preview on mouse leave
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      );
    }
    return stars;
  };


  // Function to handle input
  function handleInput(event)
  {
      setReviewDetail((prev) => {
          return { ...prev, [event.target.name]: event.target.value};
      });
  }


  // Function to handle submit
  function handleSubmit(event)
  {
      if(reviewDetail.comment.trim().length===0)
      {
          setMessage({type:"no review", text:"Please give some review to our application!"}); 

            setTimeout(()=>{
                setMessage({type:"invisible-msg", text:""});
            },3000)
      }

      else if (reviewDetail.rating===0)
      {
          event.preventDefault();
          setMessage({type:"no rating", text:"Please give some rating to our application!"}); 

          setTimeout(()=>{
              setMessage({type:"invisible-msg", text:""});
          },3000)
      }
      
      else
      {
          event.preventDefault();
          fetch(`http://localhost:2020/review/${JSON.parse(loggedData.loggedUser).userid}`, {
            method: "POST",
            body: JSON.stringify(reviewDetail),
      
            // always send header while sending POST requests
            headers: {
              "Content-Type": "application/json",
            }
          })
          .then((res)=>res.json())
          .then((data)=>{

            setMessage({type:"success", text: data.message});
              setTimeout(()=>{
                  setMessage({type:"invisible-msg", text:""});
              },3000)
            
              setReviewDetail({
                  user: "",
                  rating: 0,
                  comment: "",
                  name: "",
                  country: ""
              })
              
          })
          .catch((err)=>{
              setMessage({type:"failure", text: err.message});
              setTimeout(()=>{
                  setMessage({type:"invisible-msg", text:""});
              },3000)
          })
      }
  }



  return (
    <>
        <Header2/>

        <section className="mt-40 sm:mt-24 flex flex-col gap-2 bg-gray-900">

            <div className="container px-5 pt-10 pb-6 sm:py-6 mx-auto">
                <div className="flex flex-col text-center w-full mb-6">
                  <h1 className="md:text-2xl text-xl sm:mb-4 font-medium title-font font-mono title-font text-white">
                    Your feedback makes every movie recommendation better!
                  </h1>
                </div>

                <form className="flex flex-col mt-10 justify-center items-center gap-4 sm:flex-wrap">
                    {/* Star Rating Section */}
                    <div className="flex justify-center items-center space-x-2">
                      {renderStars()}
                    </div>

                    <div className="p-2 w-5/6 md:w-4/6 xl:w-3/6 text-center">
                        <div className="relative">
                            {/* <label className="leading-7 text-sm text-gray-400">Drop a review within 50 characters</label> */}
                            <textarea onChange={handleInput} required maxLength={500} name="comment" value={reviewDetail.comment} placeholder='Drop your review within 500 characters' className="w-full h-40 min-h-40 max-h-40 text-sm sm:text-base lg:text-lg bg-gray-800 bg-opacity-40 rounded border border-gray-500 focus:border-red-500 focus:bg-gray-900 focus:ring-2 focus:ring-red-900 outline-none text-gray-100 py-1 px-3 leading-relaxed transition-colors duration-200 ease-in-out"/>
                        </div>
                    </div>

                    <div className="p-0 w-full font-mono">
                        <button onClick={handleSubmit} className="flex mx-auto bg-red-600 text-white border-red-600 border-2 py-2 px-6 focus:outline-none hover:bg-red-700 hover:border-red-700 rounded text-lg active:bg-red-700 active:border-red-700">Submit</button>
                    </div>
                </form>
            </div>


            <div id="alert-msg" className="flex sticky h-20 items-center justify-center bg-gray-900">

                {message.type === "success" && (
                    <div className="flex w-5/6 sm:w-4/6 lg:w-3/6 xl:[600px] rounded-lg items-center p-4 mb-4 text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-800 dark:bg-green-100 dark:border-green-500" role="alert">
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

                {message.type === "no rating" && (
                    <div className="flex w-5/6 sm:w-4/6 lg:w-3/6 xl:[600px] rounded-lg items-center p-4 mb-4 text-gray-800 border-t-4 border-gray-300 bg-gray-50 dark:text-gray-800 dark:bg-gray-100 dark:border-gray-500" role="alert">
                      <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                      </svg>
                      <div className="ms-3 text-sm font-medium">{message.text}</div>
                    </div>
                )}

            </div>

            <div className="p-0 w-full pt-0 border-t border-gray-700 text-center"></div>

            <Team/>
        </section>


    </>
  )
}

export default About