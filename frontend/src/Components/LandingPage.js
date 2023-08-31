import  React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { useNavigate } from "react-router-dom";
import logo from '../assets/landingpage.png';
import { motion } from 'framer-motion';

function LandingPage() {
  const [user,setUser] = useState('');
  const [userType,setUserType] = useState('');
  useEffect(() => {
    const storedUser = window.sessionStorage.getItem("username");
    if (storedUser) {
      setUser(storedUser);
    }
    const storedUserType = window.sessionStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);
  const handleLogout = () => {
    window.sessionStorage.clear();
    navigate("/");
    window.location.reload();
  }
  const navigate = useNavigate();
    return (
      <>
        <motion.div className="flex-container" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          <div className="flex-child centered">
            {(user!=="") && <>
            <div style={{margin: "20px"}}>
              <h1>Welcome back {user}!</h1>
              <br/>
              <p style={{fontSize: "18px"}}>Hope you are doing well!</p>
              <br/>
              <p style={{fontSize: "18px"}}>We hope you enjoy using our application!</p>
              <br/>
              {userType === "customers" && <><Button variant="outline-success" onClick={() => navigate('/order')}>New Order</Button>{' '}</>}
              {userType === "shoppers" && <><Button variant="outline-success" onClick={() => navigate('/orders')}>View Orders</Button>{' '}</>}
              <Button variant="outline-success" onClick={handleLogout}>Log out</Button>
            </div>
            </>}
            {(user==="") && <>
            <div style={{margin: "20px"}}>
              <h1>Get your daily needs delivered to you from the comfort of your home with Cart Pool!</h1>
              <br/>
              <p style={{fontSize: "18px"}}>Cart Pool is a completely peer to peer delivery system where people buying for themselves can buy your items for you. At a very small fee you can get your daily needs and other necessities from the comfort of your house! All you need to do is create the list of the items that you need and submit it, one of our delivery partners will pick up your order and deliver it to you!</p>
              <br/>
              <p style={{fontSize: "18px"}}>You can also become a delivery partner to buy stuff for other people and earn for your efforts!</p>
              <br/>
              <Button variant="outline-success" onClick={() => navigate('/login')}>Login</Button>{' '}
              <Button variant="outline-success" onClick={() => navigate('/signup')}>Signup</Button>
            </div>
            </>}
            </div>
          <div className="flex-child centered">
            <Image src={logo} fluid></Image>
          </div>
        </motion.div>
      </>
    );
}

export default LandingPage;