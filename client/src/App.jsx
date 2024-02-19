import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./page/loginPage";
import VotoPage from "./page/VotoPage"
import { AuthProvider } from "./context/AuthContext";
import RutasPage from "./page/RutasPage";
import ProtectedRouters from "./ProtectedRouters";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          {/* <Route path="/" element={<VotoPage />} /> */}

          {/* rutas protegidas  */}
          <Route element={<ProtectedRouters />}>
            <Route path="/voto" element={<VotoPage/>} />
          </Route>

          <Route path="*" element={<RutasPage/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
