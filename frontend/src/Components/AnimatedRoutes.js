import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import LandingPage from "./LandingPage";
import Signup from "./Signup";
import Login from "./Login";
import NoPage from "./NoPage";
import Contact from "./Contact";
import About from "./About";
import ForgotPassword from "./ForgotPassword";
import CustomerOrderPage from "./CustomerOrderPage";
import { AnimatePresence } from "framer-motion";
import MyAccount from "./MyAccount";
import UnauthorizedPage from "./UnauthorizedPage";
import ViewOrders from "./ViewOrders";
import LiveChat from "./NegotiatePrice";
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/order" element={<CustomerOrderPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/account" element={<MyAccount />} />
        <Route path="/401unauthorized" element={<UnauthorizedPage />} />
        <Route path="/orders" element={<ViewOrders />} />
        <Route path="*" element={<NoPage />} />
        <Route path="/chat" element={<LiveChat />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
