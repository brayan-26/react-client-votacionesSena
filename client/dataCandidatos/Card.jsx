import "../src/public/style/style.css";
function Card({ nombre, propuesta, imagen, id }) {
  return (
    <div className="class">
      <div className="container-card">
        <h2>{nombre}</h2>
        <p>{propuesta}</p>
        <p>{imagen}</p>
        <button type="button" onClick={() => onVoteClick(id)}>
          subir
        </button>
      </div>
    </div>
  );
}

export default Card;
