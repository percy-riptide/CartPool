import React from "react";
import { Button } from "react-bootstrap";
import { BsFillPencilFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

function DisplayRow({ order, handleEditClick, handleDeleteClick }) {
  return (
    <tr>
      <td>{order.itemNo}</td>
      <td>{order.itemName}</td>
      <td>{order.itemQuantity}</td>
      <td>{order.preferredBrand}</td>
      <td>{order.alternateBrand}</td>
      <td>
        <Button
          variant="outline-warning"
          onClick={(event) => handleEditClick(event, order)}
        >
          <BsFillPencilFill />
        </Button>{" "}
        <Button
          variant="outline-danger"
          onClick={() => handleDeleteClick(order.itemNo)}
        >
          <MdDelete />
        </Button>
      </td>
    </tr>
  );
}

export default DisplayRow;
