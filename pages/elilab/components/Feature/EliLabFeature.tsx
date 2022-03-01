import { FC, ChangeEvent } from "react";
import classes from "../../EliLabPage.module.scss";
import { ILabFeature } from "pages/elilab/interface/ILabFeature";
import { useElilabStore } from "../../stores/eliLabStore";

import EliLabFeatureDetail from "./EliLabFeatureDetail";

interface IEliLabFeatureProps {
  features: ILabFeature[];
  handleSelectChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const EliLabFeature: FC<IEliLabFeatureProps> = ({ features, handleSelectChange, handleSearchChange }) => {
  const [state] = useElilabStore();

  return (
    <div>
      <div className={classes.searchSection}>
        <input
          type="text"
          className={classes.search}
          value={state.searchString}
          placeholder="Search"
          onChange={handleSearchChange}
          id="search"
        />

        <select id="cars" className={classes.droplist} onChange={handleSelectChange}>
          <option value="Name">Alphabetical (Ascending)</option>
          <option value="Name OrderByDescending">Alphabetical (Descending)</option>
          <option value="DateCreated">Date Created (Ascending)</option>
          <option value="DateCreated OrderByDescending">Date Created (Descending)</option>
          <option value="DateLastUpdated">Date Modified (Ascending)</option>
          <option value="DateLastUpdated OrderByDescending">Date Modified (Descending)</option>
        </select>
      </div>
      <div className={classes.grid}>
        {features.map((feature, index) => (
          <div id={feature.name}>
            <EliLabFeatureDetail feature={feature}></EliLabFeatureDetail>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EliLabFeature;
