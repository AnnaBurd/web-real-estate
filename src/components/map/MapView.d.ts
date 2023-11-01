import type { Land } from "../../model/Land";

export interface MapView extends HTMLElement {
  addPopupMarker: (land: Land) => void;
  removePopupMarker: (title: string) => void;
  removePopupMarkers: (titles: string[]) => void;

  showPopupOnMarker: (title: string) => void;
  focusOnPopupMarker: (title: string) => void;

  renderPopupMarkers: (lands: Land[]) => void;
  renderOnResize: () => void;
}
