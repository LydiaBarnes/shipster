import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// various date custom utils
// (guess I could have used moment.js, oh well)

/**
 * Format Date to Weekday, MM/DD/YY
 * @param {Date} date - date object
 * @returns {string}
 */
function formatFullDate(date) {
  let options = {
    weekday: "short",
    year: "2-digit",
    month: "numeric",
    day: "numeric"
  };
  return date.toLocaleDateString("en-US", options);
}

/**
 * Format Date to HH:MM - HH:MM (TMZ)(without duplicates)
 * @param {Date} date - date object
 * @returns {string}
 */
function formatTimeRange(date1, date2) {
  let options = {
    hour: "2-digit",
    minute: "2-digit"
  };

  // get abbreviated time zone
  let timezone = date1
    .toLocaleTimeString("en-US", { timeZoneName: "short" })
    .split(" ")
    .pop();
  // borrowing Brittish time, is shorter
  let d1 = date1.toLocaleTimeString("en-GB", options);
  let d2 = date2.toLocaleTimeString("en-GB", options);

  return d1 !== d2 ? `${d1} - ${d2} ${timezone}` : `${d1} ${timezone}`;
}

/**
 * Format Date to US money format $...DD.CC
 * @param {number} money
 * @returns {string}
 */
function formatMoney(money) {
  return `$${money.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * Get the amount of dates between a date range
 * @param {Date} date1 - Date object start
 * @param {Date} date2 - Date object end
 * @returns {number}
 */
function getTotalDays(date1, date2) {
  let mmInDay = 24 * 60 * 60 * 1000;
  let t1 = date1.getTime();
  let t2 = date2.getTime();

  return Math.ceil((t2 - t1) / mmInDay);
}

class ShippingCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: false
    };
  }

  onExpandButtonClicked = () => {
    let expanded = this.state.isExpanded;
    this.setState({ isExpanded: !expanded });
  };

  render() {
    let card = this.props.card;

    // var setup fun time

    let originStartDate = new Date(card.origin.pickup.start);
    let originEndDate = new Date(card.origin.pickup.end);
    let originDay = formatFullDate(originStartDate);
    let originTimeRange = formatTimeRange(originStartDate, originEndDate);

    let destStartDate = new Date(card.destination.dropoff.start);
    let destEndDate = new Date(card.destination.dropoff.end);
    let destDay = formatFullDate(destStartDate);
    let destTimeRange = formatTimeRange(destStartDate, destEndDate);

    //let daysTill = destStartDate.getTime() - originStartDate.getTime();
    // daysTill = daysTill.getDate();

    let offer = formatMoney(card.offer);

    let daysTill = getTotalDays(new Date(), originStartDate);
    // plus 1 day to include all dates in range (since this calculates "between")
    let totalDays = getTotalDays(originStartDate, destStartDate) + 1;
    let milesDay = Math.floor(card.miles / totalDays);
    let dollahDay = formatMoney(card.offer / totalDays);
    let dollahMile = formatMoney(card.offer / card.miles);

    let additionalDetails = this.state.isExpanded && (
      <div className="additional-details-row">
        <div className="additional-details-breakdown">
          <FontAwesomeIcon icon="calendar-alt" />
          <br />
          starts {daysTill} days from now
        </div>
        <div className="additional-details-breakdown">
          <FontAwesomeIcon icon="stopwatch" />
          <br />~{milesDay} miles / day
        </div>
        <div className="additional-details-breakdown">
          <FontAwesomeIcon icon="hand-holding-usd" />
          <br />
          {dollahMile} / mile <br />
          {dollahDay} / day
        </div>
      </div>
    );

    let expandButtonContent = this.state.isExpanded ? (
      <>
        See Less <FontAwesomeIcon icon="arrow-circle-up" />
      </>
    ) : (
      <>
        See More <FontAwesomeIcon icon="arrow-circle-down" />
      </>
    );

    return (
      <section className="shipping-card">
        <div className="schedule-row">
          <div className="shipping-card-location shipping-card-pickup">
            <div className="item-label">pick up</div>
            <div className="shipping-card-location-state">
              {card.origin.state}
            </div>
          </div>
          <div className="shipping-card-direction">
            <FontAwesomeIcon icon="shipping-fast" />
          </div>
          <div className="shipping-card-location shipping-card-dropoff">
            <div className="item-label">drop off</div>
            <div className="shipping-card-location-state">
              {card.destination.state}
            </div>
          </div>
        </div>

        <div className="schedule-row">
          <div className="shipping-card-location shipping-card-location-city shipping-card-pickup">
            {card.origin.city}
          </div>
          <div className="shipping-card-location shipping-card-location-city shipping-card-dropoff">
            {card.destination.city}
          </div>
        </div>

        <div className="schedule-row">
          <div className="shipping-card-location shipping-card-location-date shipping-card-pickup">
            {originDay}
            <br />
            {originTimeRange}
          </div>
          <div className="shipping-card-location shipping-card-location-date shipping-card-dropoff">
            {destDay}
            <br />
            {destTimeRange}
          </div>
        </div>

        <div className="details-row">
          <div>
            <div className="item-label">distance</div>
            <div className="shipping-card-distance">{card.miles} Miles</div>
          </div>
          <button onClick={this.onExpandButtonClicked}>
            {expandButtonContent}
          </button>
          <div>
            <div className="item-label">offer</div>
            <div className="shipping-card-offer">{offer}</div>
          </div>
        </div>
        {additionalDetails}
      </section>
    );
  }
}

export default ShippingCard;
