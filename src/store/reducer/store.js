import * as TYPES from "../action-type";
import _ from "@/assets/utils";

let inital = {
  list: null,
};

export default function storeReducer(state = inital, action) {
  state = _.clone(state);
  switch (action.type) {
    case TYPES.STORE_LIST:
      state.list = action.list;
      break;
    case TYPES.STORE_REMOVE:
      if (Array.isArray(state.list)) {
        state.list = state.list.filter((item) => {
          return item.id !== action.id;
        });
      }
    default:
  }
  return state;
}
