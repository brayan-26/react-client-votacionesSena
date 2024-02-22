import { loginRequest, getCandidatos, voto } from "../api/auths";
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
  const [user, setUser] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // login
  const singIn = async (values) => {
    try {
      const results = await loginRequest(values);
      const token = results.headers.authorization;
      const tokenValue = token.substring(7);
      const resultSatus = results.status;
      setUser(results.data);
      setIsAuthenticated(true);

      return { resultSatus: resultSatus, token: tokenValue };
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

  // obtiene los candidatos
  const getCandi = async (values) => {
    try {
      const results = await getCandidatos(values);
      const Data = results.data.info;
      return { Data: Data };
    } catch (error) {
      console.log(error);
    }
  };
  const votos = async (token, user) => {
    try {
      const result = await voto(token, user);
      console.log(result.data);
      console.log(result.response);
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        const errorResponse = error.response.status;
        // console.log(errorData)
        // console.log(errorResponse)
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
        getCandi,
        votos, 
        user,
        isAuthenticated,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
