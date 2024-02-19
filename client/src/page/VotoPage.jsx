import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import Card from "../../dataCandidatos/Card";
import candidatos from "../../dataCandidatos/candidatos";
import { useNavigate, useLocation } from "react-router-dom";

function voto() {
  const { register, handleSubmit } = useForm();
  const { state } = useLocation();
  const token = state?.token;

  const { votos } = useAuth();

  const onSubmit = handleSubmit(async (values) => {
    try {
      console.log(values.id);
    } catch (error) {
      console.log(error);
    }
  });

  const handleVoteClick = (id) => {
    // Al hacer clic en el botón, establece el id en los datos del formulario
    onSubmit({ id });
  };

  const renderCandidatos = candidatos.map((c) => {
    return (
      <Card
        key={c.name}
        nombre={c.name}
        propuesta={c.propuesta}
        imagen={c.img}
        id={c.id}
        onVoteClick={handleVoteClick}
      />
    );
  });
  return (
    <div>
      <form onSubmit={onSubmit}>{renderCandidatos}</form>
    </div>
  );
}

export default voto;
