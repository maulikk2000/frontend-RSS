import { gql, useMutation, useQuery } from "@apollo/client";
import { useMessageBar } from "hooks/useSnackbarMessage";
import {
  createSensitivityMutation,
  deleteSensitivityMutation,
  updateSensitivityBaselineMutation,
  updateSensitivityMutation,
  updateSensitivityStatusMutation
} from "pages/financial/queries/sensitivityMutation";
import { getSensitivityQuery } from "pages/financial/queries/sensitivityQuery";
import React, { useState } from "react";
import { ReactComponent as PlusIcon } from "styling/assets/icons/plusIcon.svg";
import { Button } from "styling/components/Button/Button";
import { Sensitivities, Sensitivity, SensitivityCreate, SensitivityCreateVariables } from "types/financial";
import CreateSensitivity from "../CreateSensitivity/CreateSensitivity";
import { SensitivityListItem } from "../SensitivityListItem/SensitivityListItem";
import classes from "./SensitivityList.module.scss";

type SensitivityListProps = {
  updateSensitivity: (sensitivity: Sensitivity) => void;
};

export const SensitivityList = ({ updateSensitivity }) => {
  const viewSingleText = "Compare Assessment";
  const [buttonText, setButtonText] = useState<string>(viewSingleText);
  const [openCreateSensitivity, setOpenCreateSensitivity] = useState<boolean>(false);
  const [activeListItem, setActiveListItem] = useState<string>("");
  const showMessageBar = useMessageBar();

  const { loading: queryLoading, error: queryError, data, refetch } = useQuery<Sensitivities>(gql(getSensitivityQuery));
  const [create, { loading: mutationCreateLoading, error: mutationCreateError }] = useMutation<SensitivityCreate>(
    gql(createSensitivityMutation)
  );
  const [
    updateBaseLine,
    { loading: mutationUpdateBaselineLoading, error: mutationUpdateBaseLineError }
  ] = useMutation<Sensitivity>(gql(updateSensitivityBaselineMutation));
  const [update, { loading: mutationUpdateLoading, error: mutationUpdateError }] = useMutation<Sensitivity>(
    gql(updateSensitivityMutation)
  );
  const [
    updateStatus,
    { loading: mutationUpdateStautsLoading, error: mutationUpdateStatusError }
  ] = useMutation<Sensitivity>(gql(updateSensitivityStatusMutation));
  const [deleteSensitivity, { loading: mutationDeleteLoading, error: mutationDeleteError }] = useMutation(
    gql(deleteSensitivityMutation)
  );

  const handleCreateNewSensitivity = () => {
    setOpenCreateSensitivity(true);
  };

  const updateActiveListItem = (sensitivityId: string) => {
    setActiveListItem(sensitivityId);
  };

  const onDelete = async (e: MouseEvent, sensitivityId: string) => {
    try {
      await deleteSensitivity({
        variables: {
          sensitivityId: sensitivityId
        }
      });
    } catch (error) {
      showMessageBar({
        text: `Failed to delete Financial Feasibility`,
        variant: "error"
      });
    }

    refetch();
  };

  const handleCreate = async (createVariables: SensitivityCreateVariables) => {
    try {
      const sensitivity = await create(createVariables);
      if (createVariables.variables.isBaseLine) {
        await updateBaseLine({
          variables: {
            id: sensitivity?.data?.create.id
          }
        });
      }
      setOpenCreateSensitivity(false);
    } catch (error) {
      showMessageBar({
        text: `Failed to create Financial Feasibility`,
        variant: "error"
      });
    }
    refetch();
  };

  const handleSelect = (sensitivity: Sensitivity) => {
    updateSensitivity(sensitivity);
  };

  const callBack = () => {
    setOpenCreateSensitivity(false);
  };

  const handleChangeStatus = async (e: MouseEvent, sensitivityId: string) => {
    const sensitivity = data?.sensitivities.find((x) => x.id === sensitivityId);
    const status = sensitivity?.status === "InProgress" ? "Completed" : "InProgress";
    try {
      await updateStatus({
        variables: {
          id: sensitivity?.id,
          status: status
        }
      });
    } catch (error) {
      showMessageBar({
        text: `Failed to update Financial Feasibility status`,
        variant: "error"
      });
    }
    refetch();
  };

  const handleChangeBaseLine = async (e: MouseEvent, sensitivityId: string) => {
    try {
      await updateBaseLine({
        variables: {
          id: sensitivityId,
          isBaseLine: true
        }
      });
    } catch (error) {
      showMessageBar({
        text: `Failed to update Financial Feasibility baseline`,
        variant: "error"
      });
    }
    refetch();
  };

  if (queryLoading) return <div className={classes.sensitivityListWrapper}>Loading...</div>;
  if (queryError) return <div className={classes.sensitivityListWrapper}>Error :(</div>;

  return (
    <div className={classes.sensitivityListWrapper}>
      <div className={classes.backButton}></div>
      <h1>Financial Feasibility Assessment</h1>
      <p>Select from the list of Financial Feasibility Assessments to view or edit.</p>
      <div className={classes.content}>
        <div className={classes.list}>
          {data &&
            data?.sensitivities.map((sensitivity, i) => {
              return (
                <SensitivityListItem
                  key={sensitivity.id}
                  sensitivity={sensitivity}
                  onDelete={(e) => onDelete(e, sensitivity.id)}
                  activeListItem={activeListItem}
                  updateActiveListItem={updateActiveListItem}
                  handleSelect={handleSelect}
                  handleChangeStatus={handleChangeStatus}
                  handleChangeBaseLine={handleChangeBaseLine}
                />
              );
            })}
        </div>
        <div className={classes.listItem} onClick={handleCreateNewSensitivity}>
          <div>
            <PlusIcon className={classes.createScenarioIcon}></PlusIcon>
            <label className={classes.createScenarioLabel}>Create New Assessment</label>
            <br />
          </div>
        </div>
      </div>
      <div className={classes.cta}>
        <Button classType="primary">{buttonText}</Button>
      </div>
      {openCreateSensitivity && (
        <CreateSensitivity createSensitivity={handleCreate} callBack={callBack}></CreateSensitivity>
      )}
    </div>
  );
};
