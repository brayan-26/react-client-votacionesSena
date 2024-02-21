import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { register, handleSubmit } = useForm();
  const { singIn } = useAuth();
  

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await singIn(values);
      console.log(result)
      console.log(result.errorData)
      console.log(result.errorResponse)

    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="number" {...register("cedula", { required: true })} />
        <input type="number" {...register("ficha", { required: true })} />
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}

export default LoginPage;
