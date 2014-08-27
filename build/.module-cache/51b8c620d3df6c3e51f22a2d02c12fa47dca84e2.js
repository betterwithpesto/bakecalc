/** @jsx React.DOM */

var defaultIngredients = [ 
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

var defaultSupplies = [
{ "key": "box", "name": "box", "cost": 1.00 },
{ "key": "cake-board", "name": "cake board", "cost": 1.00 },
{ "key": "cake-circle", "name": "cake circle", "cost": 1.00 },
{ "key": "dowel-rod", "name": "dowel rod", "cost": 1.00 },
{ "key": "serving-stand", "name": "serving stand", "cost": 1.00 }
];


var runningKey = 0;

var Calculator = React.createClass({displayName: 'Calculator',
    render: function() {
      return (
          React.DOM.div({className: "calculator"}, 
          IngredientsBox({defaultIngredients: defaultIngredients})
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
    getInitialState: function() {
      return { activeIngredients: [] };
    },
    render: function() {
      var ingredientLinks = _.difference(this.props.defaultIngredients, this.state.activeIngredients).map(function(ingredient) {
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
      supplys.push(supply);
      this.setState({ activesupplys: supplys });
    },
    handlesupplyChange: function(changes) {
      var supplys = this.state.activesupplys;
      supply = _.find(supplys, function(ing){ return ing.key == changes.key });
      index = _.indexOf(supplys, supply);
      supply[changes.fieldName] = changes.newValue;
      supplys[index] = supply
  this.setState({ activesupplys: supplys });
    },
    getInitialState: function() {
      return { activesupplys: [] };
    },
    render: function() {
      var supplyLinks = _.difference(this.props.defaultsupplys, this.state.activesupplys).map(function(supply) {
        return (
          supplyLink({onsupplySelect: this.handlesupplySelect, supply: supply})
          );
      }.bind(this));
      var supplyFields = this.state.activesupplys.map(function(supply) {
        return (
          supplyInputs({onsupplyChange: this.handlesupplyChange, key: supply.key, supply: supply})
          );
      }.bind(this));
      var supplysTotal = _.reduce(_.map(this.state.activesupplys, function(ing){ return ing['cost'] * ing['quantity'] }), function(memo, num){ return memo + num; }, 0).toFixed(2);
      return (
          React.DOM.div({className: "supplysBox"}, 
          React.DOM.h3(null, "supplys"), 
          supplyFields, 
          React.DOM.div(null, "Choose your supplys below:"), 
          supplyLinks, 
          OthersupplyLink({onOthersupplySelect: this.handleOthersupplySelect}), 
          React.DOM.h4(null, "Total: $", supplysTotal)
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


var IngredientInputs = React.createClass({displayName: 'IngredientInputs',
  handleChange: function(event) {
    var changeSummary = { key: this.props.key, fieldName: event.target.className, newValue: event.target.value };
    this.props.onIngredientChange(changeSummary);
    return false;
  },
    render: function() {
      if (typeof this.props.ingredient.unit == "undefined") {
        var middleText = " at ";
        var endText = "";
        var firstInput = React.DOM.input({defaultValue: this.props.ingredient.name, type: "text", className: "name", onChange: this.handleChange});
      } else {
        var middleText = this.props.ingredient.unit + " of " + this.props.ingredient.name + " at ";
        var endText = "per " + this.props.ingredient.unit;
        var firstInput = React.DOM.input({defaultValue: this.props.ingredient.quantity, type: "number", className: "quantity", onChange: this.handleChange});
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

React.renderComponent(
    Calculator({defaultIngredients: defaultIngredients}),
    document.getElementById('content')
    );
