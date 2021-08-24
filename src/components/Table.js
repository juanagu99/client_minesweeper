import React from "react";
import TableBoostrap from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { FaBomb, FaFlag } from "react-icons/fa";
import { BiAperture } from "react-icons/bi";

const Icons = (props) => {
  /*
    board: -1 : Una mina, el resto son números de 0 hasta 8 según la cantidad de minas adyacentes
    flags: 0 : no se ha tocado el cuadro, -1 : pusieron una bandera, 1 : ya fue tocada
  */
  return (
    <div>
      {parseInt(props.cell["value"]) === -1 ? (
        parseInt(props.cell["active"]) === 0 ? (
          <BiAperture />
        ) : parseInt(props.cell["active"]) === -1 ? (
          <FaFlag />
        ) : (
          <FaBomb />
        )
      ) : parseInt(props.cell["active"]) === 0 ? (
        <BiAperture />
      ) : parseInt(props.cell["active"]) === -1 ? (
        <FaFlag />
      ) : (
        props.cell["value"]
      )}
    </div>
  );
};

function Table(props) {
  const items = props.board.map((row) => (
    <tr key={Math.random()}>
      {row.map((cell) => (
        <td>
          {cell["hiden"] === true ? (
            <Button
              Active
              className="board-cell"
              onClick={(e) => props.clickPosition(e, cell["x"], cell["y"])} //left clcik
              onContextMenu={(e) =>
                //right click
                props.clickPosition(e, cell["x"], cell["y"])
              }
            >
              <Icons cell={cell} />
            </Button>
          ) : (
            <Button
              disabled
              className="board-cell"
              onClick={(e) => props.clickPosition(e, cell["x"], cell["y"])} //left clcik
              onContextMenu={(e) =>
                //right click
                props.clickPosition(e, cell["x"], cell["y"])
              }
            >
              <Icons cell={cell} />
            </Button>
          )}
        </td>
      ))}
    </tr>
  ));

  return (
    <TableBoostrap responsive striped bordered hover>
      <tbody>{items}</tbody>
    </TableBoostrap>
  );
}

export default Table;
