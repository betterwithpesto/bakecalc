/** @jsx React.DOM */

var INGREDIENTS = [ 
{ "key": "baking-powder", "name": "baking powder", "unit": "teaspoons", "cost": 0.08 }, 
{ "key": "butter", "name": "butter", "unit": "cups", "cost": 0.5 }, 
{ "key": "chocolate-chips", "name": "chocolate chips", "unit": "cups", "cost": 1.1 }, 
{ "key": "cinnamon", "name": "cinnamon", "unit": "teaspoons", "cost": 0.06 }, 
{ "key": "cocoa", "name": "cocoa", "unit": "cups", "cost": 1.54 }, 
{ "key": "eggs", "name": "eggs", "unit": null, "cost": 0.25 }, 
{ "key": "flour", "name": "flour", "unit": "cups", "cost": 0.1 }, 
{ "key": "margarine", "name": "margarine", "unit": "cups", "cost": 0.5 }, 
{ "key": "milk", "name": "milk", "unit": "cups", "cost": 0.17 }, 
{ "key": "shortening", "name": "shortening", "unit": "cups", "cost": 0.66 }, 
{ "key": "sugar", "name": "sugar", "unit": "cups", "cost": 0.3 }, 
{ "key": "vanilla", "name": "vanilla", "unit": "teaspoons", "cost": 0.04 }, 
{ "key": "vegetable-oil", "name": "vegetable oil", "unit": "cups", "cost": 0.46 }, 
{ "key": "yeast", "name": "yeast", "unit": "packages", "cost": 0.51 } 
];

var SUPPLIES = [
{ "key": "box", "name": "box", "cost": 1.00 },
{ "key": "cake-board", "name": "cake board", "cost": 1.00 },
{ "key": "cake-circle", "name": "cake circle", "cost": 1.00 },
{ "key": "dowel-rod", "name": "dowel rod", "cost": 1.00 },
{ "key": "serving-stand", "name": "serving stand", "cost": 1.00 }
];


var runningKey = 0;

var Calculator = React.createClass({displayName: 'Calculator',
  getInitialState: function() {
    return { ingredients: [], supplies: [], hours: 0, wage: 0, overhead: 0, miles: 0, rate: 0 };
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
      var suppliesTotal = _.reduce(_.map(this.state.supplies, function(ing){ return ing['cost'] * ing['quantity'] }), function(memo, num){ return memo + num; }, 0).toFixed(2);
      var timeTotal = (this.state.hours * this.state.wage).toFixed(2);
      var overheadTotal = Number(this.state.overhead).toFixed(2);
      var deliveryTotal = (this.state.miles * this.state.rate).toFixed(2);
      return (
          React.DOM.div({className: "calculator"}, 
          IngredientsBox({presetIngredients: INGREDIENTS}), 
          SuppliesBox({presetSupplies: SUPPLIES}), 
          TimeBox({onUserInput: this.handleTimeInput}), 
          OverheadBox({onUserInput: this.handleOverheadInput}), 
          DeliveryBox({onUserInput: this.handleDeliveryInput}), 
          React.DOM.h4(null, "Time total: ", timeTotal), 
          React.DOM.h4(null, "Overhead total: ", overheadTotal), 
          React.DOM.h4(null, "Delivery total: ", deliveryTotal)
          )
          );
    }
});

var IngredientsBox = React.createClass({displayName: 'IngredientsBox',
  handleIngredientSelect: function(ingredient) {
    var ingredients = this.state.activeIngredients;
    ingredient["quantity"] = 1;
    ingredients.push(ingredient);
    this.setState({ activeIngredients: ingredients });
  },
    handleOtherIngredientSelect: function() {
      var ingredients = this.state.activeIngredients;
      var ingredient = { "key": runningKey, "cost": "", "quantity": 1 };
      runningKey = runningKey + 1;
      ingredients.push(ingredient);
      this.setState({ activeIngredients: ingredients });
    },
    handleIngredientChange: function(changes) {
      var ingredients = this.state.activeIngredients;
      ingredient = _.find(ingredients, function(ing){ return ing.key == changes.key });
      index = _.indexOf(ingredients, ingredient);
      ingredient[changes.fieldName] = changes.newValue;
      ingredients[index] = ingredient
  this.setState({ activeIngredients: ingredients });
    },
    render: function() {
      var ingredientLinks = _.difference(this.props.presetIngredients, this.state.activeIngredients).map(function(ingredient) {
        return (
          IngredientLink({onIngredientSelect: this.handleIngredientSelect, ingredient: ingredient})
          );
      }.bind(this));
      var ingredientFields = this.state.activeIngredients.map(function(ingredient) {
        return (
          IngredientInputs({onIngredientChange: this.handleIngredientChange, key: ingredient.key, ingredient: ingredient})
          );
      }.bind(this));
      var ingredientsTotal = _.reduce(_.map(this.state.activeIngredients, function(ing){ return ing['cost'] * ing['quantity'] }), function(memo, num){ return memo + num; }, 0).toFixed(2);
      return (
          React.DOM.div({className: "ingredientsBox"}, 
          React.DOM.h3(null, "Ingredients"), 
          ingredientFields, 
          React.DOM.div(null, "Choose your ingredients below:"), 
          ingredientLinks, 
          OtherIngredientLink({onOtherIngredientSelect: this.handleOtherIngredientSelect}), 
          React.DOM.h4(null, "Total: $", ingredientsTotal)
          )
          );
    }
});

var SuppliesBox = React.createClass({displayName: 'SuppliesBox',
  handleSupplySelect: function(supply) {
    var supplies = this.state.activeSupplies;
    supply["quantity"] = 1;
    supplies.push(supply);
    this.setState({ activeSupplies: supplies });
  },
    handleOtherSupplySelect: function() {
      var supplies = this.state.activeSupplies;
      var supply = { "key": runningKey, "cost": "", "quantity": 1 };
      runningKey = runningKey + 1;
      supplies.push(supply);
      this.setState({ activeSupplies: supplies });
    },
    handleSupplyChange: function(changes) {
      var supplies = this.state.activeSupplies;
      supply = _.find(supplies, function(ing){ return ing.key == changes.key });
      index = _.indexOf(supplies, supply);
      supply[changes.fieldName] = changes.newValue;
      supplies[index] = supply
  this.setState({ activeSupplies: supplies });
    },
    render: function() {
      var supplyLinks = _.difference(this.props.presetSupplies, this.state.activeSupplies).map(function(supply) {
        return (
          SupplyLink({onSupplySelect: this.handleSupplySelect, supply: supply})
          );
      }.bind(this));
      var supplyFields = this.state.activeSupplies.map(function(supply) {
        return (
          SupplyInputs({onSupplyChange: this.handleSupplyChange, key: supply.key, supply: supply})
          );
      }.bind(this));
      var suppliesTotal = _.reduce(_.map(this.state.activeSupplies, function(ing){ return ing['cost'] * ing['quantity'] }), function(memo, num){ return memo + num; }, 0).toFixed(2);
      return (
          React.DOM.div({className: "suppliesBox"}, 
          React.DOM.h3(null, "Supplies"), 
          supplyFields, 
          React.DOM.div(null, "Choose your supplies below:"), 
          supplyLinks, 
          OtherSupplyLink({onOtherSupplySelect: this.handleOtherSupplySelect})
          )
          );
    }
});

var IngredientLink = React.createClass({displayName: 'IngredientLink',
  handleClick: function(event) {
    this.props.onIngredientSelect(this.props.ingredient);
    return false;
  },
    render: function() {
      return(
        React.DOM.a({onClick: this.handleClick}, this.props.ingredient.name + " ")
        );
    }
});

var OtherIngredientLink = React.createClass({displayName: 'OtherIngredientLink',
  handleClick: function(event) {
    this.props.onOtherIngredientSelect();
    return false;
  },
    render: function() {
      return(
        React.DOM.a({onClick: this.handleClick}, "something else ")
        );
    }
});

var SupplyLink = React.createClass({displayName: 'SupplyLink',
  handleClick: function(event) {
    this.props.onSupplySelect(this.props.supply);
    return false;
  },
    render: function() {
      return(
        React.DOM.a({onClick: this.handleClick}, this.props.supply.name + " ")
        );
    }
});

var OtherSupplyLink = React.createClass({displayName: 'OtherSupplyLink',
  handleClick: function(event) {
    this.props.onOtherSupplySelect();
    return false;
  },
    render: function() {
      return(
        React.DOM.a({onClick: this.handleClick}, "something else ")
        );
    }
});

var IngredientInputs = React.createClass({displayName: 'IngredientInputs',
  handleChange: function(event) {
    var changeSummary = { key: this.props.key, fieldName: event.target.className, newValue: event.target.value };
    this.props.onIngredientChange(changeSummary);
    return false;
  },
    render: function() {
      if ( _.contains(_.pluck(presetIngredients, "key"), this.props.ingredient.key)) {
        var middleText = this.props.ingredient.unit + " of " + this.props.ingredient.name + " at ";
        var endText = "per " + this.props.ingredient.unit;
        var firstInput = React.DOM.input({defaultValue: this.props.ingredient.quantity, type: "number", className: "quantity", onChange: this.handleChange});
      } else {
        var middleText = " at ";
        var endText = "";
        var firstInput = React.DOM.input({defaultValue: this.props.ingredient.name, type: "text", className: "name", onChange: this.handleChange});
      }
      return (
        React.DOM.div(null, 
        firstInput, 
        middleText, 
        React.DOM.input({defaultValue: this.props.ingredient.cost, type: "number", className: "cost", onChange: this.handleChange}), endText
        )
        );
    }
});

var SupplyInputs = React.createClass({displayName: 'SupplyInputs',
  handleChange: function(event) {
    var changeSummary = { key: this.props.key, fieldName: event.target.className, newValue: event.target.value };
    this.props.onSupplyChange(changeSummary);
    return false;
  },
    render: function() {
      if (_.contains(_.pluck(presetSupplies, "key"), this.props.supply.key)) {
        var middleText = this.props.supply.unit + " of " + this.props.supply.name + " at ";
        var endText = "";
        var firstInput = React.DOM.input({defaultValue: this.props.supply.quantity, type: "number", className: "quantity", onChange: this.handleChange});
      } else {
        var middleText = " at ";
        var endText = "";
        var firstInput = React.DOM.input({defaultValue: this.props.supply.name, type: "text", className: "name", onChange: this.handleChange});
      }
      return (
        React.DOM.div(null, 
        firstInput, 
        middleText, 
        React.DOM.input({defaultValue: this.props.supply.cost, type: "number", className: "cost", onChange: this.handleChange}), endText
        )
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
        React.DOM.div(null, 
        React.DOM.h3(null, "Time"), 
        React.DOM.input({type: "number", ref: "timeHoursInput", onChange: this.handleChange}), 
        "hours at",  
        React.DOM.input({type: "number", ref: "timeWageInput", onChange: this.handleChange}), 
        "an hour"
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
        React.DOM.div(null, 
        React.DOM.h3(null, "Overhead"), 
        React.DOM.input({type: "number", ref: "overheadInput", onChange: this.handleChange})
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
        React.DOM.div(null, 
        React.DOM.h3(null, "Delivery"), 
        React.DOM.input({type: "number", ref: "deliveryMilesInput", onChange: this.handleChange}), 
        "hours at",  
        React.DOM.input({type: "number", ref: "deliveryRateInput", onChange: this.handleChange}), 
        "an hour"
        )
        );
    }
});

React.renderComponent(
    Calculator(null),
    document.getElementById('content')
    );
