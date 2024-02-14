import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./page/loginPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRouters from "./ProtectedRouters";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          {/* rutas protegidas  */}
          <Route element={<ProtectedRouters />}>
            <Route path="/main" element={<p>melo</p>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
