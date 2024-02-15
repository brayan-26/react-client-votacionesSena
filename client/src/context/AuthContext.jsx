import { createContext, useState, useContext } from "react";
import { loginRequest, voto } from "../api/auths";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.log("no hay contexto");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isAuthentcated, setIsAuthentcated] = useState(false);

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      setUser(res.data);
      setIsAuthentcated(true);
      const resStatus = res.status;
      return { resStatus: resStatus, res: res };
    } catch (error) {
      if (error.response) {
        const errData = error.response.data;
        const errResponse = error.response.status;
        return { errData: errData, errResponse: errResponse };
      } else {
        console.log(error);
      }
    }
  };

  const votos = async (user) => {
    try {
      const res = await voto(user);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        signin,
        votos, 
        user,
        isAuthentcated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
