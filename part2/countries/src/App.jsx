import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

function App() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setfilteredCountries] = useState([]);
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState("");
  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountries(response.data);
        // console.log(countries);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
  };
  useEffect(() => {
    const results = countries.filter((c) =>
      c.name.common.toLowerCase().includes(query.toLowerCase())
    );
    setfilteredCountries(results);
    setCount(results.length);
  }, [query, countries]);

  const handleClick = (code) => {
    setfilteredCountries(countries.filter((c) => c.cca3 === code));
    setCount(1);
  };
  return (
    <div>
      <div>
        Find countries
        <input onChange={handleChange} />
      </div>
      {count > 10 ? (
        <div>Too many matches, specify another filter</div>
      ) : count > 1 ? (
        <ul>
          {filteredCountries.map((country) => (
            <div key={country.cca3}>
              <li>
                {country.name.common}
                <button onClick={() => handleClick(country.cca3)}>show</button>
              </li>
            </div>
          ))}
        </ul>
      ) : (
        <div>
          {" "}
          {filteredCountries.map((c) => (
            <div key={c.cca3} style={{ marginBottom: "20px" }}>
              <h1>{c.name.common}</h1>
              <p>
                <strong>Capital:</strong>{" "}
                {c.capital ? c.capital[0] : "No capital"}
              </p>
              <p>
                <strong>Area:</strong>{" "}
                {c.area ? `${c.area} km²` : "No area data"}
              </p>
              <p>
                <strong>Languages:</strong>{" "}
                {c.languages
                  ? Object.values(c.languages).join(", ")
                  : "No languages"}
              </p>
              <img
                src={c.flags.svg}
                alt={`Flag of ${c.name.common}`}
                style={{ width: "150px", height: "auto" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
