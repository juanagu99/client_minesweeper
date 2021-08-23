import React, { useState } from "react";
import "./App.css";
import Table from "./components/Table";
import Inputs from "./components/Inputs";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [size, setSize] = useState(0);
  const [matriz, setMatriz] = useState([]);

  /**
   *
   * @param {*} event - metodo donde se llama al websocket para inicializar la matriz
   */
  const pressSubmit = (event) => {
    if (size <= 0) {
      alert("El tamaño de la matriz debe ser mayor a cero");
    } else {
      if (size > 100) {
        alert("Alcanzo el limite de filas y columnas");
      } else {
        setMatriz([]);
        var mat = [];
        for (var i = 0; i < size; i++) {
          var row = [];
          for (var j = 0; j < size; j++) {
            row.push("" + i +','+ j);
          }
          mat.push(row);
        }
        setMatriz(mat);
      }
    }
    event.preventDefault();
  };

  const changeSize = (event) => {
    setSize(event.target.value);
  };

  const clickPosition= (position) => {
    alert('seleccionaste la posición: ' + position)
  }

  return (
    //Contenedor principal
    <Container fluid="True">
      <div className="Form-container">
        <Inputs pressSubmit={pressSubmit} changeSize={changeSize} />
      </div>
      <Container className="Table-container" fluid="True">
        <Table matriz={matriz} clickPosition={clickPosition} />
      </Container>
    </Container>
  );
}

export default App;
