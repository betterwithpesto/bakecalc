/** @jsx React.DOM */

var PRESET_INGREDIENTS = [ 
{ key: "baking-powder", name: "baking powder", unit: "teaspoon", cost: 0.10, amzLink: "http://www.amazon.com/gp/product/B005P0I7T6/ref=as_li_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=B005P0I7T6&linkCode=as2&tag=bake064-20&linkId=M77A54TG4MQIER5O" }, 
{ key: "butter", name: "butter", unit: "cup", cost: 0.50 }, 
{ key: "chocolate-chips", name: "chocolate chips", unit: "cup", cost: 1.10 }, 
{ key: "cinnamon", name: "cinnamon", unit: "teaspoon", cost: 0.06 }, 
{ key: "cocoa", name: "cocoa", unit: "cup", cost: 1.54 }, 
{ key: "eggs", name: "eggs", unit: null, cost: 0.25 }, 
{ key: "flour", name: "flour", unit: "cup", cost: 0.1 }, 
{ key: "margarine", name: "margarine", unit: "cup", cost: 0.5 }, 
{ key: "milk", name: "milk", unit: "cup", cost: 0.17 }, 
{ key: "shortening", name: "shortening", unit: "cup", cost: 0.66 }, 
{ key: "sugar", name: "sugar", unit: "cup", cost: 0.3 }, 
{ key: "vanilla", name: "vanilla", unit: "teaspoon", cost: 0.04 }, 
{ key: "vegetable-oil", name: "vegetable oil", unit: "cup", cost: 0.46 }, 
{ key: "yeast", name: "yeast", unit: "package", cost: 0.51 } 
];

var PRESET_SUPPLIES = [
{ key: "box", name: "boxes", cost: 0.31 },
{ key: "cake-board", name: "cake boards", cost: 1.00 },
{ key: "cake-circle", name: "cake circles", cost: 1.00 },
{ key: "dowel-rod", name: "dowel rods", cost: 1.00 },
{ key: "serving-stand", name: "serving stands", cost: 1.00 }
];

var Calculator = React.createClass({displayName: 'Calculator',
  getInitialState: function() {
    return { ingredients: [], supplies: [], hours: 0, wage: 0, overhead: 0, miles: 0, rate: 0 };
  },
    handleIngredientsInput: function(ingredients) {
      this.setState({ ingredients: ingredients });
    },
    handleSuppliesInput: function(supplies) {
      this.setState({ supplies: supplies });
    },
    handleTimeInput: function(hours, wage) {
      this.setState({ hours: hours, wage: wage });
    },
    handleOverheadInput: function(overhead) {
      this.setState({ overhead: overhead });
    },
    handleDeliveryInput: function(miles, rate) {
      this.setState({ miles: miles, rate: rate });
    },
    render: function() {
      return (
          React.DOM.div({className: "calculator row"}, 
          React.DOM.div({className: "col-md-8"}, 
          React.DOM.form({className: "form-inline"}, 
          ItemsBox({name: "Ingredients", inputsComponent: IngredientInputs, activeItems: this.state.ingredients, presetItems: PRESET_INGREDIENTS, onUserInput: this.handleIngredientsInput}), 
          ItemsBox({name: "Supplies", inputsComponent: SupplyInputs, activeItems: this.state.supplies, presetItems: PRESET_SUPPLIES, onUserInput: this.handleSuppliesInput}), 
          TimeBox({onUserInput: this.handleTimeInput}), 
          OverheadBox({onUserInput: this.handleOverheadInput}), 
          DeliveryBox({onUserInput: this.handleDeliveryInput})
          )
          ), 
          React.DOM.div({className: "col-md-4"}, 
          CalculationBox({ingredients: this.state.ingredients, supplies: this.state.supplies, hours: this.state.hours, wage: this.state.wage, overhead: this.state.overhead, miles: this.state.miles, rate: this.state.rate})
          )
          )
          );
    }
});

var ItemsBox = React.createClass({displayName: 'ItemsBox',
  handleItemSelect: function(item) {
    var items = this.props.activeItems;
    item["quantity"] = 1
    if(!item.key) {
      item.key = _.uniqueId();
    }
    items.push(item);
    this.props.onUserInput(items);
  },
    handleItemChange: function(key, changes) {
      var items = this.props.activeItems;
      item = _.find(items, function(i){ return i.key == key });
      index = _.indexOf(items, item);
      item = _.extend(item, changes);
      items[index] = item;
      this.props.onUserInput(items);
    },
    render: function() {
      var itemLinks = _.difference(this.props.presetItems, this.props.activeItems).map(function(item) {
        return (
          React.DOM.li(null, AddItemLink({onItemSelect: this.handleItemSelect, item: item}))
          );
      }.bind(this));
      var itemFields = this.props.activeItems.map(function(item) {
        return (
          this.props.inputsComponent({onItemChange: this.handleItemChange, item: item})
          );
      }.bind(this));
      return (
          React.DOM.div({className: "panel input-box"}, 
          React.DOM.div({className: "panel-heading"}, 
          React.DOM.h3({className: "panel-title"}, this.props.name)
          ), 
          React.DOM.div({className: "panel-body"}, 
          itemFields, 
          React.DOM.div(null, "Choose your items below:"), 
          React.DOM.ul({className: "list-inline"}, 
          itemLinks, 
          React.DOM.li(null, AddItemLink({onItemSelect: this.handleItemSelect, item: { quantity: 1, name: "", cost: null}}))
          )
          )
          )
          );
    }
});

var IngredientInputs = React.createClass({displayName: 'IngredientInputs',
  handleChange: function(event) {
    var changes = { 
      quantity: this.refs.ingredientQuantityInput.getDOMNode().value, 
      name: this.refs.ingredientNameInput.getDOMNode().value, 
      cost: this.refs.ingredientCostInput.getDOMNode().value 
    };
    this.props.onItemChange(this.props.item.key, changes);
  },
    render: function() {
      if ( _.contains(_.pluck(PRESET_INGREDIENTS, 'key'), this.props.item.key)) {
        var quantity = React.DOM.input({defaultValue: this.props.item.quantity, type: "number", className: "form-control input-sm", type: "number", ref: "ingredientQuantityInput", onChange: this.handleChange});
        if (this.props.item.unit) {
          var name = React.DOM.span(null, " ", this.props.item.unit + 's', " of ", React.DOM.input({hidden: true, defaultValue: this.props.item.name, type: "text", ref: "ingredientNameInput", onChange: this.handleChange}), React.DOM.strong({className: "item-name"}, this.props.item.name), " at ");
        } else {
          var name = React.DOM.span(null, " ", React.DOM.input({hidden: true, defaultValue: this.props.item.name, type: "text", ref: "ingredientNameInput", onChange: this.handleChange}), React.DOM.strong({className: "item-name"}, this.props.item.name), " at ");
        }
        var costAppend = React.DOM.span({className: "input-group-addon"}, "/", React.DOM.sub(null, this.props.item.unit || 'each'));
      } else {
        var quantity = React.DOM.input({hidden: true, value: this.props.item.quantity, ref: "ingredientQuantityInput"});
        var name = React.DOM.span(null, React.DOM.input({defaultValue: this.props.item.name, type: "text", className: "form-control input-sm", ref: "ingredientNameInput", onChange: this.handleChange, placeholder: "6 spoons of nutella, etc."}), " at ");
        var costAppend = '';
      }
      return (
        React.DOM.div({className: "input-fields"}, 
        quantity, 
        name, 
        React.DOM.div({className: "input-group input-group-sm"}, 
        React.DOM.span({className: "input-group-addon"}, "$"), 
        React.DOM.input({defaultValue: this.props.item.cost, type: "number", className: "form-control", ref: "ingredientCostInput", onChange: this.handleChange}), 
        costAppend
        )
        )
        );
    }
});

var SupplyInputs = React.createClass({displayName: 'SupplyInputs',
  handleChange: function(event) {
    var changes = { 
      quantity: this.refs.supplyQuantityInput.getDOMNode().value, 
      name: this.refs.supplyNameInput.getDOMNode().value, 
      cost: this.refs.supplyCostInput.getDOMNode().value 
    };
    this.props.onItemChange(this.props.item.key, changes);
  },
    render: function() {
      if (_.contains(_.pluck(PRESET_SUPPLIES, 'key'), this.props.item.key)) {
        var quantity = React.DOM.input({defaultValue: this.props.item.quantity, type: "number", className: "form-control input-sm", type: "number", ref: "supplyQuantityInput", onChange: this.handleChange});
        var name = React.DOM.span(null, React.DOM.input({hidden: true, defaultValue: this.props.item.name, type: "text", ref: "supplyNameInput", onChange: this.handleChange}), " ", React.DOM.strong({className: "item-name"}, this.props.item.name), " at ");
        var costAppend = React.DOM.span({className: "input-group-addon"}, "/", React.DOM.sub(null, "'each'"));
      } else {
        var quantity = React.DOM.input({hidden: true, defaultValue: this.props.item.quantity, type: "number", ref: "supplyQuantityInput", onChange: this.handleChange});
        var name = React.DOM.span(null, React.DOM.input({defaultValue: this.props.item.name, type: "text", className: "form-control input-sm", ref: "supplyNameInput", onChange: this.handleChange, placeholder: "Doilies, cello wrap, etc."}), " at ");
        var costAppend = '';
      }
      return (
        React.DOM.div({className: "input-fields"}, 
        quantity, 
        name, 
        React.DOM.div({className: "input-group input-group-sm"}, 
        React.DOM.span({className: "input-group-addon"}, "$"), 
        React.DOM.input({defaultValue: this.props.item.cost, className: "form-control", type: "number", ref: "supplyCostInput", onChange: this.handleChange}), 
        costAppend
        )
        )
        );
    }
});

var AddItemLink = React.createClass({displayName: 'AddItemLink',
  handleClick: function(event) {
    this.props.onItemSelect(this.props.item);
    return false;
  },
    render: function() {
      var displayName = this.props.item.name || "something else";
      return(
        React.DOM.a({onClick: this.handleClick, className: "item-link"}, displayName)
        );
    }
});

var TimeBox = React.createClass({displayName: 'TimeBox',
  handleChange: function(event) {
    this.props.onUserInput(
      this.refs.timeHoursInput.getDOMNode().value,
      this.refs.timeWageInput.getDOMNode().value
    );
  },
    render: function() {
      return (
        React.DOM.div({className: "panel input-box"}, 
        React.DOM.div({className: "panel-heading"}, 
        React.DOM.h3({className: "panel-title"}, "Time")
        ), 
        React.DOM.div({className: "panel-body"}, 
        React.DOM.p(null, React.DOM.strong(null, "How much is your time worth?")), 
        React.DOM.div({className: "input-fields"}, 
        React.DOM.input({type: "number", className: "form-control input-sm", ref: "timeHoursInput", onChange: this.handleChange}), " hours at ", React.DOM.div({className: "input-group input-group-sm"}, 
        React.DOM.span({className: "input-group-addon"}, "$"), 
        React.DOM.input({type: "number", className: "form-control input-sm", ref: "timeWageInput", onChange: this.handleChange})
        ), " an hour."
        ), 
        React.DOM.p(null, "You deserve to be paid a fair hourly rate for the time you spend baking. Don't forget sampling, planning or clean-up time!"
        )
        )
        )
        );
    }
});

var OverheadBox = React.createClass({displayName: 'OverheadBox',
  handleChange: function(event) {
    this.props.onUserInput(this.refs.overheadInput.getDOMNode().value);
  },
    render: function() {
      return(
        React.DOM.div({className: "panel input-box"}, 
        React.DOM.div({className: "panel-heading"}, 
        React.DOM.h3({className: "panel-title"}, "Overhead")
        ), 
        React.DOM.div({className: "panel-body"}, 
        React.DOM.div({className: "input-fields"}, 
        React.DOM.div({className: "input-group input-group-sm"}, 
        React.DOM.span({className: "input-group-addon"}, "$"), 
        React.DOM.input({type: "number", className: "form-control input-sm", ref: "overheadInput", onChange: this.handleChange})
        )
        ), 
        React.DOM.p(null, "When you bake, you use electricity, ovens, and other things. A fee for the use of equipment should be added to the cost.")
        )
        )
        );
    }
});

var DeliveryBox = React.createClass({displayName: 'DeliveryBox',
  handleChange: function(event) {
    this.props.onUserInput(
      this.refs.deliveryMilesInput.getDOMNode().value,
      this.refs.deliveryRateInput.getDOMNode().value
      );
  },
    render: function() {
      return (
        React.DOM.div({className: "panel input-box"}, 
        React.DOM.div({className: "panel-heading"}, 
        React.DOM.h3({className: "panel-title"}, "Delivery")
        ), 
        React.DOM.div({className: "panel-body"}, 
        React.DOM.div({className: "input-fields"}, 
        React.DOM.input({type: "number", className: "form-control input-sm", ref: "deliveryMilesInput", onChange: this.handleChange}), " miles at ", React.DOM.div({className: "input-group input-group-sm"}, 
        React.DOM.span({className: "input-group-addon"}, "$"), 
        React.DOM.input({type: "number", className: "form-control input-sm", ref: "deliveryRateInput", onChange: this.handleChange})
        ), " per mile."
        ), 
        React.DOM.p(null, "The current ", React.DOM.a({href: "http://www.gsa.gov/portal/content/100715"}, "federal reimbursement rate"), " for mileage is $0.56 per mile, which is a good place to start. Don't forget to charge for the entire round-trip!")
        )
        )
        );
    }
});

var CalculationBox = React.createClass({displayName: 'CalculationBox',
  render: function() {
    var ingredientsTotal = _.reduce(_.map(this.props.ingredients, function(i){ return i.cost * i.quantity }), function(memo, num){ return memo + num; }, 0).toFixed(2);
    var suppliesTotal = _.reduce(_.map(this.props.supplies, function(s){ return s.cost * s.quantity }), function(memo, num){ return memo + num; }, 0).toFixed(2);
    var timeTotal = (this.props.hours * this.props.wage).toFixed(2);
    var overheadTotal = Number(this.props.overhead).toFixed(2);
    var deliveryTotal = (this.props.miles * this.props.rate).toFixed(2);
    var grandTotal = (Number(ingredientsTotal) + Number(suppliesTotal) + Number(timeTotal) + Number(overheadTotal) + Number(deliveryTotal)).toFixed(2);
    if (grandTotal > 0) {
      var panelFooter = React.DOM.span(null, "You should charge: ", React.DOM.strong({className: "pull-right"}, "$", grandTotal))
    } else {
      var panelFooter = React.DOM.em(null, "Do something on the left to get started!")
    }
    return (
      React.DOM.div({className: "panel panel-default calculation-box"}, 
      React.DOM.ul({className: "list-group"}, 
      CalculationItem({itemName: "Ingredients", itemTotal: ingredientsTotal}), 
      CalculationItem({itemName: "Supplies", itemTotal: suppliesTotal}), 
      CalculationItem({itemName: "Time", itemTotal: timeTotal}), 
      CalculationItem({itemName: "Overhead", itemTotal: overheadTotal}), 
      CalculationItem({itemName: "Delivery", itemTotal: deliveryTotal})
      ), 
      React.DOM.div({className: "panel-footer"}, 
      panelFooter
      )
      )
      );
  }
});

var CalculationItem = React.createClass({displayName: 'CalculationItem',
  render: function() {
    if (typeof this.props.itemTotal != 'undefined' && this.props.itemTotal > 0) {
      return (React.DOM.li({className: "list-group-item"}, this.props.itemName, " total: ", React.DOM.strong({className: "pull-right"}, "$", this.props.itemTotal)));
    } else {
      return null;
    }
  }
});

React.renderComponent(
    Calculator(null),
    document.getElementById('content')
    );
