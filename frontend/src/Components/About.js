import  React from 'react';
import Image from 'react-bootstrap/Image';
import logo from '../assets/aboutus.png';
import { motion } from 'framer-motion';

function About() {
    return (
      <>
        <motion.div className="flex-container" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          <div className="flex-child centered">
            <div style={{margin: "20px"}}>
              <h1>We are Cart Pool!</h1>
              <br/>
              <p style={{fontSize: "18px"}}>We were established to give you more time to do other tasks of your routine and leave getting the boring daily needs to our delivery partners</p>
              <br/>
              <p style={{fontSize: "18px"}}>The main goal is to give you back time to do something more productive and create earning opportunities for people who need it</p>        
            </div>
          </div>
          <div className="flex-child centered">
            <Image src={logo} fluid></Image>
          </div>
        </motion.div>
      </>
    );
}

export default About;