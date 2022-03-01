export const createSensitivityMutation: string = `mutation ($name: String!, $region: String!, $scenarioId: String!, $status: String!, $type: String!, $isBaseLine: Boolean!) {
  create(sensitivity: {name: $name, region: $region, scenarioId: $scenarioId, status: $status, type: $type, isBaseLine: $isBaseLine}) {
    id
    name
    region
    scenarioId
    status
    type
    updated
    isBaseLine
  }
}
`;

export const updateSensitivityMutation: string = `mutation ($id: String!, $name: String, $region: String, $scenarioId: String, $status: String, $type: String, $isBaseLine: Boolean) {
  update(sensitivity: {id: $id, name: $name, region: $region, scenarioId: $scenarioId, status: $status, type: $type, isBaseLine: $isBaseLine}) {
    id
    name
    region
    scenarioId
    status
    type
    updated
    isBaseLine
  }
}
`;

export const updateSensitivityBaselineMutation: string = `mutation ($id: String!) {
  updateBaseLine(sensitivity: {id: $id}) {
    id
    name
    region
    scenarioId
    status
    type
    updated
    isBaseLine
  }
}
`;

export const updateSensitivityStatusMutation: string = `mutation ($id: String!, $status: String) {
  updateStatus(sensitivity: {id: $id, status: $status}) {
    id
    name
    region
    scenarioId
    status
    type
    updated
    isBaseLine
  }
}
`;

export const deleteSensitivityMutation: string = `mutation($sensitivityId: String!) {
  deleteSensitivity(sensitivityId: $sensitivityId)
}
`;