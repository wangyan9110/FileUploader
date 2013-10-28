/**
 * FileName:uploader.js
 *
 * Author:wangyan
 * Date:2013-10-27 13:58
 * Version:V1.0.0.0
 * Email:yywang1991@gmail.com
 * Describe:
 *
 * 文件上传核心方法
 * Change Record:
 * {        date    name    describe}
 *
 */

window.uploader = {};
(function (window) {

    var _self;

    function uploader(url, data, files) {
        this._files = files;
        this._data = data;
        this._url = url;

        this._xhr = null;

        this.onloadstart = {};
        this.onload = {};
        this.onloadend = {};
        this.onprogress = {};
        this.onerror = {};
        this.ontimeout = {};
        this.callback = {};//请求完成后回调
        _self = this;
    }

    uploader.prototype = {
        init: function () {
            if (!isValid()) {
                throw e;
            }
            this._xhr = new XMLHttpRequest();
            this._bindEvents();
        },
        send: function () {
            if (this._xhr == null) {
                this.init();
            }
            var formData = this._createFormData();
            this._xhr.open('post', this._url, true);
            this._xhr.send(formData);
        },
        _bindEvents: function () {
            _self = this;
            this._xhr.upload.loadstart = function (e) {
                evalFunction(_self.onloadstart, e);
            }
            this._xhr.upload.onload = function (e) {
                evalFunction(_self.onload, e);
            };
            this._xhr.upload.onloadend = function (e) {
                evalFunction(_self.onloadend, e);
            }
            this._xhr.upload.onprogress = function (e) {
                evalFunction(_self.onprogress, e)
            };
            this._xhr.upload.onerror = function (e) {
                evalFunction(_self.onerror, e);
            };
            this._xhr.upload.ontimeout = function (e) {
                evalFunction(_self.ontimeout, e);
            }

            this._xhr.onreadystatechange = function () {
                if (_self._xhr.readyState == 4) {
                    if (typeof _self.callback === 'function') {
                        var status = _self._xhr.status;
                        var data = _self._xhr.responseText;
                        _self.callback(status, data);
                    }
                }
            }
        },
        _createFormData: function () {
            var formData = new FormData();
            this._addDataToFormData(formData);
            this._addFileToFormData(formData);
            return formData;
        },
        _addDataToFormData: function (formData) {
            if (this._data) {
                for (var item in this._data) {
                    formData.append(item, this._data[item]);
                }
            }
        },
        _addFileToFormData: function (formData) {
            if (this._files) {
                for (var i = 0; i < this._files.length; i++) {
                    var file = this._files[i];
                    formData.append('file[' + i + ']', this._files[i]);
                }
            }
        }
    };

    function isValid() {
        return typeof FileReader !== 'undefined';
    }

    function evalFunction(fn, args) {
        if (typeof fn === 'function') {
            fn(args);
        }
    }

    var uploaderFactory = {
        send: function (url, data, files, callback) {
            var insUploader = new uploader(url, data, files);
            insUploader.callback = function (status, resData) {
                if (typeof callback === 'function') {
                    callback(status, resData);
                }
            }
            insUploader.send();
            return insUploader;
        }
    };

    window.uploader = uploader;
    window.uploaderFactory = uploaderFactory;
})(window);