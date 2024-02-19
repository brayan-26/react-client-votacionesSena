import "../public/style/style.css";
import imgError from "../public/img/img-error.png";
function RutasPage() {
  return (
    <div>
      <div className="conatiner-error">
        <div className="container">
          <div className="center">
            <img src={imgError} alt="imagen 404" />
            <p>Página no encontrada</p>
            <p>Lo sentimos, la página que buscas no existe.</p>
            <button>
              <a href="/">principal</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RutasPage;
