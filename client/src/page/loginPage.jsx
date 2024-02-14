import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navegate = useNavigate();

  const { signin } = useAuth();
  const [mensaje, setMensaje] = useState(null);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const results = await signin(values);
      if (results.resStatus === 202) {
        navegate("/main");
      } else {
        if (results.errResponse === 404) {
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
    <div>
      <form onSubmit={onSubmit}>
        <input type="number" {...register("cedula", { required: true })} />
        {errors.cedula && <p>sgudfsh chd</p>}
        <input type="number" {...register("ficha", { required: true })} />
        {errors.ficha && <p>sgudfsh chd</p>}

        {/* mensaje del back-end */}
        {mensaje && <p>{mensaje}</p>}
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}

export default LoginPage;
