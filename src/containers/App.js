import React, { Component } from "react";
import axios from "axios";
import { setupCache } from "axios-cache-adapter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ShippingCard from "../components/ShippingCard";
import SortSelect from "../components/SortSelect";
import LoadingSpinner from "../components/LoadingSpinner";

// Fake data for testing
import cardsPickupDate1 from "../sample-data/pickupDate-1.json";
import cardsPickupDate2 from "../sample-data/pickupDate-2.json";
import cardsDropoffDate1 from "../sample-data/dropoffDate-1.json";
import cardsDropoffDate2 from "../sample-data/dropoffDate-2.json";
import cardsMiles1 from "../sample-data/miles-1.json";
import cardsMiles2 from "../sample-data/miles-2.json";
import cardsOrigin1 from "../sample-data/origin-1.json";
import cardsOrigin2 from "../sample-data/origin-2.json";
import cardsDestination1 from "../sample-data/destination-1.json";
import cardsDestination2 from "../sample-data/destination-2.json";

// Basic cache
const cache = setupCache({
  maxAge: 15 * 60 * 1000,
  exclude: { query: false },
  // addresses a bug with not caching params
  key: req => req.url + JSON.stringify(req.params),
  // allows to pull cache on server error
  clearOnError: false
});

const api = axios.create({
  adapter: cache.adapter
});

const NUM_CARDS = 10;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      sortBy: "pickupDate",
      pagination: 0,
      isLoadingCards: false,
      apiErrors: "",
      nextDisabled: true,
      prevDisabled: true
    };
  }

  componentDidMount() {
    this.loadCards();
  }

  /**
   * Loads cards into state based on state variables at the time called
   */
  loadCards = () => {
    // Fake the api for demo
    let currentCards = [];
    if (this.state.sortBy === "pickupDate") {
      currentCards =
        this.state.pagination > 0 ? cardsPickupDate2 : cardsPickupDate1;
    } else if (this.state.sortBy === "dropoffDate") {
      currentCards =
        this.state.pagination > 0 ? cardsDropoffDate2 : cardsDropoffDate1;
    } else if (this.state.sortBy === "miles") {
      currentCards = this.state.pagination > 0 ? cardsMiles2 : cardsMiles1;
    } else if (this.state.sortBy === "price") {
      // price happens to be in same order as distance
      currentCards = this.state.pagination > 0 ? cardsMiles2 : cardsMiles1;
    } else if (this.state.sortBy === "origin") {
      currentCards = this.state.pagination > 0 ? cardsOrigin2 : cardsOrigin1;
    } else if (this.state.sortBy === "destination") {
      currentCards =
        this.state.pagination > 0 ? cardsDestination2 : cardsDestination1;
    }

    this.refreshAppState(currentCards);

    // I used this block with a real api, which I have removed for this demo
    // for simplicity and anonymity reasons.
    // ---------------------------------------
    // let order = "asc";
    // if (["price", "origin", "destination"].includes(this.state.sortBy)) {
    //   order = "desc";
    // }
    //
    // this.setState({
    //   isLoadingCards: true
    // });
    //
    // api({
    //   url: "[insert api url here]",
    //   method: "get",
    //   params: {
    //     limit: NUM_CARDS,
    //     sort: this.state.sortBy,
    //     offset: this.state.pagination,
    //     order: order
    //   }
    // })
    //   .then(response => {
    //     console.log(response.request);
    //     refreshAppState(response.data);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     this.showErrors(error);
    //   });
  };

  refreshAppState = data => {
    this.setState({
      cards: data,
      isLoadingCards: false,
      apiErrors: ""
    });
    // Detect if we get to the very end of the results
    // This assumes we don't land on a full last page.
    // Should probably prefetch instead.
    if (data.length < NUM_CARDS) {
      this.setState({ nextDisabled: true });
    } else if (this.state.nextDisabled) {
      this.setState({ nextDisabled: false });
    }
  };

  showErrors = error => {
    this.setState({
      isLoadingCards: false,
      apiErrors: `Error: Something went wrong with the request, please try again: ${error}`
    });
  };

  /**
   * Update the pagination state, request new data
   * @param {number} num - number to increment/decrement
   */
  updatePagination = num => {
    let pag = this.state.pagination;
    let updateNum = (pag += num);
    // We're at the beginning, don't let user go back
    if (updateNum <= 0) {
      this.setState({ prevDisabled: true });
    } else if (this.state.prevDisabled) {
      this.setState({ prevDisabled: false });
    }

    this.setState({ pagination: updateNum }, () => this.loadCards());
  };

  /**
   * Update the sort criteria state, request new data
   * Also resets pagination
   */
  onSortSelectChange = e => {
    this.setState(
      {
        sortBy: e.target.value,
        pagination: 0,
        prevDisabled: true
      },
      () => this.loadCards()
    );
  };

  /**
   * Decrement pagination
   */
  onPrevButtonClicked = () => {
    this.updatePagination(-NUM_CARDS);
  };

  /**
   * Increment pagination
   */
  onNextButtonClicked = () => {
    this.updatePagination(NUM_CARDS);
  };

  render() {
    let {
      cards,
      isLoadingCards,
      apiErrors,
      nextDisabled,
      prevDisabled
    } = this.state;

    let shippingCards = isLoadingCards ? (
      <LoadingSpinner />
    ) : apiErrors ? (
      <p>{apiErrors}</p>
    ) : (
      cards.map((card, i) => {
        // the api doesn't return unique ids so I have to get cheaty here
        let key = i;
        return <ShippingCard key={key} card={card} />;
      })
    );

    let mainClass = `app-main ${this.state.sortBy}`;

    return (
      <div className="app">
        <header className="app-header">
          <FontAwesomeIcon icon="truck" /> &nbsp; Shipster
          <SortSelect
            onSortSelectChange={this.onSortSelectChange}
            sortValue={this.state.sortBy}
          />
        </header>
        <main className={mainClass}>{shippingCards}</main>
        <footer className="app-footer">
          <button onClick={this.onPrevButtonClicked} disabled={prevDisabled}>
            <FontAwesomeIcon icon="truck" flip="horizontal" /> Previous
          </button>
          <button onClick={this.onNextButtonClicked} disabled={nextDisabled}>
            Next <FontAwesomeIcon icon="truck" />
          </button>
        </footer>
      </div>
    );
  }
}

export default App;
