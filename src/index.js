import React from "react";
import ReactDOM from "react-dom/client";
import APP from "./APP";

import "lib-flexible";

import "./index.less";

/* 组件库导入 */
import { ConfigProvider } from "antd-mobile";
import zhCN from "antd-mobile/es/locales/en-US";

//redux
import { Provider } from "react-redux";
import store from "./store/index";

/* 处理最大宽度 */
(function () {
  const handleMax = function handleMax() {
    let html = document.documentElement,
      root = document.getElementById("root"),
      deviceW = html.clientWidth;
    root.style.maxWidth = "750px";
    if (deviceW >= 750) {
      html.style.fontSize = "75px";
    }
  };
  handleMax();
})();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode> //会导致子组件中的useeffect的钩子调用两次
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <APP />
    </Provider>
  </ConfigProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
