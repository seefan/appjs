/**
 * h5扩展，窗口管理，只处理a标签。当导入app的js后，所有a标签打开方式将由app.window接管。所有默认的a打开方式改为侧滑一个新的窗口出来。
 *
 * 注意：
 * 1.所有的a标签必须href属性，属性内容为打开的页面地址。如果没有href系统将不处理些链接，交由手机处理。
 * 2.拨打电话使用tel:电话号码的格式，如tel:10086。
 * 3.也可以使用javascript:这样的方式调用函数。
 * 4.所有的file或http或https的协议都会按特定的窗口方式重新处理。只在app内有效。相对路一般为file协议。
 *
 * 示例：
 *
 *     <a class="item" data-template="default" data-text="请待一下哦" href="news.html">模板的测试</a>
 *
 * 其中data-template="default"和data-text="请待一下哦"都是扩展的标签，用于定义打开窗口的行为。
 *
 * 扩展标签说明：
 *
 *      data-template="default"，指定使用的模板名字，打开的页面将嵌入到模板中显示。模板有2种，普通和缓存模板。普通模板可以打开多个，缓存模板只能打开一个。
 *      data-template=""，指定模板名称为空，强制不使用模板。如果a标签中没有设置data-templdate，则根据applyTemplate决定是否应用default模板。
 *      data-text="请待一下哦"，指定连接打开窗口的标题，页面加载慢时会显示该内容，在页面模板中可以显示为窗口的标题。
 *      data-reload="true"或data-reload，强制刷新，打开页面导致强制刷新内容页，一般与data-cache一起使用。主要完成某些缓存页在特定情况下的刷新。
 *      data-cache="news"，缓存页面。该页面在第一个次加载会被缓存，以后再打开时将直接显示缓存的页面，不再重新打开页面，以提高显示速度。
 *      data-cache="index"，为固定用法，代表app的首页，即第一个加载的页面。在任何地主使用都会立即显示首页。首页不要随便reload。
 *      data-callback="回调函数名"，指定回调函数，通常用于从打开的子页面中回传一些参数，类似对话框。回调函数执行后子页面将被自己关闭。
 *      data-animation="pop-in"，指定窗口打开的动画。常用动画见h5+的api。
 *
 * 回调函数示例：
 *
 * 主页面：需要完成两部分内容，一指定打开的子页面，二指定回调函数
 *
 *     调用：
 *     <a class="item" data-callback="dologin" data-text="正在加载登陆窗口" href="login.html">登陆系统</a>
 *
 *     函数：
 *     function dologin(e){
 *         if(e.username=='admin' && e.password=='admin'){
 *             alert('login ok');
 *         }else{
 *             alert('密码错误');
 *         }
 *     }
 *
 * 子页面：只需要在处理UI后，调用app_callback函数，并将要回传的参数传回。
 *
 *     <button type="button" id="login">登陆</button>
 *
 *     $('#login').click(function(){
 *         var data={};
 *         data['username']='admin';
 *         data['password']='admin';
 *         app_callback(data);//回传参数
 *     });
 *
 * 在子页面的id为login的button被点击后，主页面的dologin将被执行，类似于子页面直接调用dologin(data)。执行完在后，子页面将被关闭。
 *
 *
 * @class app.window
 */
(function (app, win, undefined) {
    /**
     * 事件函数集合
     * @type {object}
     */
    win.events = {};
    /**
     * 默认打开动画效果
     * @property aniShow
     * @type {string}
     * @default pop-in
     */
    win.aniShow = 'pop-in';

    /**
     * 直接显示的动画效果
     * @property autoShow
     * @type {string}
     * @default fade-in
     */
    win.autoShow = 'fade-in';
    /**
     * 是否自动显示内容视图
     * @property autoShowContentView
     * @type {boolean}
     * @default true
     */
    win.autoShowContentView = true;

    /**
     * 主窗口缓存，不关闭
     *
     * @type {object}
     */
    win.windows = {};
    /**
     * 模板配置
     * 默认有两个模板，default给一般模板窗口用，不缓存，每次临时生成，有点慢；cache为缓存模板窗口，只能显示一次，不能创建多个。
     *
     * 模板属性说明：
     *
     *     url：模板的地址。
     *     top：内容页与模板页的上间距。单位px。
     *     bottom：内容页与模板页的下间距。单位px。
     *     cache：是否进行缓存。
     *
     * @property template
     * @type {object}
     * @default
     *
     *     {
     *             default: {url: 'template-test.html', top: '45px', bottom: '0px', cache: false},
     *             cache: {url: 'template-cache.html', top: '45px', bottom: '0px', cache: true}
     *     }
     *
     */
    win.template = {
        default: {url: 'template.html', top: '45px', bottom: '0px', cache: false},
        cache: {url: 'template-cache.html', top: '45px', bottom: '0px', cache: true}
    };
    /**
     * 默认是否应用default模板
     * @property applyTemplate
     * @type {boolean}
     * @default true
     */
    win.applyTemplate = true;
    /**
     * 缓存的页面，用于快速显示窗口。index固定为首页，无法修改。系统会自动重置首页地址。
     *
     * 属性说明：
     *
     *     {
     *         index: 'index.html'
     *     }
     *
     *     key为缓存的名称，值为对应的文件地址。
     * @property cachePage
     * @type {}
     */
    win.cachePage = {
        index: {title: '首页', url: 'index.html'}//示例
    };
    /**
     * 等待框默认配置
     * @property waitingOptions
     * @type {object}
     * @default {padlock: boolean}
     */
    win.waitingOptions = {padlock: true, back: 'close'};
    /**
     * 当前窗口id，用于处理一个id连续点击
     * @type {undefined}
     */
    win.currentWindow = {id: undefined, window: undefined};

    /**
     * 打开新窗口，不使用缓存。本函数为默认方法，在导入app的js后，所有的a标签默认都使用本函数打开。
     *
     * 注意：本函数不般不需要在页面中显示调用。
     *
     * @method openNewWindow
     * @param url  {string} 要打开的页面的地址
     * @param tip  {string} 提示信息
     * @param data 附加参数
     * @returns {webview}
     */
    win.openNewWindow = function (url, tip, data) {
        var id = 'window-' + url;
        if (id == win.currentWindow.id) {
            win.currentWindow.window.show();
            return win.currentWindow.window;
        }
        if (!tip) {
            tip = '正在加载...';
        }
        if (!app.util.isPlainObject(data)) {
            data = {};
        }
        var w = app.webviewPool.get();
        if (!w) {
            var ext = {loading: true, mainId: id};
            app.util.extend(ext, data);
            w = plus.webview.create(url, id, {
                popGesture: 'hide'
            }, ext);
            //关闭时自动移除
            w.addEventListener('hide', function () {
                app.webviewPool.close(w);
            });
            w.addEventListener('loaded', function () {
                w.loading = false;
                w.show(data.aniShow || win.aniShow);
                win.sendEvent(w, 'app-loaded', data);
                plus.nativeUI.closeWaiting();
            });
            w.addEventListener('error', function () {
                w.loading = false;
                plus.nativeUI.closeWaiting();
                w.close();
                app.webviewPool.close(w, true);
            });

            app.webviewPool.add(w);
        } else {
            app.util.extend(w, data);
            w.mainId = id;
            w.loadURL(url);
        }
        setTimeout(function () {
            if (w.loading === true) {
                plus.nativeUI.showWaiting(tip, this.waitingOptions);
            }
        }, 500);
        win.currentWindow.id = id;
        win.currentWindow.window = w;
        return w;
    };

    /**
     * 打开一个使用模板的窗口，导入app的js后，所有的a标签都可以使用本函数打开。
     *
     * 注意：本函数不般不需要在页面中显示调用。如果调用的模板是缓存的模板，请使用openCacheTemplateWindow
     *
     * 示例：使用的default模板为普通模板，不缓存。
     *
     *     <a class="item" data-template="default" data-text="请待一下哦" href="news.html">模板的测试</a>
     *
     * 在a标签中增加属性data-template="default"，内容"default"为为模板的名字，该名称定义在app.window.template属性中，可以通过扩展增加模板。
     *
     * data-text="请待一下哦"为提示信息，在显示页面时如果加载时间长，会显示出来。本属性可选。
     *
     * @method openTemplateWindow
     * @param url  {string} 要加载的页面地址
     * @param tmplName  {string} 模板名
     * @param data 附加参数
     * @returns {webview}
     */
    win.openTemplateWindow = function (url, tmplName, data) {
        var id = 'template-' + tmplName + '-' + url;
        if (id == win.currentWindow.id) {
            win.currentWindow.window.show();
            return win.currentWindow.window;
        }
        if (!app.util.isPlainObject(data)) {
            data = {};
        }
        var w = app.webviewPool.getTemplate();
        if (!w) {
            var template = this.template[tmplName];
            if (!template) {//模板名字错误，就使用默认模板
                template = this.template['default'];
            }
            if (!template) {//如果无法找到模板
                return undefined;
            }
            var ext = {mainId: id};

            app.util.extend(ext, data);
            w = plus.webview.create(template.url, id, {
                scrollIndicator: 'none',
                scalable: false,
                popGesture: 'hide'
            }, ext);
            // 在Android5以上设备，如果默认没有开启硬件加速，则强制设置开启
            if (plus.os.name === 'Android' && !plus.webview.defauleHardwareAccelerated() && parseInt(plus.os.version) >= 5) {
                w.setStyle({hardwareAccelerated: true});
            }
            //关闭时自动移除
            w.addEventListener('error', function () {
                w.close();
                app.webviewPool.close(w, true);
            });
            w.addEventListener('hide', function () {
                app.webviewPool.close(w);
            });
            w.addEventListener('loaded', function () {
                //显示页面
                w.show(data.aniShow || win.aniShow);
                win.sendEvent(w, 'app-loaded', data);
                win.createSubView(id, url, template, data, w);

            });
            app.webviewPool.add(w);
        } else {
            w.mainId = id;
            w.show(data.aniShow || win.aniShow);
            win.sendEvent(w, 'app-loaded', data);
            var cs = w.children();
            if (cs && cs.length > 0) {
                app.util.extend(cs[0], data);
                cs[0].mainId = id;
                cs[0].hide('none');
                cs[0].clear();
                cs[0].loadURL(url);
            }
        }
        return w;
    };
    /**
     * 创建一个子窗口
     * @param id
     * @param url
     * @param template
     * @param data
     * @param w
     */
    win.createSubView = function (id, url, template, data, w) {
//预加载共用子webview
        var extsub = {mainId: id};
        app.util.extend(extsub, data);
        var subWebview = plus.webview.create(url, id + "-sub", {
            top: template.top,
            bottom: template.bottom
        }, extsub);
        // 在Android5以上设备，如果默认没有开启硬件加速，则强制设置开启
        if (plus.os.name === 'Android' && !plus.webview.defauleHardwareAccelerated() && parseInt(plus.os.version) >= 5) {
            subWebview.setStyle({hardwareAccelerated: true});
        }
        subWebview.addEventListener('loaded', function () {
            setTimeout(function () {
                if (win.autoShowContentView) {
                    subWebview.show(win.autoShow);
                }
                //通知主窗口加载完成
                win.sendEvent(subWebview, 'app-loaded', data);
            }, 200);
        });
        //iOS平台支持侧滑关闭，父窗体侧滑隐藏后，同时需要隐藏子窗体；
        //5+父窗体隐藏，子窗体还可以看到？不符合逻辑吧？
        //if (plus.os.name != 'iOS') {
        //    w.addEventListener('hide', function () {
        //        subWebview.hide('none');
        //    });
        //}
        w.append(subWebview);
    };
    /**
     * 打开一个使用缓存模板的窗口，导入app的js后，所有的a标签都可以使用本函数打开。
     *
     * 注意：本函数不般不需要在页面中显示调用。
     *
     * 示例：使用的cache模板为缓存模板。
     *
     *     <a class="item" data-template="cache" href="news.html">缓存模板的测试</a>
     *
     * 在a标签中增加属性data-template="cache"，内容"cache"为为模板的名字，该名称定义在app.template属性中，可以通过扩展增加模板。
     *
     * data-text="请待一下哦"为提示信息，在显示页面时如果加载时间长，会显示出来。本属性可选。
     *
     * data-reload="true"为强制刷新，可以在打开页面时强制刷新内容页。本属性可选。
     *
     * @method openCacheTemplateWindow
     * @param url  {string} 要加载的页面地址
     * @param tmplName  {string} 模板名
     * @param reload {boolean} 是否强制刷新
     * @param data 附加参数
     * @returns {webview}
     */
    win.openCacheTemplateWindow = function (url, tmplName, reload, data) {
        var id = 'cache-template-' + tmplName, w;
        if (win.windows.hasOwnProperty(id)) {
            w = win.windows[id];
        }
        if (!w) {
            var template = this.template[tmplName];
            if (!template) {//模板名字错误，就使用默认模板
                template = this.template['default'];
            }
            if (!template) {//如果无法找到模板
                return undefined;
            }

            if (!app.util.isPlainObject(data)) {
                data = {};
            }

            var ext = {
                mainId: id
            };
            app.util.extend(ext, data);
            w = plus.webview.create(template.url, id, {
                    scrollIndicator: 'none',
                    scalable: false,
                    popGesture: 'hide',
                    hardwareAccelerated: false
                }, ext
            );

            var extsub = {mainId: id};
            extsub = app.util.extend(extsub, data);
            //预加载共用子webview
            var subWebview = plus.webview.create(url,
                id + "-sub", {
                    top: template.top,
                    bottom: template.bottom
                }, extsub);
            subWebview.addEventListener('loaded', function () {
                setTimeout(function () {
                    if (win.autoShowContentView) {
                        subWebview.show(win.autoShow);
                    }
                }, 200);//等待主窗口动画完成再显示
                //通知主窗口加载完成
                win.sendEvent(subWebview, 'app-loaded', data);
            });

            w.append(subWebview);

            //iOS平台支持侧滑关闭，父窗体侧滑隐藏后，同时需要隐藏子窗体；
            //5+父窗体隐藏，子窗体还可以看到？不符合逻辑吧？
            //if (plus.os.name != 'iOS') {
            //    w.addEventListener('hide', function () {
            //        subWebview.hide('none');
            //    });
            //}
            win.windows[id] = w;
            w.loadContentUrl = function (curl, _data) {
                if (app.util.isPlainObject(_data)) {
                    data = _data;
                }
                w.hide();
                if (reload || subWebview.prov_url != curl) {
                    //更新扩展参数
                    app.util.extend(subWebview, data);
                    app.util.extend(w, data);
                    subWebview.prov_url = curl;
                    subWebview.hide('none');
                    subWebview.clear();
                    subWebview.loadURL(curl);//加载完后自动显示
                } else {
                    subWebview.show();
                }
                w.show(data.aniShow || win.aniShow);
                win.sendEvent(w, 'app-loaded', data);
            };
        }

        if (url != '') {
            w.loadContentUrl(url, data);
        }
        return w;
    };
    /**
     * 打一个缓存的窗口，导入app的js后，所有的a标签都可以使用本函数打开。缓存的窗口不支持模板。任何a标签只要带有相同的缓存名字，都指向同一个缓存的页面。
     *
     * 注意：本函数不般不需要在页面中显示调用。
     *
     * 示例：使用的cache模板为缓存模板。
     *
     *     <a class="item" data-cache="news"  href="news.html">缓存模板的测试</a>
     *
     * 在a标签中增加属性data-cache="news"，内容"news"为为缓存的名字，该名字可自定义，全局唯一即可。
     *
     * data-reload="true"为强制刷新，可以在打开页面时强制刷新内容页。本属性可选。
     *
     * @method openCacheWindow
     * @param id {string} 缓存窗口名字
     * @param url  {string} 页面地址
     * @param reload {boolean}是否强制加载
     * @param data 附加参数
     * @param show {boolean} 是否立即显示，默认为立即显示
     */
    win.openCacheWindow = function (id, url, reload, data, show) {
        //如果只有一个id，直接从缓存中取
        var w;
        id = 'cache-' + id;

        if (!app.util.isPlainObject(data)) {
            data = {};
        }

        w = win.windows[id];
        if (w) {
            if (reload === true) {
                //更新扩展参数
                app.util.extend(w, data);
                w.loadURL(url);
            } else {
                w.show(data.aniShow || 'none');
            }
        } else {
            //预加载的窗口不需要自动关闭
            var ext = {mainId: id};
            app.util.extend(ext, data);
            w = plus.webview.create(url, id, {
                scrollIndicator: 'none',
                scalable: false,
                popGesture: 'none'
            }, ext);

            w.addEventListener('loaded', function () {
                //通知主窗口加载完成
                win.sendEvent(w, 'app-loaded', data);
                if (show !== false) {
                    w.show(data.aniShow || 'none');
                    //同时关闭窗口池内的窗口
                    setTimeout(function () {
                        app.webviewPool.closeAll();
                    }, 0);
                }
            });

            win.windows[id] = w;
        }
        return w;
    };
    /**
     * 关闭当前窗口
     * @method closeWindow
     * @param webview {webview} 窗口，可为空，为空时到当前窗口
     * @param reload {boolean} 是否重载上一级窗口
     */
    win.closeWindow = function (webview, reload) {
        if (typeof webview === 'boolean') {
            reload = webview;
            webview = undefined;
        }
        if (!webview) {
            webview = plus.webview.currentWebview();
        }
        var w = win.getMainWindow(webview);
        win.sendEvent(plus.webview.getLaunchWebview(), 'window-event', {
            eventName: 'close-window',
            reload: reload,
            pageId: w.id
        });
    };
    /**
     * 关闭当前窗口
     * @param webview {webview} 窗口
     * @param reload {boolean} 是否重载上一级窗口
     */
    win._closeWindow = function (webview, reload) {
        if (reload) {
            var pw = plus.webview.getWebviewById(webview.openId);
            if (pw) {
                var cws = pw.children();
                if (cws.length > 0) {
                    for (var i in cws) {
                        cws[i].reload(true);
                    }
                } else {
                    pw.reload(true);
                }
            }
        }
        webview.hide('auto');
    };
    /**
     * 取父级窗口
     * @param w 窗口
     * @returns {object}
     */
    win.getMainWindow = function (w) {
        if (!w) {
            w = plus.webview.currentWebview();
        }
        var p = w.parent();
        if (p) {
            return win.getMainWindow(p);
        } else {
            return w;
        }
    };
    /**
     *
     * 默认把所有a的href改为tap事件
     * 除tel和javascript开头的以外
     * 所有带href的a打开都通过wv
     *
     * 窗口有2类
     *
     * 普通窗口和模板窗口，模板窗口主要是为了提高加载速度，一般是带标题或工具栏。显示时首先显示模板页和提示文字，待内容加载完
     * 后才全部显示。通过指定data-template='模板名字'来指定模板。可以通过data-reload="true"强制在当前窗口刷新。
     * 缓存的模板窗口只有一个实例，每次显示都是一个页面。
     * 普通窗口默认为打开新窗口方式，可以通过data-reload="true"强制在当前窗口刷新。
     * 系统缓存窗口，这类窗口不使用模板。通过data-cache='id'来标记，在任何页面调用都显示同一个页面。可以通过data-reload="true"强制当前窗口刷新url。
     * 如果有模板，可以单独指定提示文字，如果没有指定，就用链接的文本。data-text='加载中...'
     * 优先级：缓存窗口、模板窗口、新窗口、当前窗口
     * {url: url, tip: text, name: cacheName, reload: isReload, template: tmplName};
     */
    win.events['a-tap'] = function (data) {
        if (data.name) {//有缓存标志，最高优先级
            win.openCacheWindow(data.name, data.url, data.isReload, data);
        } else if (data.template) {//有模板的，当前页和新页
//是否为缓存的模板页，由配置决定
            var conf = win.template[data.template];
            if (!conf) {
                conf = win.template['default'];
            }
            if (conf) {
                //有配置，并且缓存
                if (conf.cache) {
                    win.openCacheTemplateWindow(data.url, data.template, data.isReload, data);
                } else {
                    if (data.isReload) {
                        var page = plus.webview.getWebviewById(data.pageId);
                        page.loadURL(data.url);
                    } else {
                        win.openTemplateWindow(data.url, data.template, data);
                    }

                }
            } else {
                //非缓存的模板，有新窗口和当前窗口之分
                if (data.isReload) {//强制当前加载，并且是模板窗口
                    var page = plus.webview.getWebviewById(data.pageId);
                    app.util.extend(page, data); //更新扩展参数
                    page.loadURL(data.url);
                } else {
                    win.openNewWindow(data.url, data.text, data);
                }
            }
        } else {//普通方式
            if (!data.isReload) {
                win.openNewWindow(data.url, '正在加载' + data.text, data);
            } else {
                var page = plus.webview.getWebviewById(data.pageId);
                if (page) {
                    app.util.extend(page, data); //更新扩展参数
                    page.loadURL(data.url);
                }
            }
        }
    };
    //关闭指定窗口
    win.events['close-window'] = function (data) {
        var w = plus.webview.getWebviewById(data.pageId);
        if (w) {
            win._closeWindow(w, data.reload);
        }
    };
    //重新加载窗口
    win.events['reload-window'] = function (data) {
        var w = plus.webview.getWebviewById(data.pageId);
        if (w && w.url) {
            w.loadURL(w.url);
        } else if (w) {
            w.reload(true);
        }
    };
    //打开一个在底部的窗口
    win.events['window-show-bottom'] = function (data) {
        //如果只有一个id，直接从缓存中取
        var w, id = 'window-show-bottom', main = plus.webview.getLaunchWebview();
        var aniShow = 'slide-in-bottom';
        w = plus.webview.getWebviewById(id);

        if (!w) {
            w = plus.webview.create(data.url, id, {
                scrollIndicator: 'none',
                scalable: false,
                popGesture: 'none',
                mask: "rgba(0,0,0,0.5)",
                dock: 'bottom'
            }, {mType: 'sub'});

            w.addEventListener('loaded', function () {
                //通知主窗口加载完成
                w.show(aniShow);
                win.sendEvent(w, 'app-loaded', data);
            });
            main.append(w);
        } else {
            if (data.isReload) {
                w.loadURL(data.url);
            } else {
                w.show(aniShow);
            }
        }
    };
    /**
     * 触发事件，通知指定窗口和所有子级窗口
     * @method sendEvent
     * @param webview {webview} 目标窗口
     * @param eventName {string} 事件名称
     * @param data 事件参数
     */
    win.sendEvent = function (webview, eventName, data) {
        if (!window.plus) {
            return;
        }
        if (!webview) {
            webview = plus.webview.currentWebview();
        }
        if (app.util.isPlainObject(data)) {
            data = JSON.stringify(data);
        }
        data = encodeURIComponent(data);
        webview.evalJS("typeof app!=='undefined' && typeof app.window!=='undefined' && app.window.receiveEvent('" + eventName + "','" + data + "')");
        var cwvs = webview.children();
        for (var i in cwvs) {
            cwvs[i].evalJS("typeof app!=='undefined' && typeof app.window!=='undefined' && app.window.receiveEvent('" + eventName + "','" + data + "')");
        }
    };
    /**
     * 接收自定义事件
     * @method receiveEvent
     * @param eventName 事件名称
     * @param data 参数
     */
    win.receiveEvent = function (eventName, data) {
        if (eventName) {
            if (data) {
                data = decodeURIComponent(data);
                try {
                    data = JSON.parse(data);
                } catch (e) {
                }
            }
            win.trigger(window, eventName, {
                bubbles: false,
                cancelable: true,
                data: data
            });
        }
    };
    /**
     * 触发事件
     * @method trigger
     * @param ele {object} 触发事件的对象
     * @param eventName {string} 事件名称
     * @param params {object} 事件参数
     *
     * {
            bubbles: false,//是否冒泡
            cancelable: true,//可否取消
            data: undefined//自定义数据
        };
     */
    win.trigger = function (ele, eventName, params) {
        params = params || {
            bubbles: false,
            cancelable: true,
            data: undefined
        };
        var cancelable = true;
        if (params.hasOwnProperty('cancelable')) {
            cancelable = !!params.cancelable;
        }
        var evt = document.createEvent('Events');
        var bubbles = true;
        for (var name in params) {
            (name === 'bubbles') ? (bubbles = !!params[name]) : (evt[name] = params[name]);
        }
        evt.initEvent(eventName, bubbles, cancelable);
        ele.dispatchEvent(evt);
    };
    /**
     * 重新加载当前窗口
     * @method reload
     * @param w {webview} [可选] 要reload的窗口，如果为空则是当前窗口
     */
    win.reload = function (w) {
        if (!window.plus) {
            return;
        }
        var main = plus.webview.getLaunchWebview();
        if (!w) {
            w = plus.webview.currentWebview();
        }
        win.sendEvent(main, 'window-event', {eventName: 'reload-window', pageId: w.id});
    };

    /**
     * 显示内容窗口，本方法只能在内容页调用
     * @method show
     */

    win.show = function () {
        if (window.plus) {
            var page = plus.webview.currentWebview();
            if (page) {
                page.show(win.autoShow);
            }
        } else {
            setTimeout(function () {
                win.show();
            }, 100);
        }
    };
    /**
     * 这窗口注册窗口管理事件
     */
    app.h5GlobalFunction.push(function () {
        if (plus.os.name === 'Android') {
            win.aniShow = 'slide-in-right';
        }
        var main = plus.webview.getLaunchWebview();
        //事件处理
        window.addEventListener('window-event', function (e) {
            e.stopPropagation();
            var eventName = e.data.eventName;
            delete e.data['eventName'];
            win.events[eventName](e.data);
        }, false);
        //将内存中可能存在的一些无效的窗口关闭
        var ws = plus.webview.all();
        for (var w in ws) {
            if (ws[w] != main) {
                ws[w].close();
            }
        }
        //缓存模板页面
        for (var name in win.template) {
            var conf = win.template[name];
            if (conf.cache) {
                win.openCacheTemplateWindow('', name);
            }
        }
        //加载缓存页面
        for (var c in win.cachePage) {
            if (c != 'index') {
                var page = win.cachePage[c];
                var data = {
                    openId: main.id,
                    url: page.url,
                    text: page.title,
                    name: c
                };
                win.openCacheWindow(c, page.url, false, data, false);
            }
        }

        win.windows['cache-index'] = main;
    });

    /**
     * 加载a的事件处理
     * 不处理tel，mailto和javascript
     */
    app.h5InitFunction.push(function () {
        var main = plus.webview.getLaunchWebview();
        app.on(document.body, 'click', 'a', function (e) {
            if (!this.attributes.hasOwnProperty('href') || this.protocol != 'file:' && this.protocol != 'http:' && this.protocol != 'https:') {
                return true;
            }

            e.preventDefault();     //阻止默认行为
            e.stopPropagation();
            var url = this.getAttribute('href');
            var cacheName = this.getAttribute('data-cache');
            var tmplName = this.getAttribute('data-template');
            if (win.applyTemplate && !this.attributes.hasOwnProperty('data-template')) {
                tmplName = 'default';
            }

            var animation = this.getAttribute('data-animation');
            var text = this.getAttribute('data-text');
            var callback = this.getAttribute('data-callback');
            var isReload = false;
            if (this.attributes.hasOwnProperty('data-reload')) {
                isReload = this.getAttribute('data-reload') != 'false';
            }
            if (!this.attributes.hasOwnProperty('data-text')) {
                text = this.innerText.trim();
            }
            var page = plus.webview.currentWebview();

            var data = {
                openId: page.mainId,
                pageId: page.id,
                url: url,
                callback: callback,
                text: text,
                name: cacheName,
                isReload: isReload,
                template: tmplName,
                aniShow: animation,
                eventName: 'a-tap'
            };
            //触发主页面的a-tap事件，所有子页面的不自己执行
            win.sendEvent(main, 'window-event', data);
            return false;
        });
        /**
         * 主窗口处理
         * 1、注册a-tap事件，接收所有子窗口发出的a-tap
         * 2、对于一些要缓存的页面在加载主窗口时，提前载入
         * 3、对于常用页面，如wait等也要提前载入，前提是主窗口用到了
         */

    });

    /**
     * 给所有窗口增一个回调函数
     * 用于给父窗口传递数据
     */
    app.h5InitFunction.push(function () {
        //注册回调函数，主要是子窗口用
        window.app_callback = function (v) {
            var cw = plus.webview.currentWebview();
            var pw = plus.webview.getWebviewById(cw.openId);
            if (pw) {
                var d = {callback: cw.callback, data: v};
                win.sendEvent(pw, 'app-callback', d);
            }
            win.closeWindow(cw);
        };
        //回调事件处理，主要是接收子窗口的回调
        window.addEventListener('app-callback', function (e) {
            if (typeof window[e.data.callback] === 'function') {
                window[e.data.callback](e.data.data);
            }
        });
        //
        if (plus.os.name === 'Android') {
            var quitTime = 1;
            plus.key.addEventListener('backbutton', function () {
                var page = plus.webview.currentWebview();
                var main = plus.webview.getLaunchWebview();
                if (!page.name && page != main) {//不是缓存的窗口，就关掉
                    page = win.getMainWindow(page);
                    page.hide('auto')
                } else {
                    if (quitTime == 0) {
                        plus.runtime.quit();
                        return true;
                    } else {
                        app.toast('再按一按退出');
                        quitTime = 0;
                        setTimeout(function () {
                            quitTime = 1;
                        }, 1000);
                    }
                }

            }, false);
        }
    });
})
(window.app, window.app.window = {});

