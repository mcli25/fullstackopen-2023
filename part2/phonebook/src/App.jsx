import { useState } from "react";
import Filter from "./Filter";
import Persons from "./Persons";
import PersonForm from "./PersonForm";
import { useEffect } from "react";
import axios from "axios";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [filteredName, setFilteredName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    personService.getAll().then((response) => {
      console.log("promise fulfilled");

      setPersons(response.data);
    });
  }, []);
  console.log("render", persons.length, "persons");
  const Notification = ({ message }) => {
    if (message === null) {
      return null;
    }

    return <div className="error">{message}</div>;
  };
  const toggleImportanceOf = (id) => {
    const person = persons.find((n) => n.id === id);
    const changedPerson = { ...person, important: !person.important };

    personService
      .update(id, changedPerson)
      .then((response) => {
        setPersons(persons.map((p) => (p.id !== id ? p : response.data)));
      })
      .catch((error) => {
        alert(`the person '${person.name}' was already deleted from server`);
        setErrorMessage(
          `information of '${person.name}' was already deleted from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setPersons(persons.filter((n) => n.id !== id));
      });
  };

  const personsToShow = filteredName
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filteredName)
      )
    : persons;

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find((person) => person.name === newName);
    if (existingPerson && existingPerson.number === newNumber) {
      window.alert(`${newName} is already added to phonebook`);
    } else if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        personService
          .update(existingPerson.id, updatedPerson)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : response.data
              )
            );
            setNewName("");
            setNewNumber("");
            setErrorMessage(`Updated ${newName}'s number to ${newNumber}`);
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          })
          .catch((error) => {
            window.alert(
              `Failed to update the person with id ${existingPerson.id}`
            );
          });
      }
    } else {
      // setPersons([...persons, { name: newName, number: newNumber }]);
      const personObject = { name: newName, number: newNumber };

      //add person to the server
      personService.create(personObject).then((response) => {
        setPersons([...persons, response.data]);
      });

      setErrorMessage(`Added ${newName}`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }

    setNewName("");
    setNewNumber("");
  };

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    if (!person) {
      window.alert(`${newName} is already deleted in the phonebook`);
    } else {
      if (window.confirm(`delete ${person.name}?`)) {
        personService
          .deletePerson(id)
          .then((response) => {
            console.log(response);
            setPersons(persons.filter((person) => person.id !== id));
            console.log(`Person with id ${id} has been deleted successfully.`);
          })
          .catch((error) => {
            window.alert(`Failed to delete the person with id ${id}`);
          });
      }
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  const handleFilteredNameChange = (event) => {
    setFilteredName(event.target.value);
  };

  return (
    <div>
      <h1>Phonebook</h1>

      <Notification message={errorMessage} />
      <Filter
        filteredName={filteredName}
        handleFilteredNameChange={handleFilteredNameChange}
      />

      <h2>Add a new</h2>
      <PersonForm
        addPerson={addPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />

      <h2>Numbers</h2>

      <Persons
        personsToShow={personsToShow}
        toggleImportanceOf={toggleImportanceOf}
        deletePerson={deletePerson}
      />
    </div>
  );
};

export default App;
