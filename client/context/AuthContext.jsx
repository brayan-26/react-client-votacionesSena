import { loginRequest } from "../api/auths";
import { createContext, useState, useContext } from "react";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.log("NO hay contexto.");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  
  const singIn = async (values) => {
    try {
      const results = await loginRequest(values);
      console.log(results);
      return {results: results}

    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        const errorResponse = error.response.status;
        return { errorData: errorData, errorResponse: errorResponse };
      } else {
        console.log(error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        singIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
