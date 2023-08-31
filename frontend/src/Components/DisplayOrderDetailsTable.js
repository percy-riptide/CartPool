import React from "react";
import { Button, Modal, Table, Card } from "react-bootstrap";

const DisplayOrderDetailsTable = (props) => {
  let orderTemp = props.orderDetails;
  let image = props.order.order_details_blob;

  return (
    <Modal
      show="true"
      className="mt-5 modal-component"
      dialogClassName="modal-90w"
      size="lg"
      animation="true"
    >
      <Modal.Header className="modal-component-header">
        <Modal.Title>Order details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-component-body">
        <Card>
          <Card.Body>
            {image && (
              <>
                <div style={{ textAlign: "center" }}>
                  <img
                    src={"data:image/png;base64," + image}
                    style={{ height: "80%", width: "80%" }}
                    alt=""
                  />
                </div>
              </>
            )}
            {orderTemp.length !== 0 && (
              <>
                <Table responsive striped>
                  <thead style={{ textAlign: "center" }}>
                    <tr>
                      <th>No. </th>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Preferred brand</th>
                      <th>Alternate brand</th>
                    </tr>
                  </thead>
                  <tbody style={{ textAlign: "center" }}>
                    {orderTemp.map((item, index) => (
                      <tr>
                        <td>{item.itemNo}</td>
                        <td>{item.itemName}</td>
                        <td>{item.itemQuantity}</td>
                        <td>{item.preferredBrand}</td>
                        <td>{item.alternateBrand}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => {
            props.clickHandler(false, "done");
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DisplayOrderDetailsTable;
