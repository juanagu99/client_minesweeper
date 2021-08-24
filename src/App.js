import React, { useState,useEffect } from "react";
import "./App.css";
import Table from "./components/Table";
import Inputs from "./components/Inputs";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import io from 'socket.io-client';

const socket = io(`http://${window.location.hostname}:4000`);

function App() {

  const [connect, setConnect] = useState(false);
  const [size, setSize] = useState(0);
  const [boardView, setboardView] = useState([]); //matriz que utiliza la vista
  const [boardServer, setboardServer] = useState([]); //matriz que utiliza el server
  const [flags, setFlags] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('conectado al servidor',);
      setConnect(true)
    });    
    socket.on('disconnect', () => {
      console.log('Perdimos conección con el servidor');
      setConnect(false)
    });  
  }, [connect]);

  const convertBoard = (board,flag)=>{    
    let mat = []
    for (var i = 0; i < board.length; i++) {
      let row = []
      for (var j = 0; j < board.length; j++) {       
        row.push( {x: i, y: j , value: board[i][j], active:flag[i][j]} )        
      }
      mat.push(row)
    }
    return mat;
  }

  const pressSubmit = (event) => {
    if (size <= 4) {

      alert("El tamaño de la matriz debe ser mayor a 4");

    } else {

      if (size > 100) {

        alert("El limite de tamaño es 100");

      } else {
       
        socket.emit('createBoard', parseInt(size), (resp) => {
          
          //creación de una matriz de objetos donde se indica las posiciones
          //y el valor correspondiente en esa posición
          setboardServer(resp.board)
          setboardView(convertBoard(resp.board,resp.flags))
          setFlags(resp.flags)

        });

      }
    }
    event.preventDefault();
  };

  const changeSize = (event) => {
    setSize(event.target.value);
  };

  const handleClick= (e,posx,posy) => {

    /*
      en el tablero: -1 : Una mina, el resto son números de 0 hasta 8 según la cantidad de minas adyacentes
      en la segunda matriz: 0 : no se ha tocado el cuadro, -1 : pusieron una bandera, 1 : ya fue tocada        
    */   

    if(e.nativeEvent.which === 1){
      
      alert('seleccionaste la posición: ' + posx + ',' +posy)

      socket.emit(
        'performAction',
        {
          coords: { x: parseInt(posx) , y: parseInt(posy) },
          board: boardServer,
          flags: flags,
        },
        (resp) => {
  
          if(resp.condition === 'lose'){
            //recordar que al momento de pisar una mina no se esta actualizando la matriz flag de esa posición en -1 solo se envia el mensaje: lose
            //preguntar como se envia una petición para simular el click de una cordenada como bandera
            alert('pisaste una mina!')
            setboardServer([])        
            setboardView(convertBoard([],[]))
            setFlags(resp.flags)
          }else if (resp.condition === 'win'){
            alert("Ganaste!")
            setboardServer([])        
            setboardView(convertBoard([],[]))
            setFlags(resp.flags)
          }else{          
            console.log('board: ',resp.board)
            console.log('flags: ',resp.flags)
            console.log('condition',resp.condition)
            setboardServer(resp.board)        
            setboardView(convertBoard(resp.board,resp.flags))
            setFlags(resp.flags)
          }
        }
      );
  
    } else if (e.nativeEvent.which === 3) {  
      //Aqui aun no se puede ganar cuando se pone banderas    
      e.preventDefault();
      console.log('Right click');
      flags[posx][posy]=-1;
      setboardView(convertBoard(boardServer,flags))
      console.log('revisar',flags)       
    }   
   
  }

  return (
    //Contenedor principal    
    <Container fluid="True">
      <div className="Form-container">
        <Inputs pressSubmit={pressSubmit} changeSize={changeSize} />
      </div>
      <Container className="Table-container" fluid="True">
        { connect ? (
          <Table board={boardView} clickPosition={handleClick} />
                    
        ):(
          <div>No se pudo entablecer conexión con el socket</div>
        )        
        }          
      </Container>
    </Container> 
   
  );
}

export default App;
