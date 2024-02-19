import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import candidatos from "../../dataCandidatos/candidatos";

function VotoPage() {
  const { register, handleSubmit } = useForm();
  const { state } = useLocation();
  const token = state?.token;
  const { votos } = useAuth();

  const onSubmit = async(dato) => {
    try {
    
      const results = await votos(token, dato);
      console.log(results)
    } catch (error) {
      console.log(error)
    }
  };
  const renderCandidatos = candidatos.map((c) => (
    <div className="class" key={c.name}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container-card">
          <h2>{c.name}</h2>
          <p>{c.propuesta}</p>
          <p>{c.img}</p>
          <button
            type="button"
            {...register("candidatoID")}
            onClick={() => onSubmit(c.id)}
          >
            subir
          </button>
        </div>
      </form>
    </div>
  ));

  return <div>{renderCandidatos}</div>;
}

export default VotoPage;
