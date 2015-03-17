# Ampersand-ReactView mixin

Use this mixin in your React components to automatically get notified of changes that happen in your Ampersand.js models or collections.
It will call the component `forceUpdate` method whenever a "change" event is triggered in the model properties.
There's no need to manually listen to the model and call `setState` anymore!

It also adds `listenTo()` and `listenToAndRun()` methods (Ampersand view style) that will stop listening to the events when the component is unmounted.

## Usage

```js

// super-cool-react-view.jsx
var AmpersandReactViewMixin = require('ampersand-react-view-mixin');

module.exports = React.createClass({
  mixins: [AmpersandReactViewMixin],
  
  componentDidMount: function() {
    this.listenToAndRun(this.model, 'change:someProp', this.onSomePropChanged);
  },
  
  render: function() {
    return <div>{this.model.someProp}</div>
  }
  
  onSomePropChanged: function() {
    console.log('awesome!');
  }
});

// another-view.jsx
var SuperCoolReactView = require('super-cool-react-view.jsx');

module.exports = React.createClass({
  render: function() {
    return <SuperCoolReactView model={someModel} />
  }
});
```
