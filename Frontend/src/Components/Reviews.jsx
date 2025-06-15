import React, { useState, useContext, useEffect } from 'react';
import Header2 from './Header2';
import { UserContext } from '../UserContext';

const Reviews = () => {
  const loggedData = useContext(UserContext);
  const [deleteMessage, setDeleteMessage] = useState({
    type: "invisible-msg",
    text: ""
  });

  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // Track the active tab (all or my)
  const [message, setMessage] = useState({
    type: "invisible-msg",
    text: ""
  });

  // Automatically loads
  useEffect(() => {
    getAllReviews();
  }, []);


  function formatDate(input) {
    const date = new Date(input);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }


  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const fillColor = i <= rating ? 'red' : 'gray';
      stars.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={fillColor}
          className="w-6 h-6"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      );
    }
    return stars;
  };


  const getAllReviews = () => {
    setActiveTab('all');
    fetch("http://localhost:2020/all-reviews", {
      method: "GET"
    })
      .then((res) => {
        if (res.status === 204) {
          setMessage({ type: "no reviews", text: "No reviews found!" });
          setReviews([]);
          return []; // Return empty array, as there's no content to process
        }
        return res.json(); // Return empty array, as there's no content to process
      })
      .then((data) => {
        setReviews(data);
      })
      .catch((err) => {
        setMessage({ type: "error", text: err.message });
        setTimeout(() => {
          setMessage({ type: "invisible-msg", text: "dummy" })
        }, 3000)
      })
  }


  const getMyReviews = () => {
    const loggedUser = typeof loggedData.loggedUser === 'string'
      ? JSON.parse(loggedData.loggedUser)
      : loggedData.loggedUser;

    setActiveTab('my');
    fetch(`http://localhost:2020/my-reviews/${loggedUser.userid}`, {
      method: "GET"
    })
      .then((res) => {
        if (res.status === 204) {
          setMessage({ type: "no reviews", text: "You haven't posted any reviews yet!" });
          setReviews([]);
          return []; // Return empty array, as there's no content to process
        }
        return res.json(); // Parse the response body only if it contains data
      })
      .then((data) => {
        setReviews(data);
      })
      .catch((err) => {
        setMessage({ type: "error", text: "Server Error! Please try again." });
        setTimeout(() => {
          setMessage({ type: "invisible-msg", text: "" })
        }, 3000)
      })
  }


  const deleteReview = (reviewId) => {
    fetch(`http://localhost:2020/delete-review/${reviewId}`, {
      method: "DELETE"
    })
      .then((res) => {
        if (res.status === 204) {
          setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
          setDeleteMessage({ type: "deleted", text: "Your review was deleted!" });

          setTimeout(() => {
            setDeleteMessage({ type: "invisible-msg", text: "" })
          }, 3000)
        }
      })
      .catch((err) => {
        setDeleteMessage({ type: "not deleted", text: err.message });
        setTimeout(() => {
          setDeleteMessage({ type: "invisible-msg", text: "" })
        }, 3000)
      })
  }


  return (
    <>
      <Header2 />

      <section className="mt-44 sm:mt-10 bg-gray-900">
        <div className="container px-5 py-1 mx-auto">
          <div className="grid grid-cols-2 w-full text-gray-400">
            <div className="flex justify-center">
              <h3 className={`cursor-pointer ${activeTab === 'all' ? 'text-white' : ''}`} onClick={() => getAllReviews()}>All Reviews</h3>
            </div>

            <div className="flex justify-center">
              <h3 className={`cursor-pointer ${activeTab === 'my' ? 'text-white' : ''}`} onClick={() => getMyReviews()}>My Reviews</h3>
            </div>
          </div>


          {/* Delete message alert section */}
          {activeTab === 'my' && (
            <div id="alert-msg" className="flex sticky h-24 items-center justify-center bg-gray-900 mt-1">
              {deleteMessage.type === "deleted" && (
                <div className="flex w-5/6 sm:w-4/6 lg:w-3/6 xl:[600px] rounded-lg items-center p-4 mb-2 text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-800 dark:bg-green-100 dark:border-green-500" role="alert">
                  <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                  </svg>
                  <div className="ms-3 text-sm font-medium">{deleteMessage.text}</div>
                </div>
              )}

              {deleteMessage.type === "not deleted" && (
                <div className="flex w-5/6 sm:w-4/6 lg:w-3/6 xl:[600px] rounded-lg items-center p-4 mb-2 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-800 dark:bg-red-100 dark:border-red-500" role="alert">
                  <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                  </svg>
                  <div className="ms-3 text-sm font-medium">{deleteMessage.text}</div>
                </div>
              )}
            </div>
          )}


          {/* Scrollable review section */}
          <div className={`container px-3 py-4 mx-auto bg-gray-900 overflow-y-auto scrollbar-hidden 
            ${activeTab === 'all' ? 'mt-6 max-h-[58vh] sm:max-h-[65vh]' : 'max-h-[46vh] sm:max-h-[53vh]'}`}>
            <div className="flex flex-wrap justify-center -m-4">

              {/* Display message when there are no reviews based on the active tab */}
              {activeTab === 'all' && reviews.length === 0 && (
                <div className="flex flex-col text-center w-full mt-20">
                  <h1 className="md:text-2xl text-xl font-medium title-font font-mono text-white">{message.text}</h1>
                </div>
              )}

              {activeTab === 'my' && reviews.length === 0 && (
                <div className="flex flex-col text-center w-full mt-20">
                  <h1 className="md:text-2xl text-xl font-medium title-font font-mono text-white">{message.text}</h1>
                </div>
              )}


              {/* Render the reviews if they exist */}
              {reviews.length > 0 && reviews.map(item => (
                <div key={item._id} className="p-2 sm:p-4 md:w-1/2 lg:w-1/3 w-full h-80 bg-slate-900">
                  <div className="h-full bg-gray-800 bg-opacity-40 p-6 rounded flex flex-col border-2 border-red-600">
                    <div className='flex justify-between'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="block w-6 h-6 text-gray-500 mb-4" viewBox="0 0 975.036 975.036">
                        <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                      </svg>
                      <div className="flex justify-end">
                        {renderStars(item.rating)}
                      </div>
                    </div>
                    <p className="leading-relaxed mb-6 text-white overflow-y-auto max-h-36 scrollbar-custom pr-2">{item.comment}</p>
                    <div className="mt-auto flex">
                      <span className="flex-grow flex flex-col ">
                        <span className="title-font font-medium text-white text-sm">{item.name}</span>
                        <span className="text-gray-500 text-sm">{item.country}, {formatDate(item.createdAt)}</span>
                      </span>

                      {activeTab === 'my' && (
                        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => { deleteReview(item._id) }} className='w-5 h-5 invert cursor-pointer self-end' viewBox="0 0 448 512">
                          <path d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Reviews;
