import type { Land } from "../../model/Land";

export interface MapView extends HTMLElement {
  addPopupMarker: (land: Land) => void;
  removePopupMarker: (title: string) => void;
  removePopupMarkers: (titles: string[]) => void;

  showPopupOnMarker: (title: string) => void;
  focusOnPopupMarker: (title: string, closeOthers?: boolean) => void;

  renderPopupMarkers: (lands: Land[], favouriteLands?: string[]) => void;
  renderOnResize: () => void;
}

export type LandLocation = {
  title: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};
