/**
 * FileName:
 *
 * Author:wangyan
 * Date:2013-10-27 15:41
 * Version:V1.0.0.0
 * Email:yywang1991@gmail.com
 * Describe: 请描述本文件功能
 *
 * Change Record:
 * {        date    name    describe}
 *
 */


window.uploaderApp = {};

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

    var Status = {
        Ready: 0,
        Uploading: 1,
        Complete: 2
    }

    var _self = null;

    var instance = null;

    function Queue() {
        this._datas = [];
        this._curSize = 0;//当前长度


        _self = this;
    }

    Queue.prototype = {
        add: function (data) {
            var key = new Date().getTime();
            this._datas.push({key: key, data: data, status: Status.Ready});
            this._curSize = this._datas.length;
            return key;
        },
        remove: function (key) {
            var index = this._getIndexByKey(key);
            this._datas.splice(index, 1);
            this._curSize = this._datas.length;
        },
        get: function (key) {
            var index = this._getIndexByKey(key);
            return index != -1 ? this._datas[index].data : null;
        },
        clear: function () {
            this._datas = [];
            this._curSize = this._datas.length;
        },
        size: function () {
            return this._curSize;
        },
        setItemStatus: function (key, status) {
            var index = this._getIndexByKey(key);
            if (index != -1) {
                this._datas[index].status = status;
            }
        },
        nextReadyingIndex: function () {
            for (var i = 0; i < this._datas.length; i++) {
                if (this._datas[i].status == Status.Ready) {
                    return i;
                }
            }
            return -1;
        },
        _getIndexByKey: function (key) {
            for (var i = 0; i < this._datas.length; i++) {
                if (this._datas[i].key == key) {
                    return i;
                }
            }
            return -1;
        }
    };

    function getInstace() {
        if (instance === null) {
            instance = new Queue();
            return instance;
        } else {
            return instance;
        }
    }


    app.Queue = getInstace();
    app.UploadStatus = Status;
})(window.uploaderApp);

(function (app) {

    var instance = null;
    var _self;

    function uploadEngine() {
        this._url = null;
        this._curUploadingKey = -1;//标志
        this.uploadStatusChanged = {};
        _self = this;
    }

    uploadEngine.prototype = {
        setUrl: function (url) {
            this._url = url;
        },
        run: function () {
            if (this._curUploadingKey === -1 && this._url) {
                this._startUpload();
            }
        },
        _startUpload: function () {
            _self = this;
            var index = app.Queue.nextReadyingIndex();
            if (index != -1) {
                this._uploadItem(index);
            } else {
                this._curUploadingKey = -1;
                return null;
            }
        },
        _uploadItem: function (index) {
            var data = this._datas[index].data;
            _self = this;
            this._readyUploadItem(index);
            var upload = uploader.send(this._url, null, data.files, function (status, data) {
                _self._completedUploadItem.call(_self, status, data);
            });
            this._uploadItemProgress(upload);
        },
        _uploadItemProgress: function (upload) {
            upload.onprogress = function (e) {
                console.dir(e);
            }
        },
        _readyUploadItem: function (index) {
            this._curUploadingKey = this._datas[index].key;
            this.uploadStatusChanged(this._curUploadingKey, app.UploadStatus.Uploading);
            app.Queue.setItemStatus.call(this, this._curUploadingKey, app.UploadStatus.Uploading);
        },
        _completedUploadItem: function (status, data) {
            this.uploadStatusChanged(this._curUploadingKey, app.UploadStatus.Complete);
            app.Queue.setItemStatus.call(this, this._curUploadingKey, app.UploadStatus.Complete);
            this._startUpload();
        }
    };

    function getInstace() {
        if (instance === null) {
            instance = new uploadEngine();
        }
        return instance;
    }

    app.Engine = getInstace();
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