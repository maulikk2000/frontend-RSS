import { Vector3 } from "three";

export type SiteNoteObject = {
  points: Vector3[];
  label: string;
};

export type SiteNoteStoreState = {
  siteNotes: SiteNoteObject[];
};
