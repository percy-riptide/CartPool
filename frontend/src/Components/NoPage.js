import  React from 'react';
import Image from 'react-bootstrap/Image';
import logo from '../assets/404_2.png';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { motion } from 'framer-motion';


function NoPage() {
  const navigate = useNavigate();
    return (
      <>
        <motion.div className="flex-container" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          <div className="flex-child centered">
            <div style={{margin: "20px"}}>
              <h1>Did you go astray?</h1>
              <br/>
              <p style={{fontSize: "18px"}}>The Page you are trying to find isn't available 😔</p>
              <br/>
              <p style={{fontSize: "18px"}}>Maybe go back to our main page to order something? 😋</p>
              <br/>
              <Button variant="outline-info" onClick={() => navigate('/')}>Home Page</Button>
            </div>
          </div>
          <div className="flex-child centered">
            <Image src={logo} fluid></Image>
          </div>
        </motion.div>
      </>
    );
}

export default NoPage;