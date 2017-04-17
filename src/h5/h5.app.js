/**
 * 对app进行h5扩展
 * @class app
 * @module app.h5common
 */
(function (app) {
    ///**
    // * h5的扩展初始参数，具体参数请查看h5相关文档，一般不需要修改。
    // *
    // * @property h5Param
    // * @type {object}
    // */
    //app.h5Param = {
    //    swipeBack: false,
    //    statusBarBackground: '#f7f7f7',
    //    gestureConfig: {
    //        doubletap: true
    //    }
    //};

    //暂时取消
    /**
     * h5的初始化函数
     * @type {Array}
     */
    app.h5InitFunction = [];
    /**
     * 公共的初始化函数，只能调用一次
     * @type {Array}
     */
    app.h5GlobalFunction = [];
    /**
     * h5准备好后调用的函数，主要处理h5扩展API，详见<a target="_blank" href="http://www.html5plus.org/doc/h5p.html">h5API</a>
     * 主要处理对于窗口等原生UI进行的一些处理。如处理窗口。
     *
     * @method plusReady
     *
     * @param callback {function} 回调函数
     */
    app.plusReady = function (callback) {
        this.plusReadyFunction = callback;
    };


    /**
     * 初始化app窗口
     * @param {Object} param
     */
    app.initFunction.push(function () {
        //统一ajax调用
        XTemplate.setAjax(app.optAjax);
        if (window.plus) {
            app.h5plusReady();
        } else {
            document.addEventListener('plusready', app.h5plusReady, false);
        }
    });
    /**
     * 内部使用，h5准备好后的回调
     */
    app.h5plusReady = function () {

        //重置后退操作
        app.back = function (reload) {
            //webview有大量bug，所有少操作这个类
            //在webview里 document.referrer不直为空

            app.window.closeWindow(reload);
        };
        //重置显示登陆页
        app.showLogin = function () {
            //预加载的窗口不需要自动关闭
            var id = 'window-login';
            var page = plus.webview.currentWebview();
            var w = plus.webview.getWebviewById(id);
            if (!w) {
                w = plus.webview.create('login.html', id, {
                    scrollIndicator: 'none',
                    scalable: false,
                    popGesture: 'none'
                }, {mainId: page.id});
            } else {
                w.mainId = page.id;
                w.loadURL('login.html');
            }
            w.show(app.window.autoShow);
        };
        /**
         * 重置关闭登陆页
         */
        app.closeLogin = function () {
            var id = 'window-login';
            var w = plus.webview.getWebviewById(id);
            if (w) {
                w.hide();
                var pw = plus.webview.getWebviewById(w.mainId);
                if (pw) {
                    app.window.reload(pw);
                }
            }
        };
        /**
         * 重置go函数
         */
        app.go = function (url, cacheName) {
            var main = plus.webview.getLaunchWebview();
            var page = plus.webview.currentWebview();
            app.window.sendEvent(main, 'window-event', {
                eventName: 'a-tap',
                url: url,
                name: cacheName,
                openId: page.mainId
            });
        };
        //重置alert函数
        app.alert = function (message, alertCB, title, buttonCapture) {
            plus.nativeUI.alert(message, alertCB, title, buttonCapture);
        };
        //重置toast
        app.toast = function (msg) {
            plus.nativeUI.toast(msg);
        };
        //重置底部窗口
        app.showBottomWindow = function (url, callback) {

            var main = plus.webview.getLaunchWebview();
            var page = plus.webview.currentWebview();
            if (typeof callback === 'function') {
                app.__bottom__window_callback = callback;
                callback = 'app.__bottom__window_callback';
            }
            app.window.sendEvent(main, 'window-event', {
                eventName: 'window-show-bottom',
                url: url,
                name: 'window-show-bottom',
                openId: page.mainId,
                callback: callback
            });
        };

        //重置reload函数
        app.reload = app.window.reload;
        //重置confirm函数
        app.confirm = function (message, callback) {
            var bts = [{title: "确认"}];
            plus.nativeUI.actionSheet({title: message, cancel: "取消", buttons: bts},
                function (e) {
                    if (e.index > 0) {
                        callback();
                    }
                }
            );
        };

        //执行初始化函数
        for (var i in app.h5InitFunction) {
            app.h5InitFunction[i](app);
        }
        //只有在主窗口才执行
        if (plus.webview.getLaunchWebview() == plus.webview.currentWebview()) {
            for (var j in app.h5GlobalFunction) {
                app.h5GlobalFunction[j](app);
            }
        }
        if (app.plusReadyFunction) {
            app.plusReadyFunction();
        }
    };

})(window.app);