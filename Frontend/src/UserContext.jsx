import React, { createContext, useState } from 'react';

// Create UserContext
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  return (
    <UserContext.Provider value={{ loggedUser, setLoggedUser, successMessage, setSuccessMessage }}>
      {children}
    </UserContext.Provider>
  );
};
