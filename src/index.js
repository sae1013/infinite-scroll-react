import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import store from "./store/store";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { customHistory } from "./store/store";

ReactDOM.render(
  <Router history={customHistory}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById("root")
);

reportWebVitals();
