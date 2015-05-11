var React = require('react');
window.React = React;

var appRouter = require('./router/app-router.jsx');
var histroy = require('./router/history');

var App = require('./components/jsx/app.jsx');
var keyboard = require('./utils/keyboard');

require('./utils/window-event');
//require('../js-app/app-collection');

require('domready')(() => {
  //show canvas demo
    //React.render(<HelloMessage name="Sebastian" />, document.body);
});
