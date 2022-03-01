import React from "react";
import classes from "./ConfiguredInputMetrics.module.scss";

type Props = {
  title: string;
  stateRef: React.MutableRefObject<any>;
  stateValue: any;
  setStateValue: any;
  min?: number;
  max?: number;
  handleCommit: (e, val: any) => any;
  disabled?: boolean;
  unit: string;
};

export const ConfiguredInputMetrics = ({
  title,
  stateRef,
  min,
  max,
  handleCommit,
  stateValue,
  setStateValue,
  disabled,
  unit
}: Props) => {
  const handleCommitInput = (e, val: number) => {
    if (min && val < min) {
      val = min;
    }
    if (max && val > max) {
      val = max;
    }
    stateRef.current.value = val;
    setStateValue(val);
    handleCommit(e, val);
  };

  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <div className={classes.title}>{title}</div>
      </div>
      <div className={classes.right}>
        <button
          onClick={(e) => handleCommitInput(e, parseFloat(stateValue) - 1)}
          disabled={disabled}
          className={classes.decrementer}
          data-cy={"Decrement " + title}
        >
          -
        </button>
        <input
          type={"text"}
          min={min}
          max={max}
          defaultValue={stateValue!.toFixed(2) + " " + unit}
          disabled={disabled}
          className={classes.number_input + " " + classes.medium}
          onBlur={(e) => handleCommitInput(e, parseFloat(e.target.value))}
          ref={stateRef}
          data-cy={"Input " + title}
        />
        <button
          onClick={(e) => handleCommitInput(e, parseFloat(stateValue) + 1)}
          disabled={disabled}
          className={classes.incrementer}
          data-cy={"Increment " + title}
        >
          +
        </button>
      </div>
    </div>
  );
};
