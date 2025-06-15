import React from "react"
import { Navigate } from "react-router-dom"
import { UserContext } from "./UserContext"
import { useContext } from "react"

const Private = (props) => {

    const loggedData = useContext(UserContext);

  return (

    loggedData.loggedUser!==null ?
    <props.Component/>
    : <Navigate to="/login"/>
    
  )
}

export default Private