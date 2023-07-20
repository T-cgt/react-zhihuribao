import * as TYPES from "../action-type";

import api from "../../api";

const baseAction = {
  //获取登陆者信息
  async queryUserInfoAsync() {
    let info = null;
    try {
      let { code, data } = await api.queryUserInfo();
      if (+code === 0) {
        info = data;
      }
    } catch (_) {}
    return {
      type: TYPES.BASE_INFO,
      info,
    };
  },

  //清除存储的登录者信息
  clearUserInfo() {
    return {
      type: TYPES.BASE_INFO,
      info: null,
    };
  },
};
export default baseAction;
