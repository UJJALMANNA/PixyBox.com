import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import Login from './Components/Login'
import Register from './Components/Register'
import { UserContext } from './UserContext'
import Home from './Components/Home'
import Private from './Private'
import About from './Components/About'
import Reviews from './Components/Reviews'



function App() {

  // Whatever data we receive from backend after successful login, we want to store that data in the loggedUser state variable
  const [loggedUser, setLoggedUser] = useState(localStorage.getItem("pixybox-user")||null);
  // If there is nothing in the local storage, it will give us null

  const [loginSuccess, setLoginSuccess] = useState('');
  

  return (
    <>
 
      

      <div className='mt-36 sm:mt-32'>
        <UserContext.Provider value={{loggedUser, setLoggedUser, loginSuccess, setLoginSuccess}}>
              {/* <Header/> */}
              
              <Routes>

                <Route path='/' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/login' element={<Login/>}/>

          

                {/* router protection */}
                <Route path='/home' element={<Private Component={Home}/>}/>
                <Route path='/about' element={<Private Component={About}/>}/>
                <Route path='/reviews' element={<Private Component={Reviews}/>}/>

                {/* If anyone goes to some other path other than the above ones, then it will load 404 */}
                {/* <Route path='*' element={<NotFound/>}/> */}

              </Routes>

        </UserContext.Provider>
      </div>

      

    </>
  )
}

export default App
