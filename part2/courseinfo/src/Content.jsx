import React from "react";
import Part from "./Part";

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((p, index) => (
        <Part part={p.name} exercises={p.exercises} key={index}></Part>
      ))}
    </div>
  );
};

export default Content;
