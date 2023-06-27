import React from "react";
import RouterView from "./router/index.js";
import { HashRouter } from "react-router-dom";

export default function APP() {
  return (
    <HashRouter>
      <RouterView />
    </HashRouter>
  );
}
