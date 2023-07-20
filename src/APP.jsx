import React from "react";
import RouterView from "./router/index.js";
import { HashRouter } from "react-router-dom";
import { KeepAliveProvider } from "keepalive-react-component";

export default function APP() {
  return (
    <HashRouter>
      <KeepAliveProvider>
        <RouterView />
      </KeepAliveProvider>
    </HashRouter>
  );
}
