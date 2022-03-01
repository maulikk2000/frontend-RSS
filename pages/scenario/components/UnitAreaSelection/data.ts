import { getNameFromApartmentType, getColourCodeFromUnitType } from "../../utils/apartmentUtils";

export type UnitMixOption = {
  label: string;
  groupId: string;
  min: number;
  max: number;
  minAllowed: number;
  maxAllowed: number;
  colorCode: string; //the hex value for this group
};

export const defaultUnitAreaData: Array<UnitMixOption> = [
  {
    label: getNameFromApartmentType("StMicro"),
    groupId: "StMicro",
    min: 330,
    max: 430,
    minAllowed: 330,
    maxAllowed: 430,
    colorCode: getColourCodeFromUnitType("StMicro")
  },
  {
    label: getNameFromApartmentType("ST"),
    groupId: "ST",
    min: 500,
    max: 600,
    minAllowed: 500,
    maxAllowed: 600,
    colorCode: getColourCodeFromUnitType("ST")
  },
  {
    label: getNameFromApartmentType("B1Jr"),
    groupId: "B1Jr",
    min: 500,
    max: 700,
    minAllowed: 500,
    maxAllowed: 700,
    colorCode: getColourCodeFromUnitType("B1Jr")
  },
  {
    label: getNameFromApartmentType("B1"),
    groupId: "B1",
    min: 900,
    max: 1025,
    minAllowed: 900,
    maxAllowed: 1025,
    colorCode: getColourCodeFromUnitType("B1")
  },
  {
    label: getNameFromApartmentType("B2"),
    groupId: "B2",
    min: 850,
    max: 1025,
    minAllowed: 850,
    maxAllowed: 1025,
    colorCode: getColourCodeFromUnitType("B2")
  },
  {
    label: getNameFromApartmentType("B3"),
    groupId: "B3",
    min: 1150,
    max: 1550,
    minAllowed: 1150,
    maxAllowed: 1550,
    colorCode: getColourCodeFromUnitType("B3")
  }
];
