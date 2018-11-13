import React from "react";
import ReactDOM from "react-dom";

import "./styles.scss";

import App from "./containers/App";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowCircleUp,
  faArrowCircleDown,
  faCalendarAlt,
  faHandHoldingUsd,
  faShippingFast,
  faStopwatch,
  faSpinner,
  faTruck
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faArrowCircleUp,
  faArrowCircleDown,
  faCalendarAlt,
  faHandHoldingUsd,
  faShippingFast,
  faStopwatch,
  faSpinner,
  faTruck
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
