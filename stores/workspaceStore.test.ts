import { useWorkspaceStore } from "./workspaceStore";
import { getWorkspaces } from "../api/scenarioService/scenarioApi";
import { renderHook, act } from "@testing-library/react-hooks";
import { ApiCallState } from "../types/common";
import { FormattingEnum } from "utils/constants";
import { WorkspaceUnitSystem } from "types/workspace";

jest.mock("../api/scenarioService/scenarioApi");

describe("workspaceStore", () => {
  beforeEach(() => {
    const { result } = renderHook(() => useWorkspaceStore());
    const [, actions] = result.current;
    actions.resetWorkspaceStoreState();
  });

  it("should get workspaces successfully", async () => {
    const workspace1 = {
      id: "123",
      name: "w1",
      unitSystem: WorkspaceUnitSystem.Imperial,
      measurement: {
        lengthUnit: FormattingEnum.Feet,
        areaUnit: FormattingEnum.SquareFeet,
        largeAreaUnit: FormattingEnum.Acres
      }
    };
    const workspace2 = {
      id: "456",
      name: "w2",
      unitSystem: WorkspaceUnitSystem.Imperial,
      measurement: {
        lengthUnit: FormattingEnum.Feet,
        areaUnit: FormattingEnum.SquareFeet,
        largeAreaUnit: FormattingEnum.Acres
      }
    };
    (getWorkspaces as jest.MockedFunction<typeof getWorkspaces>).mockReturnValue(
      Promise.resolve([workspace1, workspace2])
    );

    const { result, rerender } = renderHook(() => useWorkspaceStore());
    const [, actions] = result.current;

    await act(async () => {
      await actions.getWorkspaces();
      rerender();

      const [store] = result.current;
      expect(store.workspaces.length).toBe(2);
      expect(store.getListState).toBe(ApiCallState.Idle);
      expect(store.workspaces).toContainEqual(workspace1);
      expect(store.workspaces).toContainEqual(workspace2);
    });
  });

  it("should handle get workspaces failure", async () => {
    (getWorkspaces as jest.MockedFunction<typeof getWorkspaces>).mockReturnValue(Promise.reject());

    const { result, rerender } = renderHook(() => useWorkspaceStore());
    const [, actions] = result.current;

    await act(async () => {
      await actions.getWorkspaces();
      rerender();

      const [store] = result.current;
      expect(store.workspaces.length).toBe(0);
      expect(store.getListState).toBe(ApiCallState.Error);
    });
  });

  it("should select workspace correctly", async () => {
    const workspace1 = {
      id: "123",
      name: "w1",
      unitSystem: WorkspaceUnitSystem.Imperial,
      measurement: {
        lengthUnit: FormattingEnum.Feet,
        areaUnit: FormattingEnum.SquareFeet,
        largeAreaUnit: FormattingEnum.Acres
      }
    };
    const workspace2 = {
      id: "456",
      name: "w2",
      unitSystem: WorkspaceUnitSystem.Imperial,
      measurement: {
        lengthUnit: FormattingEnum.Feet,
        areaUnit: FormattingEnum.SquareFeet,
        largeAreaUnit: FormattingEnum.Acres
      }
    };
    (getWorkspaces as jest.MockedFunction<typeof getWorkspaces>).mockReturnValue(
      Promise.resolve([workspace1, workspace2])
    );

    const { result, rerender } = renderHook(() => useWorkspaceStore());
    const [, actions1] = result.current;

    await act(async () => {
      await actions1.getWorkspaces();
      rerender();

      const [, actions2] = result.current;
      actions2.setSelectedWorkspace("w2");
      rerender();

      const [store] = result.current;
      expect(store.selectedWorkSpace).toBe("w2");
      expect(store.selectedWorkspaceId).toBe("456");
    });
  });
});
