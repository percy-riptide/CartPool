import  React , {useState, useEffect} from 'react';
import Image from 'react-bootstrap/Image';
// import logo from '../assets/401unauthorized.png';
import logo from '../assets/401unauthorized.png';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { motion } from 'framer-motion';


function UnauthorizedPage(props) {
  const navigate = useNavigate();
    return (
      <>
        <motion.div className="flex-container" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          <div className="flex-child centered">
            <div style={{margin: "20px"}}>
              <h1>No Sneaky Beaky!</h1>
              <br/>
              <p style={{fontSize: "18px"}}>We are sorry you will have to be logged in as on of our {props.userType} to view the contents in this page!</p>
              <br/>
              <Button variant="outline-info" onClick={() => navigate('/login')}>Login</Button>
            </div>
          </div>
          <div className="flex-child centered">
            <Image src={logo} fluid></Image>
          </div>
        </motion.div>
      </>
    );
}

export default UnauthorizedPage;