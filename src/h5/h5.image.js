/**
 * h5扩展，拍照，摄像，图片管理
 * @class app.image
 */
(function (app, s, undefined) {
    /**
     * 图片的默认格式
     * @property imageFormat
     * @type {string}
     * @default png
     */
    s.imageFormat = 'png';
    /**
     * 图片的默认质量
     * @property imageQuality
     * @type {number}
     * @default 40
     */
    s.imageQuality = 40;
    /**
     * 图片的默认宽度
     * @property imageWidth
     * @type {number}
     * @default 640
     */
    s.imageWidth = 640;
    /**
     * 是否可用
     *
     * @type {boolean}
     */
    s.inited = false;
    /**
     * 初始化图片类
     */
    s.init = function () {
        // 获取音频目录对象
        plus.io.resolveLocalFileSystemURL("_doc/", function (entry) {
            entry.getDirectory("camera", {
                create: true
            }, function () {
                s.inited = true;
                // app.util.log('创建目录成功');
            }, function (e) {
                app.util.log("Get directory \"camera\" failed: " + e.message);
            });
        }, function (e) {
            app.util.log("Resolve \"_doc/\" failed: " + e.message);
        });
    };
    /**
     * 拍照
     *
     * @method captureImage
     * @param callback {function} 拍照回调，成功返回照片的地址，失败返回e
     * @param compress {boolean} [可选] 是否执行压缩，默认为false
     */
    s.captureImage = function (callback, compress) {
        if (s.inited) {
            var cmr = plus.camera.getCamera();
            cmr.captureImage(function (p) {
                plus.io.resolveLocalFileSystemURL(p, function (e) {
                    var path = e.fullPath.indexOf('file:') == -1 ? 'file://' + e.fullPath : e.fullPath;
                    if (typeof callback === 'function') {
                        if (compress === true) {
                            s.compressImage(path, callback);
                        } else {
                            callback(path);
                        }
                    }
                }, function (e) {
                    if (typeof callback === 'function') {
                        callback(e);
                    }
                });

            }, function (e) {
                app.util.log("拍照失败：" + e.message);
                if (typeof callback === 'function') {
                    callback(e);
                }
            }, {filename: "_doc/camera/", index: 1});
        }
    };
    /**
     * 从相册内选择一张照片
     *
     * @method pickImage
     * @param callback {function} 拍照回调，成功返回照片的地址，失败返回e
     * @param compress {boolean} [可选] 是否执行压缩，默认为false
     */
    s.pickImage = function (callback, compress) {
        if (s.inited) {
            plus.gallery.pick(function (p) {
                if (typeof callback === 'function') {
                    if (compress === true) {
                        s.compressImage(p, callback);
                    } else {
                        callback(p);
                    }
                }
            }, function (e) {
                if (typeof callback === 'function') {
                    callback(e);
                }
            }, {filter: "image"});
        }
    };

    /**
     * 压缩图片
     *
     * @method compressImage
     * @param src {string} 待压缩的图片地址
     * @param callback {function} 回调，成功返回照片的地址，失败返回e
     */
    s.compressImage = function (src, callback) {
        var img = new Image();
        img.src = src;

        img.onload = function () {
            if (img.width <= s.imageWidth) {
                if (typeof callback === 'function') {
                    callback(src);
                }
            } else {
                if (s.inited) {
                    plus.zip.compressImage({
                        src: src,
                        dst: src + '.' + s.imageFormat,
                        quality: s.imageQuality,
                        overwrite: true,
                        width: s.imageWidth
                    }, function (e) {
                        if (typeof callback === 'function') {
                            callback(e.target);
                        }
                    }, function (e) {
                        if (typeof callback === 'function') {
                            callback(e);
                        }
                    });
                }
            }
        };

    };

    /**
     * 初始化
     */
    app.h5InitFunction.push(function () {
        s.init();
    });
})(window.app, window.app.image = {});