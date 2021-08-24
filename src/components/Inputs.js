import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import FormControl from "react-bootstrap/FormControl";

function Inputs(props) {
  return (
    <Form onSubmit={props.pressSubmit}>
      <Form.Group className="mb-2">
        <Form.Label>Tamaño de la matriz:</Form.Label>
        <FormControl
          type="number"
          name="input-rows"
          onChange={props.changeSize}
        />
      </Form.Group>
      <>
        <Button variant="secondary" type="submit">
          Reiniciar matriz
        </Button>
      </>
    </Form>
  );
}

export default Inputs;
