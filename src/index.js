import React from "react";
import ReactDOM from "react-dom";
import Board from "./components/Board/Board";
import "./styles/index.scss";

ReactDOM.render(
  <main>
    <h1>Chess Knight Moves</h1>
    <p>Click a tile and see how the knight gonna make it !</p>
    <Board/>
  </main>,
  document.getElementById("root")
);
