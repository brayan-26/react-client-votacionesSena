import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import "../public/style/style.css";

function LoginPage() {
  const {
    register,
    handleSubmit,
  } = useForm();
  const navegate = useNavigate();

  const { signin } = useAuth();
  const [mensaje, setMensaje] = useState(null);
  const cerrarVentanaEmergente = () => {
    setMensaje(false);
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      const results = await signin(values);
      if (results.resStatus === 202) {
        const token = results.res.data.token;
        navegate("/voto", { state: { token } });
      } else {
        if (results.errResponse !== 200) {
          const errorMessage = results.errData;
          setMensaje(errorMessage);
          navegate("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className="Body-login">
      <div className="container-login">
        <div className="container-form">
          <form onSubmit={onSubmit}>
            <p>Ingrese su numero de cedula</p>
            <input type="number" {...register("cedula", { required: true })} />
            <p>Ingrese su numero de ficha</p>
            <input type="number" {...register("ficha", { required: true })} />
            <button type="submit">Iniciar sesión</button>
          </form>
          {mensaje && (
            <div className="container-mensaje">
              <div className="mensaje">
                <p>Ficha o numero de cudula erroneo</p>
                <button onClick={cerrarVentanaEmergente}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
