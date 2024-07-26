import React from "react";
import Person from "./Person";
import persons from "./services/persons";
import axios from "axios";

const Persons = ({ personsToShow, toggleImportanceOf, deletePerson }) => {
  const res = personsToShow.map((person) => {
    return (
      <Person
        person={person}
        key={person.id}
        toggleImportance={() => toggleImportanceOf(person.id)}
        deletePerson={() => deletePerson(person.id)}
      ></Person>
    );
  });
  return res;
};

export default Persons;
