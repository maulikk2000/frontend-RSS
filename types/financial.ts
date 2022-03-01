import { sensitivityStatus } from "pages/financial/constants";

export type Sensitivity = {
  id: string;
  name: string;
  createdUser?: string;
  created?: Date;
  updated?: Date;
  scenarioId: string;
  region?: string;
  status?: sensitivityStatus;
  tags?: string[];
  type?: string;
  isBaseLine?: boolean;
  inputs?: SensitivityInputs;
  outputs?: SensitivityOutputs;
};

type SensitivityInputs = {
  area?: string;
  escalation?: string;
  timing?: string;
  revenue?: string;
  cost?: string;
};

type SensitivityOutputs = {
  unescalatedDCF?: string;
  escalatedDCF?: string;
};

export type Sensitivities = {
  sensitivities: Sensitivity[]
}

export type SensitivityCreate = {
    create: Sensitivity
}

export type SensitivityCreateVariables = {
  variables: {
    name: string;
    region: string;
    scenarioId: string;
    status: string;
    type: string;
    isBaseLine: boolean
  }
}

export type SensitivityUpdateVariables = {
  variables: {
    id: string;
    name?: string;
    region?: string;
    scenarioId?: string;
    status?: string;
    type?: string;
    isBaseLine?: boolean
  }
}

export type SensitivityUpdateBaselineVariables = {
  variables: {
    id: string;
    scenarioId: string;
  }
}

export type SensitivityDeleteVariables = {
  variables: {
    sensitivityid: string;
  }
}