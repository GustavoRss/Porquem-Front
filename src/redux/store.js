import { createStore } from "redux";

const INITIAL_STATE = {
  sidebar: false,
  localization: "",
  campaign: "",
  institution: "",
  cause: "",
  arr: [],
};

function handleStates(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "SIDEBAR_ACTIVE":
      return { ...state, sidebar: action.value };

    case "SEARCH_LOCALIZATION":
      return { ...state, localization: action.value };

    case "SEARCH_INSTITUTION":
      return { ...state, institution: action.value };

    case "SEARCH_CAMPAIGN":
      return { ...state, campaign: action.value };

    case "SEARCH_HELPITEMS":
      if (action.selected) {
        return {
          ...state,
          arr: state.arr.concat(action.value),
        };
      } else {
        return {
          ...state,
          arr: state.arr.filter((item) => item !== action.value),
        };
      }

    case "RESTART_LIST":
      return INITIAL_STATE;

    default:
      return state;
  }
}

const store = createStore(handleStates);

export default store;
