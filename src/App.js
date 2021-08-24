import React, { useState, useEffect } from "react";
import "./App.css";
import Table from "./components/Table";
import Inputs from "./components/Inputs";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import io from "socket.io-client";

const socket = io(`http://${window.location.hostname}:4000`);

function App() {

  const [connect, setConnect] = useState(false); //me indica que hay conexión con el socket
  const [size, setSize] = useState(0);//me indica el tamñao de la matriz
  const [boardView, setboardView] = useState([]); //matriz que utiliza la vista para pintar la matriz
  const [boardServer, setboardServer] = useState([]); //matriz que utiliza el server donde contiene los valores que contiene cada boton
  const [flags, setFlags] = useState([]); //matriz que contiene las banderas de la aplicación, se utiliza para saber que botones se presionaron

  useEffect(() => {
    socket.on("connect", () => {
      console.log("conectado al servidor");
      setConnect(true);
    });
    socket.on("disconnect", () => {
      console.log("Perdimos conección con el servidor");
      setConnect(false);
    });
  }, [connect]);

  const convertBoard = (board, flag, hiden) => {
    let mat = [];
    for (var i = 0; i < board.length; i++) {
      let row = [];
      for (var j = 0; j < board.length; j++) {
        row.push({
          x: i,
          y: j,
          value: board[i][j],
          active: flag[i][j],
          hiden: hiden,
        });
      }
      mat.push(row);
    }
    return mat;
  };

  const pressSubmit = (event) => {
    console.log(event.text);
    if (size <= 4) {
      alert("El tamaño de la matriz debe ser mayor a 4");
    } else {
      if (size > 100) {
        alert("El limite de tamaño es 100");
      } else {
        socket.emit("createBoard", parseInt(size), (resp) => {
          //creación de una matriz de objetos donde se indica las posiciones
          //y el valor correspondiente en esa posición
          setboardServer(resp.board);
          setboardView(convertBoard(resp.board, resp.flags, true));
          setFlags(resp.flags);
        });
      }
    }
    event.preventDefault();
  };

  const changeSize = (event) => {
    setSize(event.target.value);
  };

  const condition = (resp) => {
    if (resp.condition === "lose") {
      setboardServer(resp.board);
      setFlags(resp.flags);
      setboardView(convertBoard(resp.board, resp.flags, false));
      alert("pisaste una mina!");
    } else if (resp.condition === "win") {
      setboardServer(resp.board);
      setFlags(resp.flags);
      setboardView(convertBoard(resp.board, resp.flags, false));
      alert("Ganaste!");
    } else {
      setboardServer(resp.board);
      setFlags(resp.flags);
      setboardView(convertBoard(resp.board, resp.flags, true));
    }
  };

  const handleClick = (e, posx, posy) => {
    if (e.nativeEvent.which === 1) {
      //left click
      socket.emit(
        "performAction",
        {
          coords: { x: parseInt(posx), y: parseInt(posy) },
          board: boardServer,
          flags: flags,
        },
        (resp) => {
          console.log("respuesta server:", resp);
          condition(resp);
        }
      );
    } else if (e.nativeEvent.which === 3) {
      //right click
      e.preventDefault();
      socket.emit(
        "setFlag",
        {
          coords: { x: parseInt(posx), y: parseInt(posy) },
          board: boardServer,
          flags: flags,
        },
        (resp) => {
          console.log("respuesta server:", resp);
          condition(resp);
        }
      );
    }
  };

  return (
    //Contenedor principal
    <Container fluid="True">
      <div className="Form-container">
        <Inputs pressSubmit={pressSubmit} changeSize={changeSize} />
      </div>
      <Container className="Table-container" fluid="True">
        {connect ? (
          <Table board={boardView} clickPosition={handleClick} />
        ) : (
          <div>No se pudo entablecer conexión con el socket</div>
        )}
      </Container>
    </Container>
  );
}

export default App;
