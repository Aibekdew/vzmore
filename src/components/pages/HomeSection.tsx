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
      {/* Wrap Filter with an id that we can use for scrolling */}
      <div id="filter">
        <Filter />
      </div>
      <Whyselect />
      <OurNumbers />
      <Located />
    </div>
  );
};

export default HomeSection;
