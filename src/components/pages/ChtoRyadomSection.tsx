import React from "react";
import ChtoRyadom from "./ChtoRyadom/ChtoRyadom";
import Filter from "./HomePage/Filter";

const ChtoRyadomSection = () => (
  <div
    style={{
      marginTop: "100px",
    }}
  >
    <Filter />
    <ChtoRyadom />
  </div>
);

export default ChtoRyadomSection;
