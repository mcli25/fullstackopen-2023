import React from "react";

const Person = ({ person, toggleImportance, deletePerson }) => {
  const label = person.important ? "make not important" : "make important";

  return (
    <li key={person.id}>
      {person.name}: {person.number}
      <button onClick={deletePerson}>delete</button>
      <button onClick={toggleImportance}>{label}</button>
    </li>
  );
};

export default Person;
