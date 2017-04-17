/**
 * app常用功能，分微信版和h5版
 *
 * css选择器说明：
 *
 *     .class    .intro    选择 class="intro" 的所有元素。
 *     #id    #firstname    选择 id="firstname" 的所有元素。
 *     %name  %firstname    选择 name="firstname"的所有元素。
 *     *    *    选择所有元素。
 *     element    p    选择所有 <p> 元素。
 *     element,element    div,p    选择所有 <div> 元素和所有 <p> 元素。
 *     element element    div p    选择 <div> 元素内部的所有 <p> 元素。
 *     element>element    div>p    选择父元素为 <div> 元素的所有 <p> 元素。
 *     element+element    div+p    选择紧接在 <div> 元素之后的所有 <p> 元素。
 *     [attribute]    [target]    选择带有 target 属性所有元素。
 *     [attribute=value]    [target=_blank]    选择 target="_blank" 的所有元素。
 *     [attribute~=value]    [title~=flower]    选择 title 属性包含单词 "flower" 的所有元素。
 *     [attribute|=value]    [lang|=en]    选择 lang 属性值以 "en" 开头的所有元素。
 *     :link    a:link    选择所有未被访问的链接。
 *     :visited    a:visited    选择所有已被访问的链接。
 *     :active    a:active    选择活动链接。
 *     :hover    a:hover    选择鼠标指针位于其上的链接。
 *     :focus    input:focus    选择获得焦点的 input 元素。
 *     :first-letter    p:first-letter    选择每个 <p> 元素的首字母。
 *     :first-line    p:first-line    选择每个 <p> 元素的首行。
 *     :first-child    p:first-child    选择属于父元素的第一个子元素的每个 <p> 元素。
 *     :before    p:before    在每个 <p> 元素的内容之前插入内容。
 *     :after    p:after    在每个 <p> 元素的内容之后插入内容。
 *     :lang(language)    p:lang(it)    选择带有以 "it" 开头的 lang 属性值的每个 <p> 元素。
 *     element~element    p~ul    选择前面有 <p> 元素的每个 <ul> 元素。
 *     [attribute^=value]    a[src^="https"]    选择其 src 属性值以 "https" 开头的每个 <a> 元素。*
 *     [attribute$=value]    a[src$=".pdf"]    选择其 src 属性以 ".pdf" 结尾的所有 <a> 元素。
 *     [attribute*=value]    a[src*="abc"]    选择其 src 属性中包含 "abc" 子串的每个 <a> 元素。*
 *     :first-of-type    p:first-of-type    选择属于其父元素的首个 <p> 元素的每个 <p> 元素。
 *     :last-of-type    p:last-of-type    选择属于其父元素的最后 <p> 元素的每个 <p> 元素。
 *     :only-of-type    p:only-of-type    选择属于其父元素唯一的 <p> 元素的每个 <p> 元素。
 *     :only-child    p:only-child    选择属于其父元素的唯一子元素的每个 <p> 元素。
 *     :nth-child(n)    p:nth-child()    选择属于其父元素的第二个子元素的每个 <p> 元素。
 *     :nth-last-child(n)    p:nth-last-child()    同上，从最后一个子元素开始计数。
 *     :nth-of-type(n)    p:nth-of-type()    选择属于其父元素第二个 <p> 元素的每个 <p> 元素。
 *     :nth-last-of-type(n)    p:nth-last-of-type()    同上，但是从最后一个子元素开始计数。
 *     :last-child    p:last-child    选择属于其父元素最后一个子元素每个 <p> 元素。
 *     :root    :root    选择文档的根元素。
 *     :empty    p:empty    选择没有子元素的每个 <p> 元素（包括文本节点）。
 *     :target    #news:target    选择当前活动的 #news 元素。
 *     :enabled    input:enabled    选择每个启用的 <input> 元素。
 *     :disabled    input:disabled    选择每个禁用的 <input> 元素
 *     :checked    input:checked    选择每个被选中的 <input> 元素。
 *     :not(selector)    :not(p)    选择非 <p> 元素的每个元素。
 *     ::selection    ::selection    选择被用户选取的元素部分。
 *
 * @class app
 */
(function (xt, r, app, undefined) {
    /**
     * @property  是否是调试状态
     * @default false
     * @type {boolean}
     */
    app.debug = false;
    /**
     * @property  是否禁止显示错误信息，只针对系统自动产生的错误，如http提交时。
     * @default false
     * @type {boolean}
     */
    app.disableError = false;
    /**
     * ajax功能选项，可以使用jQuery替换。app.ajax只支持一个ajax()方法。
     *
     * @property optAjax
     * @type {Object}
     * @default app.ajax
     */
    app.optAjax = typeof jQuery != 'undefined' ? jQuery : false;
    /**
     * 站点根路径，通常上传的图片使用这个值
     * @property root
     * @type {string}
     * @default ''
     */
    app.root = '';
    /**
     * api请求的根路径，api请求可以缩短路径拼写。
     * 默认的http请求在url前都会加上这个路径，root+apiroot为完整的起始路径
     * @property apiroot
     * @type {string}
     * @default ''
     */
    app.apiroot = '';
    /**
     * 需要执行的初始化函数，内部用
     * @type {Array}
     */
    app.initFunction = [];
    /**
     * 多个待执行函数
     * @type {Array}
     */
    app.readyFunction = [];
    /**
     * 通用提示函数，默认调用window.alert()
     * @method alert
     * @param msg 提示信息
     */
    app.alert = function (msg) {
        window.alert(msg);
    };
    /**
     * 显示自动消失的提示消息
     * @method toast
     * @param msg {string} 要显示的内容
     */
    app.toast = function (msg) {
        window.alert(msg);
    };
    /**
     * 弹出一个确认框
     * @param message {string} 提示信息
     * @param callback {function} 确认后的回调
     */
    app.confirm = function (message, callback) {
        if (window.confirm(message)) {
            callback();
        }
    };
    /**
     * 通用的返回函数，默认调用history.back()
     * @param reload {boolean} 是否刷新，默认为false
     * @method back
     */
    app.back = function (reload) {
        if (document.referrer && reload === true) {
            location.href = document.referrer;
        } else {
            history.back();
        }
    };
    /**
     * 事件绑定，与jQuery相同的功能，默认也是直接使用jQuery.on
     *
     * @method on
     * @param owner {string|dom} 绑定事件的起点
     * @param eventName {string} 一个或多个用空格分隔的事件类型和可选的命名空间，如"click"或"keydown.myPlugin"
     * @param selector {string} 一个选择器字符串用于过滤器的触发事件的选择器元素的后代。如果选择的< null或省略，当它到达选定的元素，事件总是触发
     * @param data {object} 当一个事件被触发时要传递event.data给事件处理函数
     * @param callback {function} 该事件被触发时执行的函数。 false 值也可以做一个函数的简写，返回false
     */
    app.on = function (owner, eventName, selector, data, callback) {
        if (typeof jQuery != 'undefined') {
            jQuery(owner).on(eventName, selector, data, callback);
        }
    };
    /**
     * 跳转到指定页面
     * @method go
     * @param url {string} 目标地址
     * @param cacheName {string} [可选] 缓存的名称
     */
    app.go = function (url, cacheName) {
        r.util.gotoUrl(url, cacheName);
    };
    /**
     * 重置加载当前页面
     * @method reload
     */
    app.reload = function () {
        location.reload();
    };
    /**
     * 显示登陆页，默认直接转到login.html页，登陆完成后调用app.closeLogin()关闭登陆页。
     * @method showLogin
     */
        //登陆页现在有3种，微信里，页面内容直接被替换为login.html，app里是新建一个login.html盖住当前页，测试时是直接转到login.html
        //关闭时，微信直接reload即可，app是关闭login页，测试是回退到上一页。
    app.showLogin = function () {
        location.href = 'login.html';
    };
    /**
     * 关闭登陆页
     * @method closeLogin
     */
    app.closeLogin = function () {
        app.back(true);
    };

    /**
     * 通用的报错函数，如果data.error不为0就会显示错误
     * @method error
     * @param data 待检查数据
     */
    app.error = function (data) {
        if (data && data.relogin) {
            app.showLogin();
        } else {
            if (data && typeof data.error === 'string') {
                app.toast(data.error);
            } else if (typeof data === 'string') {
                app.toast(data);
            } else {
                if (app.debug) {
                    app.toast('数据请求出错，请检查网络是否可以正常访问！');
                }
            }
        }
    };
    /**
     * 窗口准备好后要执行的内容，常用于调用数据。
     *
     * 示例：
     *
     *     app.ready(function()){
     *         alert('可以加载数据了');
     *     }
     *
     * @method ready
     * @param {Object} callback 回调函数
     */
    app.ready = function (callback) {
        if (typeof callback != 'function') {
            return;
        }
        var rf = {executed: false, callback: callback};
        if (xt.isInit) {
            rf.callback();
            rf.executed = true;
        }
        app.readyFunction.push(rf);
    };


    /**
     *请求并绑定远程数据，支持数组和单变量绑定，功能全面
     *
     * 示例：
     *
     *     app.ajaxBind('data','getNews');//简单绑定
     *
     *     app.ajaxBind('data','getNews','',function(e){//数据过滤
     *         return e.data;//这里可以自定义处理一些内容。
     *     });
     *     app.ajaxBind('data','getNews','',function(e){//数据过滤
     *             return e.data;//这里可以自定义处理一些内容。
     *         },
     *         function(e){
     *             alert('ok');
     *         },
     *         function(){
     *              alert('error');
     *         }
     *     );
     *
     * @method ajaxBind
     * @param {string} id           绑定名，如果为空，绑定数组时默认为data，绑定Object时为''
     * @param {string} postUrl      请求的api地址，这个地址不需要完整的地址，root+apiroot+postUrl是完全的请求路径
     * @param {Object} param       [可选]  请求的参数，参数如果为''或未设置时，则直接使用调用页的参数
     * @param {function} datafilter  [可选]  数据过滤，只返回有效数据时行绑定，将需要绑定的数据return，如果不指定，可以使用false，这时自动使用取名称data的数据进行绑定
     * @param {function} callback    [可选] 请求成功的回调
     * @param {function} errorback    [可选] 请求失败的回调
     */
    app.ajaxBind = function (id, postUrl, param, datafilter, callback, errorback) {
        if (typeof postUrl == 'undefined') {
            postUrl = id;
            id = '';
        }
        return app.ajax(postUrl, param).bind(id).filter(datafilter).success(callback).error(errorback);
    };
    /**
     * 支持独立设置的ajax请求方法
     *
     * 示例：
     *
     *     app.ajax(postUrl, param).bind(id).filter(datafilter).success(callback).error(errorback);
     *
     *     filter：数据过虑回调
     *     success：请求成功回调
     *     error：请求出错回调
     *     bind：指定绑定名称
     *     isAppend：是否在绑定数组时使用追加
     *
     * @param postUrl 请求的api地址，这个地址不需要完整的地址，root+apiroot+postUrl是完全的请求路径
     * @param {Object} param       [可选]  请求的参数，参数如果为''或未设置时，则直接使用调用页的参数
     * @returns {ajax} 一个ajax请求的对象，支持filter、success、error、bind、isAppend几个方法。
     */
    app.ajax = function (postUrl, param) {
        if (param === '' || typeof param == 'undefined') {
            param = r.util.getUrlQuery();
        }
        var option = {
            id: '',
            url: postUrl,
            param: param,
            f_datafilter: undefined,
            f_success: undefined,
            f_error: function (data) {
                app.error(data);
            },
            isAppend: false,
            isAnimation: app.animationBind
        };
        /**
         * 数据过虑回调
         * @method filter
         * @param val
         */
        option.filter = function (val) {
            if (typeof val === 'function') {
                this.f_datafilter = val;
            }
            return this;
        };
        /**
         * 请求成功回调
         * @method success
         * @param val
         */
        option.success = function (val) {
            if (typeof val === 'function') {
                this.f_success = val;
            }
            return this;
        };
        /**
         * 请求出错回调
         * @method error
         * @param val
         */
        option.error = function (val) {
            if (typeof val === 'function') {
                this.f_error = val;
            }
            return this;
        };
        /**
         * 指定绑定的id
         * @method bind
         * @param val
         */
        option.bind = function (val) {
            this.id = val;
            return this;
        };
        /**
         * 是否在绑定数组时使用追加
         * @method isAppend
         * @param val
         */
        option.append = function (val) {
            this.isAppend = val === true;
            return this;
        };
        /**
         * 是否启动动画效果
         * @param val
         * @returns {option}
         */
        option.animation = function (val) {
            this.isAnimation = val === true;
            return this;
        };

        if (!app.util.isPlainObject(option.param)) {
            option.param = {};
        }
        if (app.login) {
            option.param.token = app.login.token;
        }
        if (app.enableJsonp) {
            app.jsonp.get(app.root + app.apiroot + option.url, option.param, function (e) {
                success(option, e);
            }, function (e) {
                option.f_error(e);
            });
        } else {
            app.http.post(app.root + app.apiroot + option.url, option.param, function (e) {
                success(option, e);
            }, function (e) {
                option.f_error(e);
            });
        }

        return option;
    };
    function success(option, e) {
        var data;
        if (option.f_datafilter !== undefined) {
            data = option.f_datafilter(e);
        } else {
            data = e.data;
        }
        //bind data
        if (data) {
            if (app.util.isArray(data)) {
                if (data.length > app.animationBindMin) {
                    r.bindRepeatData(option.id, data, option.isAppend, option.isAnimation);
                } else {
                    r.bindRepeatData(option.id, data, option.isAppend);
                }
            } else {
                if (option.id) {
                    r.bindData(option.id, data);
                } else {
                    r.bindData(data);
                }
            }
        }
        //bind end
        if (option.f_success !== undefined) {
            option.f_success(data);
        }
    }

    /**
     * 数组自动绑定，当没有数据时自动显示[id]_empty的内容，只解决简单的绑定及无数据提示。
     * 返回的数据中要时行绑定的数据名固定为data
     *
     * 示例：返回的数据为{"error":0,"data":{"id":1}}，本方法将自动返回data部分
     *
     *     app.iBind('getNews');//取getNews的数据，并绑定，未指定绑定名
     *     app.iBind('data','getNews');//取getNews的数据，并绑定，指定绑定名为data
     *
     * 以上都未设置参数param的值，param将进行自动设置，默认为当前页的url的参数，详见XTemplate
     *
     *     app.iBind('data','getNews',{"id":10});//指定参数和绑定名，取getNews的数据
     *
     * @method iBind
     * @param id 绑定名 [可选]
     * @param postUrl 请求的api地址，这个地址不需要完整的地址，root+apiroot+postUrl是完全的请求路径
     * @param param [可选] 请求的参数，参数如果为''或未设置时，则直接使用调用页的参数
     * @param callback {function} [可选] 回调函数
     */
    app.iBind = function (id, postUrl, param, callback) {
        if (typeof postUrl == 'undefined') {
            postUrl = id;
            id = '';
        }
        if (typeof param === "function") {
            callback = param;
            param = undefined;
        }
        app.util.setHide('#' + id + '_loading', false);
        return app.ajax(postUrl, param).filter(function (e) {
            if (e.data) {
                if (app.util.isArray(e.data)) {
                    if (e.data.length > 0) {
                        app.util.setHide('#' + id + '_empty');
                    } else {
                        app.util.setHide('#' + id + '_empty', false);
                    }
                }
                return e.data;

            }
            app.util.setHide('#' + id + '_loading');
            return false;
        }).success(callback).bind(id);
    };
    /**
     * 动画绑定属性，只在绑定列表时有效
     * @property animationBind
     * @type {boolean}
     * @default false
     */
    app.animationBind = false;
    /**
     * 是否使用jsonp方式请求数据
     * @property enableJsonp
     * @type {boolean}
     * @default false
     */
    app.enableJsonp = false;
    /**
     * 动画绑定属性最小值，与animationBind联合使用，只有在列表大于最小值时才执行动画
     * @property animationBindMin
     * @type {number}
     * @default 5
     */
    app.animationBindMin = 5;
    /**
     * 提示一个表单数据到远程
     * 示例：
     *
     *     app.postForm('formid','getNews');
     *
     *     app.postForm(['username','password'],'getNews');
     *
     * @method postForm
     * @param name {string|array|object} 表单的id或是表单元素名称的数组或是表单本身(this)
     * @param postUrl {string} 远程的url
     * @param param  [可选] 附加的参数
     * @param callback {function} [可选] 成功的回调
     * @param errorback {function}  [可选] 失败的回调
     */
    app.postForm = function (name, postUrl, param, callback, errorback) {
        if (typeof param === 'function') {
            errorback = callback;
            callback = param;
            param = {};
        }

        if (!app.util.isPlainObject(param)) {
            param = {};
        }

        var formParam = app.form.getFormParam(name, true);
        if (formParam === undefined) {
            return;
        }
        //传入的参数优先级最高
        for (var k in param) {
            if (k !== '' && param[k]) {
                formParam[k] = param[k];
            }
        }
        app.post(postUrl, formParam, callback, errorback);
    };
    /**
     * 请求数据，同时使用通用的处理方式处理数据错误。如果指定的错误的处理方式，就用指定的方式。
     * 请求时会自动带上登陆信息token
     * 请求返回的必须json格式数据，如果为文本，会自动强转为json
     * 请求数据时，url前会自动加上this.root + this.apiroot，而http模块下的post不会自动修改url
     *
     * 示例：
     *
     *     app.post('getNews',{"id":1},function(data){
     *         console.log(data);
     *     });
     *
     * @method post
     * @param url {string} 请求的地址
     * @param param 附加的参数，如果加载的登陆模块，则自动附加token参数
     * @param callback {function} [可选] 请求成功的回调参数
     * @param errorback {function} [可选] 失败的回调参数。如果为空使用默认的错误处理
     */
    app.post = function (url, param, callback, errorback) {
        if (typeof param === "function") {
            errorback = callback;
            callback = param;
            param = {};
        }
        if (param === '' || typeof param == 'undefined') {
            param = r.util.getUrlQuery();
        }
        if (!app.util.isPlainObject(param)) {
            param = {};
        }
        if (app.login) {
            param.token = app.login.token;
        }
        if (typeof errorback != 'function') {
            errorback = app.error;
        }
        app.http.post(app.root + app.apiroot + url, param, callback, errorback);
    };
    /**
     * 请求数据，同时使用通用的处理方式处理数据错误。如果指定的错误的处理方式，就用指定的方式。
     * 请求时会自动带上登陆信息token
     * 请求返回的必须json格式数据，如果为文本，会自动强转为json
     * 请求数据时，url前会自动加上this.root + this.apiroot，而http模块下的post不会自动修改url
     * 与app.post的区别在于如果jsonp可用，会优先使用jsonp，其次用post.
     *
     * 示例：
     *
     *     app.get('getNews',{"id":1},function(data){
     *         console.log(data);
     *     });
     *
     * @method get
     * @param url {string} 请求的地址
     * @param param 附加的参数，如果加载的登陆模块，则自动附加token参数
     * @param callback {function} [可选] 请求成功的回调参数
     * @param errorback {function} [可选] 失败的回调参数。如果为空使用默认的错误处理
     */
    app.get = function (url, param, callback, errorback) {
        if (typeof param === "function") {
            errorback = callback;
            callback = param;
            param = {};
        }
        if (param === '' || typeof param == 'undefined') {
            param = r.util.getUrlQuery();
        }
        if (!app.util.isPlainObject(param)) {
            param = {};
        }
        if (app.login) {
            param.token = app.login.token;
        }
        if (typeof errorback != 'function') {
            errorback = app.error;
        }
        if (app.enableJsonp) {
            app.jsonp.get(app.root + app.apiroot + url, param, callback, errorback);
        } else {
            app.http.post(app.root + app.apiroot + url, param, callback, errorback);
        }

    };
    /**
     * 绑定数据，将html中data-bind='绑定名'的节点内容设置为data，是XTemplate.bindName的别名
     *
     * 示例：
     *
     *     app.bind('username','jake');
     *
     * @method bind
     * @param id 绑定名，用data-bind指定
     * @param data 待绑定数据
     */
    app.bind = function (id, data) {
        r.bindName(id, data);
    };
    /**
     * 循环绑定数据值，是XTemplate.bindRepeatData的别名
     *
     * 示例：
     *
     *     bindRepeatData([{id:1},{id:2}])
     *     bindRepeatData('news',[{id:1},{id:2}])
     *
     * @method bindRepeatData
     * @param name 要循环输出的模板范围的名称，默认为data，可省略不写
     * @param data 要绑定的数据
     */
    app.bindRepeatData = function (name, data) {
        r.bindRepeatData(name, data);
    };
    /**
     * 绑定单个变量，是XTemplate.bindData的别名
     *
     * 当未指定名称时，在绑定时直接使用属性名，例：{key:'key1'}，绑定时只需key即可
     * 当指定名称时，在绑定时需要在属性名前加上指定的名称，例：{key:'key1'}，名称为data1,绑定时需data1.key
     * 绑定的数据会缓存在$scope内
     *
     * 示例：
     *
     *     bindData('data',{id:1});绑定时用data-bind='data.id'，如<p data-bind='data.id'/>
     *     bindData({id:1});绑定时用id，注意此时省略了名称
     *
     * @method bindData
     * @param name 绑定对象的名称，如果不设置时定的key不加绑定名
     * @param data 要绑定的数据
     */
    app.bindData = function (name, data) {
        r.bindData(name, data);
    };
    /**
     * 是否绑定app本身
     * @property bindApp
     * @type {boolean}
     * @default true
     */
    app.bindApp = true;
    /**
     * 窗口准备完毕，可以开始加载数据
     */
    xt.ready(function () {
        if (!app.debug) {
            // 禁止右键菜单
            document.oncontextmenu = function () {
                return false;
            };
        }
        //执行初始化函数

        for (var i = 0; i < app.initFunction.length; i++) {
            app.initFunction[i](app);
        }
        //绑定app基础数据
        if (app.bindApp) {
            r.bindData('app', app);
        }
        var exec = function (af) {
            if (!af.executed) {
                af.executed = true;
                setTimeout(function () {
                    af.callback();
                }, 1);
            }
        };
        for (var j = 0; j < app.readyFunction.length; j++) {
            exec(app.readyFunction[j]);
        }
    });
}(window.jsTemplate, window.jsRender, window.app = {}));