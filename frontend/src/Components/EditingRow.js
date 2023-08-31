import React from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { AiOutlineCheck } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";

function EditingRow({
  itemNumber,
  editFormData,
  handleEditFormChange,
  handleCancelClick,
}) {
  return (
    <tr>
      <td>{itemNumber}</td>
      <td>
        <Form.Control
          type="text"
          required
          name="itemName"
          value={editFormData.itemName}
          placeholder="Name of the product"
          onChange={handleEditFormChange}
        />
      </td>
      <td>
        <Form.Control
          type="text"
          required
          name="itemQuantity"
          placeholder="Product Quantity"
          value={editFormData.itemQuantity}
          onChange={handleEditFormChange}
        />
      </td>
      <td>
        <Form.Control
          type="text"
          required
          name="preferredBrand"
          placeholder="Preferred Brand"
          value={editFormData.preferredBrand}
          onChange={handleEditFormChange}
        />
      </td>
      <td>
        <Form.Control
          type="text"
          name="alternateBrand"
          placeholder="Name of the product"
          value={editFormData.alternateBrand}
          onChange={handleEditFormChange}
        />
      </td>
      <td>
        <Button type="submit" variant="outline-success">
          <AiOutlineCheck />
        </Button>{" "}
        <Button variant="outline-danger" onClick={handleCancelClick}>
          <RxCross2 />
        </Button>
      </td>
    </tr>
  );
}

export default EditingRow;
