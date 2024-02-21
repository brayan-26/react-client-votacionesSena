import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../page/LoginPage";
import { AuthProvider } from "../context/AuthContext";
import VotoPage from "../page/VotoPage";
import ProtectedRouters from "../context/ProtectedRouters";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<p>Ruta no encontrada</p>} />
          <Route path="/" element={<LoginPage />} />

          <Route element={<ProtectedRouters />}>
            <Route path="/voto" element={<VotoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
