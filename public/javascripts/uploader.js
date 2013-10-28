/**
 * FileName:
 *
 * Author:wangyan
 * Date:2013-10-26 15:33
 * Version:V1.0.0.0
 * Email:yywang1991@gmail.com
 * Describe:        拖曳上传
 *  change Record:
 * {        date    name    describe}
 *
 */

window.uploader = {};

(function (document, uploader) {

    var _self = {};

    function uploader(args) {
        this._id = args.id;
        this._url = args.url;

        this._xhr = null;

        if (args.events) {
            this._nonsuppport = args.events.nonsuppport || {};
            this._dragenter = args.events.dragenter || {};
            this._dragover = args.events.dragover || {};
            this._dragleave = args.events.dragleave || {};
            this._drop = args.events.drop || {};
            this._progress = args.events.progress || {};
        }
        _self = this;
    }

    uploader.prototype = {

        init: function () {
            if (!isValid()) {
                throw  e;
            }
            this._bindDragEvent();
            this._createXhr();
        },
        send: function (files) {
            var formData = this._createFormData(files);
            this._xhr.open('post', this._url, true);
            this._xhr.send(formData);
            console.log(this._xhr.responseText);
        },
        _bindDragEvent: function () {
            $(this._id).addEventListener('dragenter', function (e) {
                console.log('dragenter...');
                evalFunction(this._dragenter);
                e.preventDefault();
            }, false);
            $(this._id).addEventListener('dragover', function (e) {
                console.log('dragover...');
                evalFunction(this._dragover);
                e.preventDefault();
            }, false);
            $(this._id).addEventListener('dragleave', function (e) {
                console.log('dragleave...');
                evalFunction(this._dragleave);
                e.preventDefault();
            }, false);
            $(this._id).addEventListener('drop', function (e) {
                console.log('drop...');
                e.preventDefault();
                evalFunction(this._drop);
                _self.send(e.dataTransfer.files);
            }, false);

        },
        _createXhr: function () {
            this._xhr = new XMLHttpRequest();
            this._bindXhrEvent();
        },
        _bindXhrEvent: function () {
            this._xhr.upload.onload = function (e) {
                console.dir(e);
                console.log('上传完成');
            };
            this._xhr.upload.onloadend = function (e) {
                console.dir(_self._xhr.response);
            };
            this._xhr.upload.onprogress = function (e) {
                console.dir(e);
            };
            this._xhr.upload.onerror = function (e) {

            };
            this._xhr.upload.ontimeout = function (e) {

            }
            this._xhr.onreadystatechange = function () {
                if (_self._xhr.readyState == 4 && _self._xhr.status == 200) {
                    console.log(_self._xhr.responseText);
                }
            }
        },
        _createFormData: function (files) {
            var formData = new FormData();
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                formData.append('file[' + i + ']', file);
                console.log(file.name);
            }
            return formData;
        }
    };

    function $(id) {
        return document.getElementById(id);
    }

    function isValid() {
        return typeof FileReader !== 'undefined';
    }

    function evalFunction(fn) {
        if (typeof fn === 'function') {
            fn();
        }
    }

    window.uploader1 = uploader;
})(document, uploader);