// import * as TYPES from "../action-type";
import _ from "@/assets/utils";

let inital = {
  list: null,
};

export default function storeReducer(state = inital, action) {
  state = _.clone(state);
  switch (action.type) {
    default:
      return null;
  }
}
