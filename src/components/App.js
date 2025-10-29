
import React from "react";
import './../styles/App.css';
import Autocomplete from "./Autocomplete";


const citySuggestions = [
  "New York",
  "Newark",
  "New Orleans",
  "Los Angeles",
  "San Francisco",
  "San Jose",
  "San Diego",
  "Seattle",
  "Bengaluru",
  "Mumbai",
  "Delhi",
  "Chennai",
  "Kolkata",
  "Pune",
  "Hyderabad",
  "Ahmedabad",
  "London",
  "Paris",
  "Berlin",
  "Tokyo"
];
const App = () => {
  return (
   <div style={{ padding: 24 }}>
      <h2>Autocomplete Cities — Demo</h2>
      <Autocomplete suggestions={citySuggestions} />
    </div>
  )
}

export default App
