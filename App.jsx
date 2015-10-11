// App component - represents the whole app
App = React.createClass({
  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],

  // Loads items from the Transactions collection and puts them on this.data.transactions
  getMeteorData() {
    return {
      transactions: Transactions.find({}, {sort: {transactionDay: 1}}).fetch()
    };
  },

  getCreditLimit() {
    return 1000;
  },

  getAPR() {
    return 0.35;
  },

  getCurrentBalance() {
    let total = 0;
    this.data.transactions.map((transaction) => {
      total += Number.parseInt(transaction.amount);
    })
    return total;
  },

  getAvailableCredit() {
    return this.getCreditLimit() - this.getCurrentBalance();
  },

  renderTransactions() {
    // Get transactions from this.data.transactions
    return this.data.transactions.map((transaction) => {
      return <Transaction key={transaction._id} transaction={transaction} />;
    });
  },

  renderTotal() {
    let interest = 0;
    let currentBalance = 0;
    let previousAmount = 0;
    let previousDay = 0;
    let endOfPeriod = false;

    this.data.transactions.map((transaction) => {
      if (currentBalance > 0) {
        interest += currentBalance * this.getAPR() / 365 * (Number.parseInt(transaction.day) - previousDay);
      }
      currentBalance += Number.parseInt(transaction.amount);
      previousDay = Number.parseInt(transaction.day);
    })
    interest += currentBalance * this.getAPR() / 365 * (31 - previousDay);
    return (interest + currentBalance).toFixed(2);
  },

  handleSubmit(event) {
    this.displayError("");
    event.preventDefault();

    // Find the text field via the React ref
    let amount = React.findDOMNode(this.refs.amountInput).value.trim();
    let day = React.findDOMNode(this.refs.dayInput).value.trim();

    if (amount == "" || day == "") {
      this.displayError("Both fields are required");
      return;
    }

    if (amount > this.getAvailableCredit()) {
      this.displayError("Amount must be less than or equal to available credit!");
      return;
    }

    if (day < 1 || day > 30) {
      this.displayError("Day must be a value between 1-30");
      return;
    }

    Transactions.insert({
      amount: amount,
      day: day
    });

    // Clear form
    React.findDOMNode(this.refs.amountInput).value = "";
    React.findDOMNode(this.refs.dayInput).value = "";
  },

  displayError(message) {
    React.render(React.createElement("div", {id: "errorOutput"}, message), document.getElementById('errorOutput'));
  },

  toggleHideCompleted() {
    this.setState({
      hideCompleted: ! this.state.hideCompleted
    });
  },

  render() {
    return (
      <div className="container">
        <header>
          <h1>Line of Credit - ${this.getCurrentBalance()} used | ${this.getAvailableCredit()} available ({this.getAPR() * 100}% APR)</h1>
          <div id="errorOutput"></div>
          <form className="new-transaction" onSubmit={this.handleSubmit} >
            <input
              type="text"
              ref="amountInput"
              placeholder="Amount of transaction (positive = take out money, negative = payment)" />
            <input
              type="text"
              ref="dayInput"
              placeholder="Transaction occurs on which day? (1-30)" />
            <input type="submit" value="Add Transaction" />
          </form>
        </header>

        <ul>
          {this.renderTransactions()}
          <li>
            Total owed: ${this.renderTotal()}
          </li>
        </ul>
      </div>
    );
  }
});