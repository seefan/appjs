/**
 * h5扩展，文件管理，上传下载，压缩解压等
 * @class app.file
 */
(function (app, s, undefined) {
    /**
     * 所有的下载器
     * @property downloader
     * @type {downloader}
     */
    s.downloader = {};
    /**
     * 所有的上载器
     * @property uploader
     * @type {uploader}
     */
    s.uploader = {};
    /**
     * 下载文件
     *
     * @method download
     * @param url {string} 下载的地址
     * @param param 参数
     * @param callback {function} 状态改变回调，返回{filename:'文件名',state:'下载的状态',total:'总大小',download:'下载完成大小'}
     * @param state  {boolean} 状态改变时是否通知回调，设置为true时，在下载时将不断触发callback
     *
     * @returns {number} 任务的ID
     */
    s.download = function (url, param, callback, state) {
        var task = plus.downloader.createDownload(url, param);
        if (typeof callback === 'function') {
            task.addEventListener("statechanged", function (t) {
                if (!task) {
                    return;
                }
                if (state === true || t.state == 4) {
                    callback({filename: t.filename, state: t.state, total: t.totalSize, download: t.downloadedSize});
                }
            });
        }
        s.downloader[task.id] = task;
        task.start();
        return task.id;
    };
    /**
     * 中止一个下载
     *
     * @method abortDownload
     * @param id 任务的id
     */
    s.abortDownload = function (id) {
        if (s.downloader.hasOwnProperty(id)) {
            s.downloader[id].abort();
            delete s.downloader[id];
        }
    };
    /**
     * 上传文件
     *
     * @method upload
     * @param server 上传服务器地址
     * @param file 上传的文件地址
     * @param param 附加的参数
     * @param callback  {function} 状态改变回调，返回{state:'上传的状态',total:'总大小',upload:'上传完成大小',response:'服务器返回的内容'}
     * @param state  {boolean} 状态改变时是否通知回调，设置为true时，callback将在上传时不断触发。
     *
     */
    s.upload = function (server, file, param, callback, state) {
        var task = plus.uploader.createUpload(server,
            {method: "POST"}
        );
        app.util.each(param, function (i, e) {
            task.addData(i, e[i]);
        }, true);

        task.addFile(file, {key: file});
        if (typeof callback === 'function') {
            task.addEventListener("statechanged", function (t) {
                if (!task) {
                    return;
                }
                if (state === true) {
                    callback({state: t.state, total: t.totalSize, upload: t.uploadedSize});
                } else if (t.state == 4) {
                    callback({state: t.state, total: t.totalSize, upload: t.uploadedSize, response: t.responseText});
                }
            });
        }
        s.uploader[file] = task;
        task.start();
    };
    /**
     * 中止一个上载
     *
     * @method abortUpload
     * @param id 任务的id
     */
    s.abortUpload = function (id) {
        if (s.uploader.hasOwnProperty(id)) {
            s.uploader[id].abort();
            delete s.uploader[id];
        }
    };
})(window.app, window.app.file = {});