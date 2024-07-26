import React from "react";
import Header from "./Header";
import Content from "./Content";
import Total from "./Total";

const Course = ({ courses }) => {
  return (
    <div>
      {courses.map((c, index) => (
        <>
          <Header title={c.name}></Header>
          <Content parts={c.parts}></Content>
          <Total parts={c.parts}></Total>
        </>
      ))}
    </div>
  );
};

export default Course;
