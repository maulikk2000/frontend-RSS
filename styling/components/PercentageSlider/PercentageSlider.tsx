import { useEffect, useState, ChangeEvent } from "react";
import styled from "styled-components";
import classes from "./PercentageSlider.module.scss";

const PositionedToolTip = styled.span`
  left: calc(${(props) => props["data-middle-point"]}%);
`;

const PositionedDiv = styled.div`
  left: calc(${(props) => props["data-middle-point"]}% - 25px);
`;

export interface SliderThumb {
  value: number;
  label: string;
  description?: string;
}

interface PercentageSliderProps {
  thumbs: SliderThumb[];
  sliderValueChanged?: (newValues: SliderThumb[]) => void;
}

// This percentage slider component accepts multiple slider thumbs.
// The total values of thumbs must add up to 100.
export const PercentageSlider: React.FC<PercentageSliderProps> = ({ thumbs, sliderValueChanged }) => {
  const sliderThumbColor = ["#A4D8A9", "#EDCD7C", "#62CDE4", "#F2A3B1"]; // The colors will rotate.
  const [thumbValues, setThumbValues] = useState<number[]>([]);
  const [numberOfThumbs, setNumberOfThumbs] = useState<number>(0);

  useEffect(() => {
    setThumbValues(thumbs.map((t) => t.value));
    setNumberOfThumbs(thumbs.length);
  }, [thumbs]);

  const handleRangeValueChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    let cancelEvent = false;
    let newRangeValue = parseInt(event.target.value);

    if (index === numberOfThumbs - 1) {
      // Cannot move the last thumb
      cancelEvent = true;
    } else {
      const rangeMin = index === 0 ? 0 : sumOfThumbsToIndex(index - 1);
      const rangeMax = sumOfThumbsToIndex(index + 1);

      if (newRangeValue < rangeMin || newRangeValue > rangeMax) {
        cancelEvent = true;
      }
    }

    if (cancelEvent) {
      event.stopPropagation();
      return;
    }

    let newThumbValueArray = [...thumbValues];
    newThumbValueArray[index] = newRangeValue - (index === 0 ? 0 : sumOfThumbsToIndex(index - 1));
    newThumbValueArray[index + 1] = thumbValues[index + 1] + sumOfThumbsToIndex(index) - newRangeValue;

    setThumbValues(newThumbValueArray);
    if (!!sliderValueChanged) {
      sliderValueChanged(
        newThumbValueArray.map((value, index) => ({
          label: thumbs[index].label,
          value
        }))
      );
    }
  };

  const sumOfThumbsToIndex = (sumToIndex: number): number => {
    return thumbValues.length === 0
      ? 0
      : thumbValues.reduce(
          (accumulator, currentValue, currentIndex) => accumulator + (currentIndex <= sumToIndex ? currentValue : 0)
        );
  };

  return (
    <div className={classes.percentageSlider}>
      {thumbs.map((thumb, index) => {
        const currentRangeValue = sumOfThumbsToIndex(index);
        const middlePositionPercent =
          "" +
          (index === 0
            ? 50
            : 100 * (sumOfThumbsToIndex(index - 1) / currentRangeValue + thumbValues[index] / (currentRangeValue * 2)));
        const thumbLabelTrimmed = thumb.label.replaceAll(/\s/g, "");
        return (
          <div className={classes.subSliderWrapper} key={"subSlider" + thumbLabelTrimmed}>
            <input
              type="range"
              min={0}
              max={100}
              step="1"
              value={currentRangeValue}
              key={"thumb" + thumbLabelTrimmed}
              className={classes.subSlider}
              onChange={(e) => handleRangeValueChange(e, index)}
            />
            <div
              className={classes.lowerTrack}
              style={{
                width: currentRangeValue + "%",
                zIndex: numberOfThumbs - index,
                backgroundColor: sliderThumbColor[index % sliderThumbColor.length]
              }}
              key={"track" + thumbLabelTrimmed}
            >
              <PositionedToolTip data-middle-point={middlePositionPercent} className={classes.tooltip}>
                {thumb.description}
              </PositionedToolTip>
              <PositionedDiv data-middle-point={middlePositionPercent} className={classes.thumbValue}>
                {thumbValues[index] + "%"}
              </PositionedDiv>
              <PositionedDiv data-middle-point={middlePositionPercent} className={classes.thumbLabel}>
                {thumb.label}
              </PositionedDiv>
            </div>
          </div>
        );
      })}
    </div>
  );
};
