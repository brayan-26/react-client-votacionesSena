import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

function voto() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navegate = useNavigate();
  const { state } = useLocation();
  const tokenForm = state?.token;

  const { votos } = useAuth();
  // const [mensaje, setMensaje] = useState(null);

  const onSubmit = handleSubmit(async (values) => {
    try {
      console.log("boton", values);
      // console.log("token", tokenForm )

      // const results = await votos(values);
      // console.log(results);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="radio"
          value={1}
          {...register("candidatoId", { required: true })}
        />
        <input
          type="radio"
          value={2}
          {...register("candidatoId", { required: true })}
        />
        <input
          type="radio"
          value={3}
          {...register("candidatoId", { required: true })}
        />
        <button type="submit" value={1}>enviar</button>
      </form>
    </div>
  );
}

export default voto;
