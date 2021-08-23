import React from "react";
import TableBoostrap from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";

function Table(props) {
  const items = props.matriz.map((row) => (
    <tr key={Math.random()}>
      {row.map((column) => (
        <td key={column}>
          <Button onClick={() => props.clickPosition(column)}>{column}</Button>
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
