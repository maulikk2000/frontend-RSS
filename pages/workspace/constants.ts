const workspaceNameToUserGroup = {
  "East Whisman": "EW_Group",
  "North Bayshore": "North Bayshore",
  "Moffett Park": "Moffett Park"
};

export const getUserGroupName = (workspaceName: string) => {
  return workspaceNameToUserGroup[workspaceName] ?? workspaceName;
};
