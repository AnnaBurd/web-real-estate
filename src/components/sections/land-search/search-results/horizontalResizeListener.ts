import type { MapView } from "../../../map/MapView";

let resizeHandle: HTMLElement | null;
let mapWrapper: HTMLElement | null;
let map: MapView | null;

const position = {
  x: 0,
};

const listenForHorizontalResize = () => {
  if (!getHTMLElements()) return;

  resizeHandle!.addEventListener("mousedown", handleStartDragging);
};

const getHTMLElements = () => {
  resizeHandle = document.querySelector("#resize-handle");
  mapWrapper = document.querySelector("#resizable-map-wrapper");
  map = document.querySelector("map-view");

  return resizeHandle && mapWrapper && map;
};

const handleStartDragging = (e: MouseEvent) => {
  e.preventDefault();

  position.x = e.clientX;

  document.addEventListener("mousemove", handleDragging);
  document.addEventListener("mouseup", handleEndOfDragging);
};

const handleDragging = (e: MouseEvent) => {
  e.preventDefault();

  const deltaX = position.x - e.clientX;

  position.x = e.clientX;

  mapWrapper!.style.width = `${mapWrapper!.offsetWidth + deltaX}px`;
  map?.renderOnResize();
};

const handleEndOfDragging = (e: MouseEvent) => {
  document.removeEventListener("mousemove", handleDragging);
  document.removeEventListener("mouseup", handleEndOfDragging);
};

export default listenForHorizontalResize;
