import React, { useState, useEffect } from "react";
import Formulario from "./components/Formulario";
import ListadoImagenes from "./components/ListadoImagenes";

function App() {
  const [busqueda, guardarBusqueda] = useState("");
  const [imagenes, guardarImagenes] = useState([]);
  const [paginaActual, guardarPaginaActual] = useState(1);
  const [totalPaginas, guardarTotalPaginas] = useState(1);

  useEffect(() => {
    const consultarApi = async () => {
      if (busqueda === "") return;

      const imagenesPorPagina = 30;
      const key = "17192503-cd9ee0f72441f38b5de6ab66d";
      const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenesPorPagina}&page=${paginaActual}`;

      const respuesta = await fetch(url);
      const resultado = await respuesta.json();

      guardarImagenes(resultado.hits);

      // Calcular el total de páginas
      const totalPaginas = Math.ceil(resultado.totalHits / imagenesPorPagina);
      guardarTotalPaginas(totalPaginas);

      // Scroll Up cuando se cambia de página
      const jumbotron = document.querySelector(".jumbotron");
      jumbotron.scrollIntoView({ behavior: "smooth" });
    };
    consultarApi();
  }, [busqueda, paginaActual]);

  // Definir página anterior
  const paginaAnterior = () => {
    const nuevaPaginaActual = paginaActual - 1;

    if (paginaActual === 0) return;

    guardarPaginaActual(nuevaPaginaActual);
  };

  // Definir página siguiente
  const paginaSiguiente = () => {
    const nuevaPaginaActual = paginaActual + 1;

    if (nuevaPaginaActual > totalPaginas) return;

    guardarPaginaActual(nuevaPaginaActual);
  };

  return (
    <div className="container">
      <div className="jumbotron">
        <p className="lead text-center">Buscador de Imágenes</p>
        <Formulario guardarBusqueda={guardarBusqueda} />
      </div>

      <div className="row justify-content-center mb-5">
        <ListadoImagenes imagenes={imagenes} />

        {paginaActual === 1 ? null : (
          <button
            type="button"
            className="btn btn-info mr-1"
            onClick={paginaAnterior}
          >
            <span className="align-middle">&laquo; </span>Anterior
          </button>
        )}
        {paginaActual === totalPaginas ? null : (
          <button
            type="button"
            className="btn btn-info"
            onClick={paginaSiguiente}
          >
            Siguiente <span className="align-middle"> &raquo;</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
