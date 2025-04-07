import React from "react";
import Filter from "./HomePage/Filter";
import Contact from "./ContactPage/Contact";

const ContactSection = () => {
  return (
    <div
      style={{
        marginTop: "100px",
      }}
    >
      <Filter />
      <Contact />
    </div>
  );
};

export default ContactSection;
