import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import LiveChat from "./LiveChat";
import UnauthorizedPage from "./UnauthorizedPage";


const Negotiation = () => {
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${window.sessionStorage.getItem("token")}`;

  let key = (Math.random() + 1).toString(36).substring(2);

  const [dataReceivedFromApi, setDataReceivedFromApi] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const storedUsername = window.sessionStorage.getItem("username");

  const { state } = useLocation();
  const props = state;

  const removeDeliveryFeeFromDatabase = async () => {
    const apiBody = {
      table: "orders",
      attribute: "order_id",
      value: props.orderId,
      operator: "=",
      setValues: {
        delivery_fee: null,
      },
    };
    await axios
      .post("update", apiBody)
      .then((response) => {})
      .catch((error) => {});
  };

  const getSessionKey = async () => {
    const apiBody = {
      table: "chatMetadata",
      attribute: "initiated_by",
      value: storedUsername,
      operator: "=",
      operation: "liveChat",
    };
    await axios
      .post("fetch", apiBody)
      .then((response) => {
        setChatMDT(response.data[0]);
        setDataReceivedFromApi(true);
      })
      .catch((error) => {
        if (error) {
          checkIfUserIsReceiver();
        }
      });
  };

  const checkIfUserIsReceiver = async () => {
    const apiBody = {
      table: "chatMetadata",
      attribute: "chat_with",
      value: storedUsername,
      operator: "=",
      operation: "liveChat",
    };
    await axios
      .post("fetch", apiBody)
      .then((response) => {
        setChatMDT(response.data[0]);
        setDataReceivedFromApi(true);
      })
      .catch((error) => {
        if (error) {
          createChatMDT();
        }
      });
  };

  const setChatMDT = (response) => {
    let chatMDT = response;
    if (chatMDT.session_key) {
      setCurrentUser({
        uid: window.sessionStorage.getItem("username"),
        key: key,
        chatWith: chatMDT.chat_with,
        sessionKey: chatMDT.session_key,
        orderId: chatMDT.order_id,
      });
    }
  };

  const createChatMDT = async () => {
    const apiBody = {
      table: "chatMetadata",
      setValues: {
        chat_with: props.chatWith,
        initiated_by: storedUsername,
        session_key: key,
        order_id: props.orderId,
      },
    };
    await axios
      .post("create", apiBody)
      .then((response) => {
        setChatMDT(apiBody.setValues);
        setDataReceivedFromApi(true);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    removeDeliveryFeeFromDatabase();
    getSessionKey();
  }, []);

  return (
    <>
    {window.sessionStorage.getItem("username") ?
    <>
    
    {dataReceivedFromApi && currentUser && (
      <>
        <LiveChat details={currentUser} />
      </>
    )}
    </>:<UnauthorizedPage userType="customers" />
    
}
    </>
  );
};

export default Negotiation;
