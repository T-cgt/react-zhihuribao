import { combineReducers } from "redux";

import baseReducer from "./base";
import storeReducer from "./store";

//合并reducres
export default combineReducers({
  base: baseReducer,
  store: storeReducer,
});
