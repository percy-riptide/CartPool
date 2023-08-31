import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import "../App.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { BsArrowReturnRight } from "react-icons/bs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FinalDeliveryFeeModal from "./FinalDeliveryFeeModal";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

firebase.initializeApp({
// your firebase settings go here
});

const firestore = firebase.firestore();

function LiveChat(props) {
  const [currentUser, setCurrentUser] = useState();
  const [isChatEnded, setIsChatEnded] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [amount, setAmount] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(props.details);
    if (props.details.chatWith === window.sessionStorage.getItem("username")) {
      setShowButtons(true);
    }
  }, []);

  const deleteMessages = () => {
    if (amount) {
      firebase
        .firestore()
        .collection("messages_" + currentUser.sessionKey)
        .get()
        .then((querySnapshot) => {
          querySnapshot.docs.forEach((obj) => {
            obj.ref.delete();
          });
        });
      updateStatusInFirebase();
      deleteChatWithData();
      deleteChatMetadata();
    } else {
      setOpenModal(true);
    }
  };

  const deleteChatWithData = () => {
    firebase
      .firestore()
      .collection("chatWith")
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach((obj) => {
          obj.ref.delete();
        });
      });
  };

  const updateStatusInFirebase = () => {
    const collectionRef = firestore.collection(
      "status_" + currentUser.sessionKey
    );
    collectionRef
      .get()
      .then((snapshot) => {
        if (snapshot.size === 1) {
          const documentRef = snapshot.docs[0].ref;
          documentRef
            .update({
              status: "ended",
            })
            .then(() => {
              console.log("Document updated successfully");
            })
            .catch((error) => {
              console.error("Error updating document:", error);
            });
        } else {
          console.error("There is more than one document in the collection");
        }
      })
      .catch((error) => {
        console.error("Error getting documents:", error);
      });
  };

  const deleteChatMetadata = () => {
    const apiBody = {
      table: "chatMetadata",
      attribute: "session_key",
      value: currentUser.sessionKey,
      operator: "=",
    };

    axios
      .post("delete", apiBody)
      .then((response) => {})
      .catch((error) => {
        if (error) {
          console.log("Error deleting chat metadata.");
        }
      });
  };

  const clearUI = () => {
    setIsChatEnded(true);
    firebase
      .firestore()
      .collection("status_" + currentUser.sessionKey)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach((obj) => {
          obj.ref.delete();
        });
      });
  };

  const handleModal = (showModal, status, amount) => {
    if (!showModal) {
      setOpenModal(false);
    }
    if (status === "done") {
      setAmount(amount);
      window.sessionStorage.setItem("deliveryFee", amount);
      if (amount) {
        saveDeliveryFeeToDatabase(amount);
      }
    }
  };

  const saveDeliveryFeeToDatabase = async (deliveryFee) => {
    const apiBody = {
      table: "orders",
      attribute: "order_id",
      value: currentUser.orderId,
      operator: "=",
      setValues: {
        delivery_fee: deliveryFee,
      },
    };

    await axios
      .post("update", apiBody)
      .then((response) => {})
      .catch((error) => {
        if (error) {
          console.log("Error updating delivery fee.");
        }
      });
  };

  return (
    <>
      {openModal && (
        <div>
          <FinalDeliveryFeeModal clickHandler={handleModal} />
        </div>
      )}
      {isChatEnded && (
        <>
          <div className="chatEnded">Chat has been ended</div>
          <div style={{ textAlign: "center" }}>
            Click{" "}
            <a href="" onClick={() => navigate("/account")}>
              here
            </a>{" "}
            to navigate back
          </div>
        </>
      )}
      {!isChatEnded && (
        <div>
          <Container
            className="sticky-top"
            style={{
              maxWidth: "100%",
              padding: "2% 2% 2% 2%",
              background: "lightgrey",
            }}
          >
            <Row>
              <Col>
                <span>
                  <span className="header d-flex flex-row bd-highlight">
                    Live Chat
                  </span>
                </span>
              </Col>

              {showButtons && (
                <Col style={{ textAlign: "end" }}>
                  <Button
                    variant="primary"
                    style={{ marginRight: "0px", fontStyle: "italic" }}
                    onClick={() => {
                      setOpenModal(true);
                    }}
                  >
                    Confirm Delivery Fee
                  </Button>
                  <Button
                    variant="danger"
                    style={{
                      marginLeft: "2%",
                      marginRight: "0px",
                      fontStyle: "italic",
                    }}
                    onClick={deleteMessages}
                  >
                    End Chat
                  </Button>
                </Col>
              )}
            </Row>
          </Container>
          {!showButtons && (
            <div
              style={{
                textAlign: "center",
                fontStyle: "italic",
                color: "dimgrey",
                marginTop: "1%",
              }}
            >
              Send a message to start a conversation. Once you send a message,
              the receiver will be notified.
            </div>
          )}
          <div>{currentUser?.uid && <ChatRoom />}</div>
        </div>
      )}
    </>
  );

  function ChatRoom() {
    const dummy = useRef();

    const chatWithRef = firestore.collection("chatWith");
    let chatWithQuery = chatWithRef.limit(2);
    let [chatWith] = useCollectionData(chatWithQuery, { idField: "id" });

    const statusRef = firestore.collection("status_" + currentUser.sessionKey);
    let statusQuery = statusRef.limit(2);
    let [status] = useCollectionData(statusQuery, { idField: "id" });

    const messagesRef = firestore.collection(
      "messages_" + currentUser.sessionKey
    );
    let query = messagesRef.orderBy("createdAt").limit(1000);
    let [messages] = useCollectionData(query, { idField: "id" });

    if (!messages?.length && status && status[0]?.status === "ended") {
      clearUI();
    }

    const [formValue, setFormValue] = useState("");

    const sendMessage = async (e) => {
      e.preventDefault();

      if (!chatWith?.length) {
        await chatWithRef.add({
          chatWith: currentUser.chatWith,
        });
      }

      if (!status?.length) {
        await statusRef.add({
          status: "live",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          delivered: new Date().toLocaleString().slice(10, 20),
          uid: currentUser.uid,
          key: currentUser.sessionKey,
        });
      }

      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        delivered: new Date().toLocaleString().slice(10, 20),
        uid: currentUser.uid,
        key: currentUser.sessionKey,
      });

      setFormValue("");
      dummy.current.scrollIntoView({ behavior: "smooth" });
    };

    return (
      <>
        <div style={{ padding: "2%", marginBottom: "calc(120px + 10%)" }}>
          <main>
            {messages &&
              messages.map((msg) => (
                <ChatMessage key={msg.delivered} message={msg} />
              ))}

            <span ref={dummy}></span>
          </main>
        </div>
        <div>
          <form className="live-chat-form" onSubmit={sendMessage}>
            <input
              className="live-chat-input"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="say something nice"
            />

            <button
              className="live-chat-form-button"
              type="submit"
              disabled={!formValue}
            >
              <BsArrowReturnRight />
            </button>
          </form>
        </div>
      </>
    );
  }

  function ChatMessage(props) {
    const { text, uid } = props.message;
    const messageClass = uid === currentUser.uid ? "sent" : "received";

    return (
      <>
        <div
          className={`message ${messageClass}`}
          style={{ marginBottom: "3%", marginTop: "3%" }}
        >
          <div
            style={{
              position: "absolute",
              marginTop: "calc(2vh + 4%)",
              marginRight: "1%",
              marginLeft: "1%",
              fontSize: "12px",
              fontStyle: "italic",
            }}
          >
            {uid === currentUser.uid ? "You" : uid},&nbsp;
            {props.message.delivered}
          </div>
          <div>
            <p className="live-chat-para">{text}</p>
          </div>
        </div>
      </>
    );
  }
}

export default LiveChat;

// //for live chat on customer side start
// import Badge from "react-bootstrap/Badge";
// import firebase from "firebase/compat/app";
// import "firebase/compat/firestore";
// import { useCollectionData } from "react-firebase-hooks/firestore";
// firebase.initializeApp({
//   apiKey: "AIzaSyCH30prgjcBPpIW4SV5hZoGRuC57pf53H8",
//   authDomain: "cartpool-live-chat.firebaseapp.com",
//   projectId: "cartpool-live-chat",
//   storageBucket: "cartpool-live-chat.appspot.com",
//   messagingSenderId: "939710594363",
//   appId: "1:939710594363:web:525db7187affaba76bcb1e",
//   measurementId: "G-Y1F1WX9XY3",
// });
// const firestore = firebase.firestore();
// //for live chat on customer side end

// //for live chat on customer side start
// const [showBellIcon, setShowBellIcon] = useState(false);
// const chatWithRef = firestore.collection("chatWith");
// let chatWithQuery = chatWithRef.limit(2);
// let [chatWith] = useCollectionData(chatWithQuery, { idField: "id" });
// if (!showBellIcon) {
//   if (
//     chatWith?.length &&
//     chatWith[0].chatWith === window.sessionStorage.getItem("username")
//   ) {
//     setShowBellIcon(true);
//   }
// }
// //for live chat on customer side end

// {/* for live chat on customer side */}
// {showBellIcon && (
//   <>
//     <Button variant="primary">
//       New message{" "}
//       <Badge
//         style={{
//           backgroundColor: "white !important",
//           color: "blue",
//         }}
//       >
//         1+
//       </Badge>
//       <span className="visually-hidden">unread messages</span>
//     </Button>
//   </>
// )}
// {!showBellIcon && (
//   <>
//     <Button variant="outline-secondary" disabled="true">
//       No unread messages
//     </Button>
//   </>
// )}
// {/* for live chat on customer side ends */}
