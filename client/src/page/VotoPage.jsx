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
  const { state } = useLocation();
  const token = state?.token;

  const { votos } = useAuth();

  const onSubmit = handleSubmit(async (values) => {
    try {
      const results = await votos(token, values);
      console.log(values)
      console.log("resultados", results);

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
          {...register("candidatoID", { required: true })}
        />
        <input
          type="radio"
          value={2}
          {...register("candidatoID", { required: true })}
        />
        <input
          type="radio"
          value={3}
          {...register("candidatoID", { required: true })}
        />
    
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default voto;
