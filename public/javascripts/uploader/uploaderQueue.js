/**
 * FileName:
 *
 * Author:wangyan
 * Date:2013-10-27 20:50
 * Version:V1.0.0.0
 * Email:yywang1991@gmail.com
 * Describe: 请描述本文件功能
 */


window.uploaderQueue = {};

/**
 * the queue
 */
(function (upladerQueue) {

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
        getDataByIndex: function (index) {
            if (index < 0) {
                return null;
            }
            return this._datas[index];
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


    upladerQueue.Queue = getInstace();
    upladerQueue.UploadStatus = Status;
})(window.uploaderQueue);

/**
 * the queue uploader engine
 */
(function (upladerQueue) {

    var instance = null;
    var _self;

    function uploadEngine() {
        this._url = null;
        this._curUploadingKey = -1;//标志
        this.uploadStatusChanged = {};
        this.uploadItemProgress={};
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
            var index = upladerQueue.Queue.nextReadyingIndex();
            if (index != -1) {
                this._uploadItem(index);
            } else {
                this._curUploadingKey = -1;
                return null;
            }
        },
        _uploadItem: function (index) {
            var data = upladerQueue.Queue.getDataByIndex(index).data;
            _self = this;
            this._readyUploadItem(index);
            var upload = uploaderFactory.send(this._url, null, data.files, function (status, data) {
                _self._completedUploadItem.call(_self, status, data);
            });

            this._uploadItemProgress(upload);
        },
        _uploadItemProgress: function (upload) {
            upload.onprogress = function (e) {
               _self.uploadItemProgress(_self._curUploadingKey,e);
            }
        },
        _readyUploadItem: function (index) {
            this._curUploadingKey = upladerQueue.Queue.getDataByIndex(index).key;
            if (typeof this.uploadStatusChanged === 'function') {
                this.uploadStatusChanged(this._curUploadingKey, upladerQueue.UploadStatus.Uploading);
            }
            upladerQueue.Queue.setItemStatus(this._curUploadingKey, upladerQueue.UploadStatus.Uploading);
        },
        _completedUploadItem: function (status, data) {
            if (typeof this.uploadStatusChanged === 'function') {
                this.uploadStatusChanged(this._curUploadingKey, upladerQueue.UploadStatus.Complete);
            }
            upladerQueue.Queue.setItemStatus(this._curUploadingKey, upladerQueue.UploadStatus.Complete);
            this._startUpload();
        }
    };

    function getInstace() {
        if (instance === null) {
            instance = new uploadEngine();
        }
        return instance;
    }

    upladerQueue.Engine = getInstace();
})(window.uploaderQueue);
