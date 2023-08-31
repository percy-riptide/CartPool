import { useState , useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function NavigationBar(props) {
  const [user,setUser] = useState(props.user);
  const [userType,setUserType] = useState(props.userType);
  useEffect(() => {
    const storedUser = window.sessionStorage.getItem("username");
    if (storedUser) {
      setUser(storedUser);
    }
    const storedUserType = window.sessionStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, [user, userType]);
  return (
      <Navbar bg="white" expand="lg" sticky="top">
        <div className='container-fluid'>
          <Navbar.Brand as={Link} to="/"><img alt="" src={logo} width="30" height="30" className="d-inline-block align-top"/>{' '}Cart Pool</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className='text-center'>
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/about">About Us</Nav.Link>
              <Nav.Link as={Link} to="/contact">Support</Nav.Link>
              {userType === "customers" &&  <Nav.Link as={Link} to="/order">New Order</Nav.Link>}
              {userType === "shoppers" &&  <Nav.Link as={Link} to="/orders">View Orders</Nav.Link>}
              {(userType === "customers" || userType === "shoppers") &&  <Nav.Link as={Link} to="/account">Account</Nav.Link>}
              {(user===null||user==="") &&  <Nav.Link as={Link} to="/login">Login</Nav.Link>}
              {(user===null||user==="") && <Nav.Link as={Link} to="/Signup">Sign up</Nav.Link>}
              </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
  );
}

export default NavigationBar;