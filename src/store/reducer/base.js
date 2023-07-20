import * as TYPES from "../action-type";
import _ from "../../assets/utils";

let inital = {
  info: null,
};

export default function baseReducer(state = inital, action) {
  state = _.clone(state);
  switch (action.type) {
    case TYPES.BASE_INFO:
      state.info = action.info;
    default:
  }

  return state;
}
