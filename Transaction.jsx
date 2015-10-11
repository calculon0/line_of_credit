// Transaction component - represents a single transaction item
Transaction = React.createClass({
  propTypes: {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    transaction: React.PropTypes.object.isRequired
  },

  deleteThisTransaction() {
    Transactions.remove(this.props.transaction._id);
  },

  render() {
    return (
      <li>
        <button className="delete" onClick={this.deleteThisTransaction}>
          &times;
        </button>

        <span className="text">Amount: ${this.props.transaction.amount}</span>
        <span className="text">Day: {this.props.transaction.day}</span>
      </li>
    );
  }
});