// import noSearchIcon from "../assets/noSearchIcon.png";
const noSearchIcon = require("../assets/noSearchIcon.png");

export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}

export function noSearchDataImage() {
  return noSearchIcon;
}
