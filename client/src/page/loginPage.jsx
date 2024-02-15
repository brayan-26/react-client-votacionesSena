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
        const token = results.res.data.token;
        // envio el token a la pagina de voto
        console.log(token)
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
    <div>
      <form onSubmit={onSubmit}>
        <input type="number" {...register("cedula", { required: true })} />
        {errors.cedula && <p>Ingrese su cedula</p>}
        <input type="number" {...register("ficha", { required: true })} />
        {errors.ficha && <p>Ingrese el numero de ficha </p>}

        {/* mensaje del back-end */}
        {mensaje && <p>{mensaje}</p>}
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}

export default LoginPage;
