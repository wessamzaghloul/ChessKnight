import React from "react";
import classes from "./Tile.module.scss";

export default function Tile({
  place,
  isDark,
  isHighlighted,
  isSelected,
  children,
  onClick,
  isDisabled
}) {
  return (
    <button
      className={`${classes.tile} ${isDark ? classes.dark : classes.light}
        ${isHighlighted ? classes.highlighted : ""}
        ${isSelected ? classes.selected : ""}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
}
