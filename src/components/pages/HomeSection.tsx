import React from "react";
import Welcome from "./HomePage/Welcome";
import Filter from "./HomePage/Filter";
import Whyselect from "./HomePage/Whyselect";
import OurNumbers from "./HomePage/OurNumbers";
import Located from "./HomePage/Located";

const HomeSection = () => {
  return (
    <div>
      <Welcome />
      <Filter />
      <Whyselect />
      <OurNumbers />
      <Located />
    </div>
  );
};

export default HomeSection;
