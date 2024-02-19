import Swal from 'sweetalert2';

export function AlertError404({ title, text }) {
  // Configuración de la alerta
  const alert404 = {
    icon: 'error',
    title: title || 'ERROR',
    text: text || 'Ficha o numero de cedula ERRONEO'
  };

  // Mostrar la alerta al renderizar el componente
  Swal.fire(alert404);

  return null;
}

