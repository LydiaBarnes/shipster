import React from "react";

const SortSelect = props => {
  return (
    <select
      onChange={props.onSortSelectChange}
      className="sort-select"
      value={props.sortValue}
    >
      <option value="pickupDate">Pickup Date</option>
      <option value="dropoffDate">Dropoff Date</option>
      <option value="origin">Origin</option>
      <option value="destination">Destination</option>
      <option value="price">Offer</option>
      <option value="miles">Miles</option>
    </select>
  );
};

export default SortSelect;
