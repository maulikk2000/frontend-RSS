import axios from "api/axios-eli";
import { labHeaderData } from "../data/mockLabHeaderData";
import { ICreateLabFeature } from "pages/elilab/interface/ICreateLabFeature";
import { ILabFeature } from "pages/elilab/interface/ILabFeature";
import { ILabHeader } from "pages/elilab/interface/ILabHeader";
import { createHook, createStore, StoreActionApi } from "react-sweet-state";
import { messageStoreActions, MessageStoreState } from "../../../types/extensions/messageExtension";
import { getApiErrorMessage } from "utils/errorUtils";

type ElilabStore = MessageStoreState & {
  labHeader: ILabHeader;
  labFeatures: ILabFeature[];
  labFeature?: ILabFeature | null;
  sortBy: string;
  sortByType: string;
  searchString: string;
  file?: any;
};

type StoreApi = StoreActionApi<ElilabStore>;
type Actions = typeof actions;

const initialState: ElilabStore = {
  labHeader: labHeaderData,
  labFeatures: [],
  sortBy: "",
  sortByType: "",
  searchString: "",
  file: undefined
};

const actions = {
  ...messageStoreActions,
  ...{
    setLabHeader: (labHeader: ILabHeader) => ({ setState, getState }: StoreApi) => {
      setState({ ...getState(), labHeader });
    },

    setSortBy: (sortBy: string) => ({ setState, getState }: StoreApi) => {
      setState({ ...getState(), sortBy });
    },

    setSortByType: (sortByType: string) => ({ setState, getState }: StoreApi) => {
      setState({ ...getState(), sortByType });
    },

    setFileData: (file: any) => ({ setState, getState }: StoreApi) => {
      setState({ ...getState(), file });
    },

    setSearchString: (searchString: string) => ({ setState, getState }: StoreApi) => {
      setState({ ...getState(), searchString });
    },

    setLabFeatures: () => async ({ setState, getState }: StoreApi) => {
      let url = process.env.REACT_APP_ELI_LAB_SERVICE + "EliLabExperiment" || "";
      url =
        url +
        `?searchTagString=${getState().searchString ?? ""}&orderByPropertyName=${
          getState().sortBy ?? "Name"
        }&orderByType=${getState().sortByType ?? "OrderBy"}`;

      try {
        let response = await axios.get(url);

        let labFeatures = response.data;
        console.log(labFeatures);

        setState({
          ...getState(),
          labFeatures
        });
      } catch (error) {
        const errorMessage = getApiErrorMessage(error, "Error getting lab features data");
        setState({ message: { text: errorMessage, variant: "error" } });
      }
    },

    createLabFeature: (createLabFeature: ICreateLabFeature, file?: FormData) => async ({
      setState,
      getState
    }: StoreApi) => {
      let url = process.env.REACT_APP_ELI_LAB_SERVICE + "EliLabExperiment" || "";

      try {
        if (file) {
          let imageUploadUrl = process.env.REACT_APP_ELI_LAB_SERVICE + "EliLabFileUpload" || "";

          var fileUploadUrl = await axios.post(imageUploadUrl, file, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });

          createLabFeature.imagePath = fileUploadUrl.data;
        } else {
          //this is for selenium test only
          createLabFeature.imagePath = "";
        }

        let response = await axios.post(url, createLabFeature);

        let newexperimenturl = url + "/" + response.data;
        response = await axios.get(newexperimenturl);

        setState({
          labFeatures: getState().labFeatures.concat(response.data),
          message: {
            text: "A new lab feature was created successfully.",
            variant: "success"
          }
        });
      } catch (error) {
        const errorMessage = getApiErrorMessage(error, "Error creating lab features.");
        setState({ message: { text: errorMessage, variant: "error" } });
      }
    },

    setLabFeature: (labFeature: ILabFeature) => ({ setState, getState }: StoreApi) => {
      setState({ ...getState(), labFeature });
    }
  }
};

const store = createStore<ElilabStore, Actions>({
  initialState: initialState,
  actions: actions,
  name: "elilabStore"
});

export const useElilabStore = createHook(store);
