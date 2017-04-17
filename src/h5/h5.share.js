/**
 * h5扩展，分享
 * @class app.share
 */
(function (service) {
    /**
     * 分享通道
     * @type {object}
     */
    service.shares = {};
    service.shares.length = 0;
    /**
     * 当前分享的内容
     * @type {object}
     */
    service.shareinfo = {};
    /**
     * 获取一个复制内容的通道
     * @method getCopyChannel
     */
    service.getCopyChannel = function () {
        if (!(plus.os && plus.os.name)) {
            return;
        }
        var share = {};
        share.authenticated = true;
        share.nativeClient = true;
        share.title = '复制到剪贴板';
        share.id = 'system_copy';

        switch (plus.os.name) {
            case 'iOS':
                share.send = function (msg, callback) {
                    //获取剪切板
                    var UIPasteboard = plus.ios.importClass("UIPasteboard");
                    var generalPasteboard = UIPasteboard.generalPasteboard();
                    // 设置/获取文本内容:
                    generalPasteboard.setValueforPasteboardType(msg.extra.code, "public.utf8-plain-text");
                    //var value = generalPasteboard.valueForPasteboardType("public.utf8-plain-text");
                    if (callback) {
                        callback();
                    }
                };
                service.shares[share.id] = share;
                service.shares.length++;
                break;
            case 'Android':
                share.send = function (msg, callback) {
                    //获取剪切板
                    var Context = plus.android.importClass("android.content.Context");
                    var main = plus.android.runtimeMainActivity();
                    var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
                    plus.android.invoke(clip, "setText", msg.extra.code);
                    if (callback) {
                        callback();
                    }
                };
                service.shares.length++;
                service.shares[share.id] = share;
                break;
        }
    };
    /**
     * 获取分享的通道，如果拷贝通道可以，也一并返回
     * @method getShareChannel
     * @param callback {function} 回调函数
     */
    service.getShareChannel = function (callback) {
        if (service.shares.length > 0) {
            if (callback) {
                callback(service.shares);
            }
        }

        service.getCopyChannel();
        plus.share.getServices(function (s) {
            for (var i in s) {
                var t = s[i];
                t.title = '分享到' + t.description;
                if (t.authenticated) {
                    service.shares[t.id] = t;
                    service.length++;
                }
            }

            if (callback) {
                callback(service.shares);
            }
        }, function (e) {
            console.log(e);
        });
    };
    /**
     * 控制不重复显示，内部使用
     * @type {boolean}
     */
    service.showSheet = false;

    /**
     * 打开分享面板进行分享
     * @method share
     * @param title  {string} 标题
     * @param code  {string} 英文编码
     * @param desc  {string} 说明
     * @param href  {string} 地址[可选]
     * @param thumb  {string} 图片[可选]
     */
    service.share = function (title, code, desc, href, thumb) {
        service.shareinfo.title = title;
        service.shareinfo.desc = desc;
        service.shareinfo.href = href;
        service.shareinfo.thumb = thumb;
        service.shareinfo.code = code;
        var bts = [],
            ids = [];
        for (var i in service.shares) {
            var t = service.shares[i];
            if (t.id) {
                if (t.id == 'weixin') {
                    ids.push({
                        id: "weixin",
                        ex: "WXSceneSession"
                    });
                    ids.push({
                        id: "weixin",
                        ex: "WXSceneTimeline"
                    });
                    bts.push({
                        title: '发送给微信好友'
                    });
                    bts.push({
                        title: '分享到微信朋友圈'
                    });
                } else {
                    ids.push({
                        id: t.id
                    });
                    bts.push({
                        title: t.title
                    });
                }
            }
        }

        if (bts && bts.length > 0 && window.plus && !service.showSheet) {
            service.showSheet = true;
            plus.nativeUI.actionSheet({
                    cancel: "取消",
                    buttons: bts
                },
                function (e) {
                    service.showSheet = false;
                    var i = e.index;
                    if (i > 0) {
                        service.shareAction(ids[i - 1].id, ids[i - 1].ex);
                    }
                }
            );
        }
    };

    /**
     * 发送分享消息
     * @param s  {plus.share.ShareService} 分享实例
     * @param  ex
     */
    service.shareMessage = function (s, ex) {
        var msg = {
            content: service.shareinfo.desc,
            extra: {
                scene: ex,
                code: service.shareinfo.code
            }
        };
        msg.href = service.shareinfo.href;
        if (service.shareinfo.href) {
            msg.title = service.shareinfo.title;
        }
        msg.thumbs = [service.shareinfo.thumb];
        //alert(JSON.stringify(msg));
        s.send(msg, function () {
            //console.log("分享到\"" + s.description + "\"成功！ ");
        }, function (e) {
            app.error("未能分享到\"" + s.description + "\":" + e.code + " - " + e.message);
        });
    };
    /**
     * 执行分享操作
     * @param id  {string} 分享到的通道id
     * @param ex 分享的内容
     */
    service.shareAction = function (id, ex) {
        var s = null;
        if (!id || !(s = service.shares[id])) {
            return;
        }
        if (s.authenticated) {
            service.shareMessage(s, ex);
        } else {
            s.authorize(function () {
                service.shareMessage(s, ex);
            }, function (e) {
                if (e.code == -100) {
                    app.error('您已取消了分享')
                } else {
                    app.error("认证授权失败：" + e.code);
                }

            });
        }
    };
})(window.app.share = {});