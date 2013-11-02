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
                    e.preventDefault();
                    eventListener(e);
                }, false);
            }
            return this;
        }
    }

    App$.eval = function (fn, args) {
        if (typeof fn === 'function') {
            return fn(args);
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

        this.cancelItem = {};

        _self = this;
    }

    uploaderArea.prototype = {
        init: function () {
            this._bindEvents();
        },
        changeItemProgress: function (key, progress) {
            var status = $('#' + key).find('.file_upload_status');
            status.html(progress + '%');
            this._changeItemMask(key, progress);
        },
        completeItem: function (key) {
            var status = $('#' + key).find('.file_upload_status');
            status.html('上传完成');
        },
        hideItemCancel: function (key) {
            $('#' + key).find('.cancle_upload').hide();
        },
        showItemCancel: function (key) {
            $('#' + key).find('.cancle_upload').show();
        },
        _bindEvents: function () {
            _self = this;
            app.$(this._id).bind('dragenter',function (e) {
                app.$.eval(_self.dragenter, e);
            }).bind('dragover',function (e) {
                    console.log('dragover...');
                    app.$.eval(_self.dragover, e);
                }).bind('dragleave',function (e) {
                    console.log('dragleave...');
                    app.$.eval(_self.dragleave);
                }).bind('drop', function (e) {
                    var key = app.$.eval(_self.drop, e);
                    var obj = {};
                    var fileObj = _self._getFileNamesAndSize(e.dataTransfer.files);
                    obj.fileName = fileObj.name;
                    obj.fileSize = _self._calcuFileSize(fileObj.size);
                    _self._addItem(key, obj);
                });
        },
        _addItem: function (key, obj) {
            var html = '';
            html += ' <div class="upload_item" id="' + key + '">';
            html += '<div class="inline_mask" style=""></div>' +
                '<div class="file_name">' + obj.fileName + '</div>';
            html += ' <div class="file_size">' + obj.fileSize + '</div>';
            html += '<div class="file_upload_status">等待上传...</div>';
            html += '<a class="cancle_upload" href="javascript:;" key=' + key + ' title="取消"></a>';
            html += '</div>';
            $('#' + this._id).append(html);
            this._bindItemCancel(key);
        },
        _bindItemCancel: function (key) {
            $('#' + key).find('.cancle_upload').click(function () {

                var key = $(this).attr('key');
                if (typeof _self.cancelItem === 'function') {
                    var isDelete = _self.cancelItem(key);
                    _self._removeItem(key);
                }
            });
        },
        _removeItem: function (key) {
            $('#' + key).replaceWith('');
        },
        _changeItemMask: function (key, progress) {
            var width = $('#' + key).width() - 1;
            $('#' + key).find('.inline_mask').width(width * (Math.floor(progress) / 100));
        },
        _calcuFileSize: function (size) {
            var kSize = size / 1024;
            if (kSize < 1024) {
                return kSize.toFixed(2) + 'K';
            } else {
                var mSize = kSize / 1024;
                if (mSize < 1024) {
                    return mSize.toFixed(2) + 'M';
                } else {
                    var gSize = mSize / 1024;
                    return gSize.toFixed(2) + 'G';
                }
            }
        },
        _getFileNamesAndSize: function (files) {
            var filename = '';
            var size = 0;
            for (var i = 0; i < files.length; i++) {
                filename += files[i].name;
                size += files[i].size;
            }
            return {name: filename, size: size};
        }
    };
    app.area = uploaderArea;
})(window.uploaderApp);

(function (app) {
    var _self;

    function uploaderMain(id) {
        this._id = id;
        this._area = null;
        this.uploaders = [];

        this._URL = 'file/uploader';
    }

    uploaderMain.prototype = {
        init: function () {
            _self = this;
            this._initArea();
            this._initQueueEng();
        },
        _initQueueEng: function () {
            uploaderQueue.Engine.setUrl(this._URL);
            uploaderQueue.Engine.uploadStatusChanged = function (key, status) {
                if (status === uploaderQueue.UploadStatus.Uploading) {
                    _self._area.hideItemCancel(key);
                } else if (status === uploaderQueue.UploadStatus.Complete) {
                    _self._area.completeItem(key);
                    _self._area.showItemCancel(key);
                }
            }
            uploaderQueue.Engine.uploadItemProgress = function (key, e) {
                var progress = e.position / e.total;
                _self._area.changeItemProgress(key, Math.round(progress * 100));
            }
        },
        _initArea: function () {
            this._area = new app.area(this._id);
            this._area.init();
            this._area.drop = function (e) {
                var key = uploaderQueue.Queue.add({files: e.dataTransfer.files});
                uploaderQueue.Engine.run();
                return key;
            }
            this._area.cancelItem = function (key) {
                uploaderQueue.Queue.remove(key);
            }
        }
    };


    app.main = uploaderMain;
})(window.uploaderApp);