import React from "react";
import Welcome from "./HomePage/Welcome";
import Filter from "./HomePage/Filter";
import Whyselect from "./HomePage/Whyselect";
import OurNumbers from "./HomePage/OurNumbers";
import Located from "./HomePage/Located";
import Register from "./RegisterPage/Register";

const HomeSection = () => {
  return (
    <div>
      <Welcome />
      <Filter />
      <Whyselect />
      <OurNumbers />
      <Located />
      {/* <Register /> */}
    </div>
  );
};

export default HomeSection;
