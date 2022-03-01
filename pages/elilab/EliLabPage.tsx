import { useMessageBar } from "hooks/useSnackbarMessage";
import { FC, useEffect } from "react";
import { useElilabStore } from "./stores/eliLabStore";
import { PageContainer } from "../../styling/components/Layout/PageContainer/PageContainer";
import EliLabHeader from "./components/EliLabHeader/EliLabHeader";
import EliLabFeature from "./components/Feature/EliLabFeature";
import classes from "./EliLabPage.module.scss";

const EliLabPage: FC = () => {
  const [state, actions] = useElilabStore();
  const showMessageBar = useMessageBar();
  useEffect(() => {
    actions.setLabFeatures();
  }, [actions, state.searchString, state.sortBy, state.sortByType]);

  const handleSelectChange = (event) => {
    let val = event?.target.value;
    val = val.split(" ");

    actions.setSortBy(val[0]);
    actions.setSortByType(val[1] ?? "OrderBy");

    console.log(val);
  };

  const handleSearchChange = (event) => {
    const val = event.target.value;
    actions.setSearchString(val);
    console.log(val);
  };

  useEffect(() => {
    if (state.message) {
      showMessageBar(state.message);
      actions.setMessageState();
    }
  }, [actions, showMessageBar, state.message]);

  return (
    <PageContainer noHeader={true}>
      <div className={classes.wrapper}>
        <EliLabHeader></EliLabHeader>
        <EliLabFeature
          features={state.labFeatures}
          handleSelectChange={handleSelectChange}
          handleSearchChange={handleSearchChange}
        ></EliLabFeature>
      </div>
    </PageContainer>
  );
};

export default EliLabPage;
