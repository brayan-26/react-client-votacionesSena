import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../public/style.css";

function VotoPage() {
  const { register, handleSubmit } = useForm();
  const { getCandi, votos } = useAuth();
  const { state } = useLocation();
  const token = state.token;
  const [candidatos, setCandidatos] = useState([]);
  const [mensaje, setMensaje]= useState();
  const navegate = useNavigate();

  // Agregar un candidato adicional
  const candidatoPersonalizado = {
    nombre: "Hansen",
    cedula: "123456789",
    id_candidatos: 99999,
  };

  // obtenemos los candidatos
  useEffect(() => {
    const obtenerCandidatos = async () => {
      try {
        const result = await getCandi(token);

        setCandidatos(result.Data);
      } catch (error) {
        console.error(error);
      }
    };

    obtenerCandidatos();
  }, [getCandi, token]);

  // ejerce el voto
  const onSubmit = async (values) => {
    try {
      // console.log(values)
      const result = await votos(token, values);

      if (result.errorData) {
        if (result.errorResponse === 500) {

          setMensaje(result.errorData);
          navegate("/");
        }
        if (result.errorResponse === 400) {
          setMensaje(result.errorData);
          // navegate("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const candidatosConPersonalizado = [...candidatos, candidatoPersonalizado];

  const renderCandidatos = candidatosConPersonalizado.map((candidato) => (
    <div key={candidato.id_candidatos} className="container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <p>{candidato.nombre}</p>
        <p>{candidato.cedula}</p>
        <button
          type="button"
          {...register("candidatoID")}
          onClick={() => onSubmit(candidato.id_candidatos)}
        >
          subir
        </button>
      </form>
    </div>
  ));

  return <div className="container-datos">{renderCandidatos}
  {mensaje && <p>{mensaje}</p>}
  </div>;
}

export default VotoPage;
