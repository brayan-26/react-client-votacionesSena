import "../src/public/style/style.css";
function Card({ nombre, propuesta, imagen, id }) {
  return (
    <div className="class">
      <div className="container-card">
        <h2>{nombre}</h2>
        <p>{propuesta}</p>
        <p>{imagen}</p>
        <input type="radio" value={id} name="id"/>
      </div>
    </div>
  );
}

export default Card;
