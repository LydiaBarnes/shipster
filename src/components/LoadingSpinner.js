import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <FontAwesomeIcon icon="spinner" size="2x" pulse />
      <br />
      <br />
      <FontAwesomeIcon icon="shipping-fast" size="2x" />
    </div>
  );
};

export default LoadingSpinner;
