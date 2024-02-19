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
      const resStatus = res.status;
      setUser(res.data);
      setIsAuthentcated(true);
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

  const votos = async (token,user) => {
    try {
      const result = await voto(token,user);
      console.log(result)
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
