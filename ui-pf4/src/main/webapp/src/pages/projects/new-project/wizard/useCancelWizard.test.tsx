import React from "react";
import { renderHook } from "@testing-library/react-hooks";

import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { rootReducer } from "store/rootReducer";

import { deleteDialogActions } from "store/deleteDialog";
import {
  DeleteDialogState,
  defaultState,
  stateKey,
} from "store/deleteDialog/reducer";

import { useCancelWizard } from "./useCancelWizard";

describe("useCancelWizard", () => {
  it("Valid call to redux", () => {
    // Mock redux
    const state: DeleteDialogState = defaultState;
    const mockStore = (initialStatus: any) => {
      return createStore(
        rootReducer,
        initialStatus,
        composeWithDevTools(applyMiddleware(thunk))
      );
    };
    const store = mockStore({ [stateKey]: state });
    store.dispatch = jest.fn();
    const Wrapper: React.FC = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    // Use hook
    const { result } = renderHook(() => useCancelWizard(), {
      wrapper: Wrapper,
    });

    const cancelWizard = result.current;
    expect(cancelWizard).toBeDefined();

    // Call cancel
    cancelWizard(jest.fn());

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "dialog/delete/open",
        payload: expect.objectContaining({
          name: "",
          type: "",
          config: expect.objectContaining({
            title: "Cancel",
            message:
              "Are you sure you want to cancel? All the data associated to this project won't be saved.",
            deleteBtnLabel: "Yes",
            cancelBtnLabel: "No",
          }),
        }),
      })
    );
  });
});
