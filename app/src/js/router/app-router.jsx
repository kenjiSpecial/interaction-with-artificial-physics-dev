var Router = require('./router');

var history = require('./history');
var _ = require('lodash');

var appAction = require('../actions/app-action');

var appStore = require('../stores/app-store');

var appData = require('../data/app-data');

var AppConstants = require('../utils/constants');

var isLoad = 'isLoad';

var Promise = require('bluebird');
var load = Promise.promisify(require('img'));

// ===========
//    view
var loadView = require('../components/js/load-view');

var canvasApp = require('../components/js/canvas-app');

var AppRouter = Router.extend({
    initialize: function () {
        _.bindAll(this, 'onLoadStartHandler', 'onLoadDoneHandler', 'onWorkBallAnimationDoneHandler', 'onCloseWork');

        appStore.on(AppConstants.LOAD_START, this.onLoadStartHandler);
        appStore.on(AppConstants.APP_LOAD_DONE, this.onLoadDoneHandler);

        appStore.on(AppConstants.ON_WORK_BALL_ANIMATION_DONE, this.onWorkBallAnimationDoneHandler);
        appStore.on(AppConstants.CLOSE_WORK, this.onCloseWork);
    },

    prevRoute: "",

    routes: {
        '': 'index',
        'work/:query': "work",
        '*notFound': 'notFound'
    },

    index: function () {


        if (appStore.get("isTransition")) {
            this.navigate(this.prevRoute);

            return;
        }

        this.prevRoute = "";

        if (appStore.get(isLoad)) this.renderIndex();
        else                      appAction.loadStart();


    },

    work: function (query) {

        if (appStore.get("isTransition")) {
            this.navigate(this.prevRoute);
            return;
        }

        this.prevRoute = "/work/" + query;

        if (appStore.get(isLoad)) this.renderWork(query);
        else                      appAction.loadStart();


    },

    notFound: function () {
        this.navigate("", {trigger: true});
    },

    renderIndex: function () {
        appAction.startRenderingIndex();
    },

    renderInitIndex: function () {
        canvasApp.renderIndex();
        appAction.onMouseMoveSet();
    },

    renderWork: function (workID) {
        appAction.renderWork(workID);
    },

    renderWorkInit: function (workID) {
        canvasApp.forceInitialize();

        appAction.forceSetWork(workID);
        setTimeout(function () {
            appAction.onAnimationDone();
        }, 1000);

    },

    renderAction: function (imageArr) {
        var imageObj = {};

        for (var ii = 0; ii < imageArr.length; ii++) {
            imageObj[appData.demoImg[ii]] = imageArr[ii];
        }

        // loaded image -> dispathc load done action.
        setTimeout(function () {
            appAction.loadDone(imageObj);
        }, 600);
    },

    onChangeRooterHandler: function () {
        //console.log('onChangeRooterHandler');

    },

    onLoadStartHandler: function () {
        var images = appData.demoImg;
        if (images.length > 0) {
            Promise.all(images.map(x => load(x))).then(this.renderAction);
        } else {

            setTimeout(function () {
                var imageObj = {};
                appAction.loadDone(imageObj);
            }, 600);
        }

    },

    onLoadDoneHandler: function () {
        console.log('onLoadDoneHandler');
        var pr = loadView.fadeOut()
        var self = this;

        pr.then(function () {
            self.onRenderApp();
        });

    },

    onRenderApp: function () {
        canvasApp.initialize();
        var str = history.getFragment();
        var url, param;

        if (str.lastIndexOf("/") > -1) {
            url = str.substring(0, str.lastIndexOf("/"));
            param = str.substring(str.lastIndexOf("/") + 1, str.length);
            if (param.lastIndexOf("/") > -1) {
                param = param.substr(0, param.lastIndexOf("/"));
            }
        } else {
            url = str;
        }

        switch (url) {
            case "":
                this.renderInitIndex();
                break;
            case "work":
                this.renderWorkInit(param);
                break;
        }


    },

    onWorkBallAnimationDoneHandler: function () {
        var workdata = appStore.getSelectedWorkData();
        this.navigate("/work/" + workdata.id);

        setTimeout(function () {
            appAction.changeDirectoryToWork();
        }, 0);
    },

    onCloseWork: function () {
        var self = this;
        setTimeout(function () {
            this.navigate("", {trigger: true});
        }.bind(this), 0);
    }


});


var appRouter = new AppRouter();


module.exports = appRouter;
