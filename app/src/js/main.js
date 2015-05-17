var React = require('react');
window.React = React;

var appRouter = require('./router/app-router.jsx');
var histroy = require('./router/history');

var App = require('./components/jsx/app.jsx');
var keyboard = require('./utils/keyboard');

require('./utils/window-event');
require('../js-app/app-collection');


// -------------------

var GlobalDebug = (function () {
    var savedConsole = console;
    return function(debugOn,suppressAll){
        var suppress = suppressAll || false;
        if (debugOn === false) {
            console = {};
            console.log = function () { };
            if(suppress) {
                console.info = function () { };
                console.warn = function () { };
                console.error = function () { };
            } else {
                console.info = savedConsole.info;
                console.warn = savedConsole.warn;
                console.error = savedConsole.error;
            }
        } else {
            console = savedConsole;
        }
    }
})();

// -------------------

require('domready')(() => {
    keyboard.start();

    histroy.start({pushState : true});
    React.render(<App/>, document.getElementById('app'));

});
