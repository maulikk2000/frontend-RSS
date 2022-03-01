import { getScenario, updateScenario } from "api/scenarioService/scenarioApi";
import { createStore, createHook } from "react-sweet-state";
import { Vector3 } from "three";
import { Scenario } from "types/scenario";
import { SiteNoteObject, SiteNoteStoreState } from "types/siteNote";
import { getApiErrorMessage } from "utils/errorUtils";

export type SiteNoteStoreActions = typeof actions;

const initialState: SiteNoteStoreState = {
  siteNotes: []
};

const asSiteNote = (string: any) => {
  let siteNote = string;
  siteNote.points = string.points.map((point) => {
    const vec = new Vector3(point.x, point.y, point.z);
    return vec;
  });
  return siteNote;
};

const actions = {
  addSiteNote: (siteNote: SiteNoteObject, scenario: Scenario) => async ({ setState, getState }) => {
    let siteNotes = [...getState().siteNotes];
    siteNotes.push(siteNote);
    let currentScenario: any = { ...scenario };
    currentScenario.siteNotes = JSON.stringify(siteNotes);
    currentScenario = JSON.stringify(currentScenario);
    try {
      const updatedScenario = await updateScenario(currentScenario);
      const siteNotes = updatedScenario.siteNotes.map((siteNote) => asSiteNote(siteNote));
      setState({
        siteNotes: siteNotes
      });
    } catch (error) {
      let errorMessage = getApiErrorMessage(error, "Error creating a site note");
      setState({
        message: { text: errorMessage, variant: "error" }
      });
    }
  },

  getAllSiteNotes: (scenarioID: any) => async ({ setState }) => {
    try {
      const scenario = await getScenario(scenarioID);
      const siteNotes = scenario.siteNotes.map((siteNote: any) => {
        siteNote.points = siteNote.points.map((point) => {
          const vec = new Vector3(point.x, point.y, point.z);
          return vec;
        });
        return siteNote;
      });
      setState({
        siteNotes: siteNotes
      });
    } catch (error) {
      let errorMessage = getApiErrorMessage(error, "Error getting site notes");
      setState({
        message: { text: errorMessage, variant: "error" }
      });
    }
  },

  removeSiteNote: (siteNote: SiteNoteObject, scenario: Scenario) => async ({ setState, getState }) => {
    const siteNotes: SiteNoteObject[] = getState().siteNotes;
    const newSiteNotes = siteNotes.filter((note) => note !== siteNote);
    scenario.siteNotes = newSiteNotes;
    let patchObject: any = scenario;
    patchObject.siteNotes = JSON.stringify(patchObject.siteNotes);
    patchObject = JSON.stringify(patchObject);
    try {
      const updatedScenario = await updateScenario(patchObject);
      const siteNotes = updatedScenario.siteNotes.map((siteNote) => asSiteNote(siteNote));
      setState({
        siteNotes: siteNotes
      });
    } catch (error) {
      let errorMessage = getApiErrorMessage(error, "Error getting site notes");
      setState({
        message: { text: errorMessage, variant: "error" }
      });
    }
  },

  setSiteNotes: (siteNotes: SiteNoteObject[], scenario: Scenario) => async ({ setState }) => {
    let currentScenario: any = { ...scenario };
    currentScenario.siteNotes = JSON.stringify(siteNotes);
    currentScenario = JSON.stringify(currentScenario);

    try {
      const updatedScenario = await updateScenario(currentScenario);
      const siteNotes = updatedScenario.siteNotes.map((siteNote) => asSiteNote(siteNote));
      setState({
        siteNotes: siteNotes
      });
    } catch (error) {
      let errorMessage = getApiErrorMessage(error, "Error creating a site note");
      setState({
        message: { text: errorMessage, variant: "error" }
      });
    }
  }
};

const SiteNoteStore = createStore<SiteNoteStoreState, SiteNoteStoreActions>({
  initialState,
  actions,
  name: "Site Note Store"
});

export const useSiteNoteStore = createHook(SiteNoteStore);
