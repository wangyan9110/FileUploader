/**
 * FileName:
 *
 * Author:wangyan
 * Date:2013-10-27 15:41
 * Version:V1.0.2.0
 * Email:yywang1991@gmail.com
 * Describe: 请描述本文件功能
 *
 * Change Record:
 * {        date    name    describe}
 *
 */


window.uploaderApp = {};

/**
 * the simple jquery
 */
(function (app) {
    function App$(id) {
        return new App$.fn.init(id);
    }

    App$.fn = App$.prototype = {
        init: function (id) {
            if (typeof id === 'string') {
                this[0] = document.getElementById(id);
                this.length = 1;
                return this;
            }
            this[0] = id;
            this.length = 1;
            return this;
        }, bind: function (eventType, eventListener) {
            for (var index = 0; index < this.length; index++) {
                this[index].addEventListener(eventType, function (e) {
                    eventListener(e);
                    e.preventDefault();
                }, false);
            }
            return this;
        }
    }

    App$.eval = function (fn, agrs) {
        if (typeof fn === 'function') {
            fn(args);
        }
    }

    App$.fn.init.prototype = App$.fn;

    app.$ = App$;
})(window.uploaderApp);

/**
 *  the upload area options
 */
(function (app) {

    var _self = null;

    function uploaderArea(id) {
        this._id = id;

        this.dragenter = {};
        this.dragover = {};
        this.dragleave = {};
        this.drop = {};

        _self = this;
    }

    uploaderArea.prototype = {
        init: function () {
            this._bindEvents();
        },
        _bindEvents: function () {
            _self = this;
            app.$(this._id).bind('dragenter',function (e) {
                console.log('dragenter...');
                app.$.eval(_self.dragenter, e);
            }).bind('dragover',function (e) {
                    app.$.eval(_self.dragover, e);
                }).bind('dragleave',function (e) {
                    app.$.eval(_self.dragleave);
                }).bind('drop', function (e) {
                    app.$.eval(_self.drop, e);
                });
        }
    };
    app.area = uploaderArea;
})(window.uploaderApp);

(function (app) {
    var _self;

    function uploaderMain(id, url) {
        this._id = id;
        this._area = null;
        this.uploaders = [];
    }

    uploaderMain.prototype = {
        init: function () {
            _self = this;
            this._area = new app.area(this._id);

            this.drop = function (e) {

            }
        }
    };


    app.main = uploaderMain;
})(window.uploaderApp);