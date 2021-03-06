/** @jsx React.DOM */

var ingredients = [ { "name": "baking powder", "unit": "teaspoons", "cost": 0.08 },
{ "name": "butter", "unit": "cups", "cost": 0.5 },
{ "name": "chocolate chips", "unit": "cups", "cost": 1.1 },
{ "name": "cinnamon", "unit": "teaspoons", "cost": 0.06 },
{ "name": "cocoa", "unit": "cups", "cost": 1.54 },
{ "name": "eggs", "unit": null, "cost": 0.25 },
{ "name": "flour", "unit": "cups", "cost": 0.1 },
{ "name": "margarine", "unit": "cups", "cost": 0.5 },
{ "name": "milk", "unit": "cups", "cost": 0.17 },
{ "name": "shortening", "unit": "cups", "cost": 0.66 },
{ "name": "sugar", "unit": "cups", "cost": 0.3 },
{ "name": "vanilla", "unit": "teaspoons", "cost": 0.04 },
{ "name": "vegetable oil", "unit": "cups", "cost": 0.46 },
{ "name": "yeast", "unit": "packages", "cost": 0.51 } ]

var IngredientBox = React.createClass({displayName: 'IngredientBox',
  getInitialState: function() {
    return { ingredients: ingredients };
  },
    render: function() {
      var ingredientLinks = this.props.ingredients.map(function(ingredient) {
        return (
          IngredientLink({name: ingredient.name})
          );
      });
      return (
        React.DOM.div({className: "ingredientBox"}, 
        React.DOM.h3(null, "Ingredients"), 
        React.DOM.span(null, "Choose your ingredients below:"), 
        ingredientLinks
        )
        );
    }
});

var IngredientLink = React.createClass({displayName: 'IngredientLink',
  render: function() {
    return (
      React.DOM.span(null, this.props.name)
      );
  }
});

React.renderComponent(
    IngredientBox(null),
    document.getElementById('content')
    );
