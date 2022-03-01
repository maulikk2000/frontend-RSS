export const getNameFromGDVUnitType = (unitType: string): string => {
  const objects = {
    G_MicroST: "Micro Studio",
    G_ST: "Studio",
    G_Jr1Br: "Junior One Bed",
    G_1Br: "One Bed",
    G_2Br: "Two Bed",
    G_3Br: "Three Bed"
  };

  return objects[unitType] ?? getNameFromApartmentType(unitType);
};

export const getNameFromApartmentType = (unitType: string): string => {
  const objects = {
    StMicro: "Micro Studio",
    ST: "Studio",
    B1Jr: "Junior One Bed",
    B1: "One Bed",
    B2: "Two Bed",
    B3: "Three Bed"
  };

  return objects[unitType] ?? unitType;
};

export const getColourCodeFromUnitType = (unitType: string) => {
  switch (unitType) {
    case "StMicro":
      return "#A4D8A9";
    case "ST":
      return "#EFAA7A";
    case "B1Jr":
      return "#B1B5EA";
    case "B1":
      return "#EDCD7C";
    case "B2":
      return "#62CDE4";
    case "B3":
      return "#F2A3B1";
    default:
      return unitType;
  }
};

export const getUnitTypeFromApartmentTypeCharacters = (apartmentType: string) => {
  let unitType = (apartmentType[0] + apartmentType[1]).toUpperCase();
  return unitType;
};

export type OrderedUnitType = {
  unitType: string;
  order: number;
};
export const getOrderedGDVUnitTypes = (unitTypes: string[]): string[] => {
  const orderedUnitObjects: OrderedUnitType[] = [];
  for (const unitType of unitTypes) {
    switch (unitType) {
      case "G_MicroST":
        orderedUnitObjects.push({ unitType: "G_MicroST", order: 0 });
        break;
      case "G_ST":
        orderedUnitObjects.push({ unitType: "G_ST", order: 1 });
        break;
      case "G_Jr1Br":
        orderedUnitObjects.push({ unitType: "G_Jr1Br", order: 2 });
        break;
      case "G_1Br":
        orderedUnitObjects.push({ unitType: "G_1Br", order: 3 });
        break;
      case "G_2Br":
        orderedUnitObjects.push({ unitType: "G_2Br", order: 4 });
        break;
      case "G_3Br":
        orderedUnitObjects.push({ unitType: "G_3Br", order: 5 });
    }
  }
  if (orderedUnitObjects.length === 0) {
    orderedUnitObjects.push(...getOrderedEnvisionUnitTypes(unitTypes));
  }
  orderedUnitObjects.sort((a, b) => a.order - b.order);

  const orderedUnitTypes: string[] = [];
  for (const item of orderedUnitObjects) {
    orderedUnitTypes.push(item.unitType);
  }

  return orderedUnitTypes;
};

export const getOrderedEnvisionUnitTypes = (unitTypes: string[]) => {
  const orderedUnitObjects: OrderedUnitType[] = [];
  for (const unitType of unitTypes) {
    switch (getUnitTypeFromApartmentTypeCharacters(unitType)) {
      case "ST":
        orderedUnitObjects.push({ unitType, order: 0 });
        break;
      case "B1":
        orderedUnitObjects.push({ unitType, order: 1 });
        break;
      case "B2":
        orderedUnitObjects.push({ unitType, order: 2 });
        break;
      case "B3":
        orderedUnitObjects.push({ unitType, order: 3 });
    }
  }
  return orderedUnitObjects;
};
