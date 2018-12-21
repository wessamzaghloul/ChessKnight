import React, { Component } from "react";
import axios from "axios";
import Tile from "components/Tile/Tile";
import Knight from "components/Knight/Knight";
import classes from "./Board.module.scss";

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.renderTile = this.renderTile.bind(this);
    this.getKnightSteps = this.getKnightSteps.bind(this);
    this.url = `https://v86wed9i20.execute-api.eu-west-1.amazonaws.com/public/knight-path`;
    this.state = {
      knightPlaceCode: "a1",
      highlightedTiles: [],
      selectedTile: null,
      disableClick: false
    };
  }

  handleClick(newPlace) {
    axios
      .get(this.url, {
        params: {
          start: this.state.knightPlaceCode,
          end: newPlace
        }
      })
      .then(res => {
        const data = JSON.parse(res.data);
        const paths = data.map(item => {
          let arr = item.split("");
          arr[0] = arr[0].toLowerCase();
          item = arr.join("");
          return item;
        });
        console.log(paths);
        let cmds = [];
        cmds.push(() => {
          this.setState({ selectedTile: newPlace, disableClick: true });
        });
        for (let i = 0; i < paths.length - 1; i++) {
          let steps = this.getKnightSteps(paths[i], paths[i + 1]);
          cmds.push(() => {
            this.setState({ highlightedTiles: [paths[i], ...steps] });
          });
          for (let j = 0; j < steps.length; j++) {
            cmds.push(() => {
              this.setState({ knightPlaceCode: steps[j] });
            });
          }
          cmds.push(() => {
            this.setState({ highlightedTiles: [] });
          });
        }
        cmds.push(() => {
          this.setState({ selectedTile: null, disableClick: false });
        });
        setInterval(() => {
          let cmd = cmds.shift();
          if (cmd) cmd();
        }, 500);
      });
  }

  renderTile(i, knightPlaceCode) {
    const x = i % 8;
    const y = Math.floor(i / 8);
    const knightCoordinates = getCoordinatesFromPlaceCode(knightPlaceCode);
    const knightX = knightCoordinates[0];
    const knightY = knightCoordinates[1];
    const hasKnight = x === knightX && y === knightY;
    const isDark = (x + y) % 2 === 1;
    const piece = hasKnight ? <Knight /> : null;
    const tilePlaceCode = getPlaceCode([x, y]);
    return (
      <Tile
        key={i}
        isDark={isDark}
        place={tilePlaceCode}
        isHighlighted={this.state.highlightedTiles.includes(tilePlaceCode)}
        isSelected={this.state.selectedTile === tilePlaceCode}
        isDisabled={this.state.disableClick}
        onClick={() => this.handleClick(tilePlaceCode)}
      >
        {piece}
      </Tile>
    );
  }
  getKnightSteps(oldPlace, newPlace) {
    const oldPAr = getCoordinatesFromPlaceCode(oldPlace);
    const oldPX = oldPAr[0];
    const oldPY = oldPAr[1];

    const newPAr = getCoordinatesFromPlaceCode(newPlace);
    const newPX = newPAr[0];
    const newPY = newPAr[1];

    const dx = newPX - oldPX;
    const dy = newPY - oldPY;

    let steps = [];
    let arr = [];
    if (Math.abs(dx) === 2 && Math.abs(dy) === 1) {
      if (dx > 0) {
        arr = [oldPX + 1, oldPY];
        steps.push(getPlaceCode(arr));
        arr = [oldPX + 2, oldPY];
        steps.push(getPlaceCode(arr));
      }
      if (dx < 0) {
        arr = [oldPX - 1, oldPY];
        steps.push(getPlaceCode(arr));
        arr = [oldPX - 2, oldPY];
        steps.push(getPlaceCode(arr));
      }
      steps.push(newPlace);
    }
    if (Math.abs(dy) === 2 && Math.abs(dx) === 1) {
      if (dy > 0) {
        arr = [oldPX, oldPY + 1];
        steps.push(getPlaceCode(arr));
        arr = [oldPX, oldPY + 2];
        steps.push(getPlaceCode(arr));
      }
      if (dy < 0) {
        arr = [oldPX, oldPY - 1];
        steps.push(getPlaceCode(arr));
        arr = [oldPX, oldPY - 2];
        steps.push(getPlaceCode(arr));
      }
      steps.push(newPlace);
    }

    return steps;
  }
  render() {
    const tiles = [];
    for (let i = 0; i < 64; i++) {
      tiles.push(this.renderTile(i, this.state.knightPlaceCode));
    }
    return <section className={classes.board}>{tiles}</section>;
  }
}

function getPlaceCode([x, y]) {
  return String.fromCharCode(97 + x) + parseInt(y + 1);
}
function getCoordinatesFromPlaceCode(code) {
  let array = code.split("");
  var number = array[0].charCodeAt(0) - 97 + 1;
  array.splice(0, 1, number);
  array = array.map(item => parseInt(item - 1));
  return array;
}
