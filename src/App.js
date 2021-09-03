import "./App.css";

import React from "react";
import MovieList from "./components/MovieList";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <Header></Header>
      <MovieList></MovieList>
    </div>
  );
}
export default App;
