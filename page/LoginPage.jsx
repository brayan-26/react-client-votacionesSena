import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const { register, handleSubmit } = useForm();
  const navegate = useNavigate();
  const { singIn } = useAuth();
  // const {} =

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await singIn(values);

      // manejo de respuesta si se logea de manera correcta 202
      if (result.resultSatus) {
        if (result.resultSatus === 200) {
          const token = result.token;
          const tokenDatos = decodeToken(token);
          if (tokenDatos.rol === "user") {
            navegate("/voto", { state: { token } });
          }
          // logica del administrador
          if (tokenDatos.rol === "admin") {
            console.log("administrador");
          }
        }
      }
      if (result.errorData) {
        if (result.errorResponse === 500) {
          console.log("error server");
          navegate("/");
        }
        if (result.errorResponse === 400) {
          console.log(result.errorData);
        }
      }

      // menejo de errores si no se logea bien
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text" {...register("cedula", { required: true })} />
        <input type="text" {...register("ficha", { required: true })} />
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}

export default LoginPage;
