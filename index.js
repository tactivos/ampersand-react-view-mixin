module.exports = {
	componentWillMount: function() {
		// convenient aliases
		this.model = this.props.model;
		this.collection = this.props.collection;
	},

	componentDidMount: function() {
		this._boundForceUpdate = this.forceUpdate.bind(this, null);

		var modelOrCollection = this.getAmpersandObject();
		modelOrCollection.on(this.getEventsToListen(modelOrCollection), this._boundForceUpdate, this);
	},

	getEventsToListen: function(ampersandObject) {
		var fn = this.getEventNames || this.getDefaultEventNames;
		return fn(ampersandObject);
	},

	getKeys: function(obj){
		var arr = [];
		for (var key in obj) arr.push(key);
		return arr;
	},

	getDefaultEventNames: function(ampersandObject) {
		if (ampersandObject.isCollection) return "add remove";


		var properties = this.getKeys(ampersandObject._definition);
		properties = properties.concat(this.getKeys(ampersandObject._derived));
		properties = properties.concat(this.getKeys(ampersandObject._children).filter(function(key) {
			return !ampersandObject._children[key].isCollection;
		}));

		propertiesChanged = properties.map(function(p) {
			return "change:" + p;
		});

		collectionsChanged = this.getKeys(ampersandObject._children).filter(function(key) {
			return ampersandObject._children[key].isCollection;
		}).map(function(c) {
			return 'add:' + c + ' remove:' + c
		});

		return propertiesChanged.concat(collectionsChanged).join(' ');
	},

	componentWillUnmount: function() {
		var modelOrCollection = this.getAmpersandObject();
		modelOrCollection.off(this.getEventsToListen(modelOrCollection), this._boundForceUpdate, this);

		this.stopListening();
	},

	getAmpersandObject: function() {
		return this.props.collection || this.props.model;
	},

	listenTo: function(object, events, handler) {
		var listeners = this._listeners || (this._listeners = []);
		listeners.push(object);
		object.on(events, handler, this);
	},

	listenToAndRun: function(object, events, handler) {
		this.listenTo(object, events, handler);
		handler();
	},

	stopListening: function() {
		var listeners = this._listeners;
		if (!listeners) return;

		// remove all callbacks with this context
		listeners.forEach(function(listener) {
			listener.off(null, null, this);
		}.bind(this));
	}
};
