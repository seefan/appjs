/**
 * JsTemplate的运行主体，对外使用的变量有$scope，当使用bindData时，变量会按绑定名字注入这个变量。
 *
 * 目前支持两种形式的绑定，单变量绑定和数组。
 *
 * 单变量绑定
 * =============
 *
 * 是以html中data-bind标记为绑定对象，只要data-bind的内容和绑定的变量同名，即会自动赋值。
 *
 * 例如：
 *
 *     <p data-bind='title'></p>
 *
 * 这时如果有一个变量为如下结构{title:'hello world'}，那么，这个data-bind为title的p标签就会显示hello world。
 *
 * 最终会生成
 *
 *     <p data-bind='title'>hello world</p>
 *
 *
 * 使用方法参见示例：
 *
 * 1.普通绑定：输出到p的默认内容中，此处为innerHTML属性。一般img将输出到src，input输出到value，其它输出到innerHTML。
 *
 *     <p data-bind="content"></p>
 *
 * 2.原始值按html输出：
 *
 *     <p data-bind="content" data-bind-to="innerHTML"></p>
 *     或
 *     <p data-bind="content" data-bind-to="innerHTML">{!content}</p>
 *     第1种为简写，第2种为data-bind-to的标准写法
 *
 *
 * 3.data-bind-to使用：
 *
 *     <b data-bind="market_product_id" data-bind-to="title" title="{!content}">title</b>
 *
 *     data-bind-to指定了输出的属性，所以将绑定的内容将按data-bind-to进行绑定。此处data-bind-to为title，
 *     待绑定的属性内容要使用模板。
 *     所以XTemplate将会把market_product_id的值绑定到title属性上。
 *     此处模板内content前有个叹号“！”，代表输出原始值，不进行html转义。
 *
 * 4.模板输出：必须使用data-bind-to指定属性名，默认的输出属性值不会当作模板。
 *
 *     <p data-bind="content" data-bind-to="innerHTML"><b>{content|default,'没有内容显示'}</b></p>
 *
 *     content的内容会以内部html为模板绑定后显示
 *
 *     如果content为空，最终输出
 *
 *     <p data-bind="content" data-bind-to="innerHTML"><b>没有内容显示</b></p>
 *
 *     如果刚开始不想显示出模板的内容，可以将p设置为隐藏
 *
 *     <p style="display:none" data-bind-to="innerHTML" data-bind="content"><b>{content|default,'没有内容显示'}</b></p>
 *
 *     或
 *
 *     <p class="hide" data-bind-to="innerHTML" data-bind="content"><b>{content|default,'没有内容显示'}</b></p>
 *
 *     绑定后style.display将被重置为空，css中的hide也会被移除。
 *
 * 5.img的src绑定：
 *
 *     <img data-bind="thumb"/>
 *     最终输出<img data-bind="thumb" src="图片地址"/>
 *
 *     指定img的默认显示图片，直接使用原来的src指定默认图
 *     <img data-bind="imgsrc" data-bind-src='/{imgsrc}/abc.jpg' src='默认图'/>
 *
 *     如果img的地址比较复杂，是组合而成，或是需要用函数，可以使用data-bind-src来指定src的模板。
 *     <img data-bind="thumb" data-bind-src="{thumb1|default,'logo.jpg'}"/>
 *
 *     注意不要用src属性！！！
 *
 *     不使用data-bind-to指定src，是因为如果指定img的src，将会使浏览器多产生一个无效的http请求，影响加载效果。
 *
 *     错误的例子：<img data-bind="thumb" data-bind-to="src" src='/{imgsrc}/abc.jpg'>
 *     /{imgsrc}/abc.jpg这个地址是不存在的地方，所以会引起一个错误的http请求。
 *
 * 6.在一个标签内绑定多个属性名:
 *
 *     <img data-bind="thumb" data-bind-to="title data-load-src"/>
 *     多个属性中间用空格分开，这个可以一次绑定属性。
 *
 * 数组绑定
 * =============
 * 数组绑定是指定一个模板，并把数组的内容循环，按模板格式化后返回多行html。
 *
 * 例如：
 *
 *      <ul data-repeat-name='listdata'>
 *          <li>{title}</li>
 *      </ul>
 *
 * 这里定义了一个名为listdata的模板，ul的内部html将成为可循环的模板，即
 *
 *      <li>{title}</li>
 *
 * 为待循环的内容
 *
 * 我们绑定以下变量[{title:'hello 0'},{title:'hello 1'}]
 *
 * 最终会生成
 *
 *     <ul data-repeat-name='listdata'>
 *          <li>hello 0</li>
 *          <li>hello 1</li>
 *     </ul>
 *
 * 使用方法参见示例：
 *
 * 1.普通输出：
 *
 *      <ul data-repeat-name='data'>
 *          <li>{market_product_id}:{product_name}</li>
 *      </ul>
 *
 * 2.img的src绑定：
 *
 *      <ul data-repeat-name='data'>
 *          <li><img data-bind-src='{thumb}'/>{market_product_id}:{!content}</li>
 *      </ul>
 *
 *      这里与单变量绑定不同的是没有使用data-bind指定绑定的属性，其它使用方法完全一致。
 *
 * 模板的使用
 * =============
 *
 * 模板的基本语法是{模板内容}，两端以大括号包围，中间为模板的内容。
 *
 * 如：{username}，即输出变量username的内容。
 *
 * 模板可以在循环的模板中使用，也可以在待绑定属性中使用，也可以在data-bind-src中使用。
 *
 * 使用方法参见示例：
 *
 * 1.使用内部函数处理输出结果：
 *
 *
 *     {market_product_num|repeat,'*'}//最终输出market_product_num个*，{{#crossLink "Render.funcs/repeat:method"}}{{/crossLink}}为内部函数
 *
 *     语法为：[属性名]|[函数]|[函数]
 *     属性名后竖线"|"连接函数名，当前的属性必须为函数的第1个参数。
 *     多个函数时依次用竖线连接，前一个函数作为后一个函数的第一个变量输入。
 *
 *     如：{user_money|format_money}，其中user_money为绑定属性名，{{#crossLink "Render.funcs/format_money:method"}}{{/crossLink}}为内部函数名，主要作用为格式化货币。
 *
 *     如果函数有多个参数，使用逗号连接。
 *
 *
 * 2.使用外部函数处理输出结果：
 *
 *     {market_product_id|#hello,':)'}
 *
 *     函数名前加了#号，代表使用外部函数，此处使用了hello，该函数使用前一定要定义。
 *
 *     此处market_product_id的值会传给s变量，即第1个变量。
 *
 *     示例1：
 *
 *     function hello(s){
 *         return s+' hello';
 *     }
 *
 *     示例2：
 *     function hello(s,v){
 *         return s+'hello'+v;
 *     }
 *
 *
 * 3.使用多个函数处理输出结果：
 *
 *     {market_product_id|repeat,'@@'|#hello,':)'}
 *
 *     用|连接即可。
 *
 * 4.使用外部变量：
 *
 *     {id}={#out_abc}
 *
 *     变量前加#
 *
 * 5.进行简单的运算：
 *
 *     {market_product_id * 3 + 12}
 *
 *     在模板中，属性名支持简单的加减乘除运算，复杂的请使用自定义函数处理。
 *
 * 6.在模板中处理子循环：
 *
 *     {list|range,'ID:(id)&nbsp; '}
 *
 *     使用内部函数range，参数为模板内容。但为了区分子模板和主模板，子模板使用小括号“()”代替大括号。
 *
 *
 *
 * 特殊语法：
 * =============
 *
 * !号的使用
 *
 * 在模板中使用，例如{!title}，输出title的值，以没有!的区别，这里不会把html进行编码，会输出原始的html。
 *
 * #号的使用
 *
 * 在函数名中使用，如果在函数名前加#，则指定这个函数为全局函数，这时这个函数必须是已经定义好的全局函数或是javascript的内部函数。
 * 在变量名中使用，如果果变量名前加#，则指定这个变量为全局变量，这时这个变量必须是已经定义好的全局变量。
 *
 *
 * 绑定示例
 * =============
 *
 *     注意：使用load方法，需要jQuery的支持，详细见API中关于函数的介绍
 *
 *     第1个参数为为绑定名称，第2个为请求的数据地址，第3个为请求的参数，第4个为数据过滤处理，一般用于把要绑定的数据返回。
 *
 * json的数据内容为
 *
 *     {
 *     "error":0,
 *     "data":[
 *      {"thumb":"../images/product-1.jpg","product_name":"体验品","price":12,"oldprice":100},
 *      {"thumb":"../images/product-2.jpg","product_name":"体验品","price":13,"oldprice":100},
 *      {"thumb":"../images/product-3.jpg","product_name":"体验品","price":24,"oldprice":100},
 *      {"thumb":"../images/product-4.jpg","product_name":"体验品","price":15,"oldprice":100},
 *      {"thumb":"../images/product-5.jpg","product_name":"体验品","price":65,"oldprice":100},
 *      {"thumb":"../images/product-6.jpg","product_name":"体验品","price":32,"oldprice":100}
 *     ]}
 *
 * 模板内容为
 *
 *     <ul data-repeat-name='data0'>
 *         <li>{product_name} {price} <s>{oldprice}</s> </li>
 *     </ul>
 *
 * script为
 *
 *      XTemplate.ready(function () {
 *         this.load('data0', 'data.json', {}, function (e) {
 *             return e.data;
 *         });
 *     });
 *
 * 最终将输出
 *
 *     <ul data-repeat-name='data0'>
 *          <li>体验品 12 <s>100</s> </li>
 *          <li>体验品 13 <s>100</s> </li>
 *          <li>体验品 24 <s>100</s> </li>
 *          <li>体验品 15 <s>100</s> </li>
 *          <li>体验品 65 <s>100</s> </li>
 *          <li>体验品 32 <s>100</s> </li>
 *     </ul>
 *
 * @class Render
 */
(function (w, doc, r) {
    'use strict';
    //
    /**
     * 全局变量，绑定到window
     * @property $scope
     * @type {object}
     */
    w.$scope = {};
    //可绑定的key列表
    r.$bindKey = {};

    //语法处理
    r.syntax = {};
    //内部函数
    r.funcs = {};
    //工具
    r.util = {};
    /**
     * 初始化语法结构
     */
    r.init = function () {
        var items, i;
        if (this.hideRepeat) {
            items = r.util.querySelectorAll('[data-repeat-name]');
            for (i = 0; i < items.length; i++) {
                this.util.show(items[i], false);
            }
        }
        if (this.hideBind) {
            items = r.util.querySelectorAll('[data-bind]');
            for (i = 0; i < items.length; i++) {
                this.util.show(items[i], false);
            }
        }
    };

    /**
     * 绑定数据值
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
    r.bindData = function (name, data) {

        if (typeof data === 'undefined') {
            data = name;
            name = '__data__';
        }
        w.$scope[name] = data;
        var items = r.util.querySelectorAll('[data-bind]');

        if (!items || !items.length) {
            return;
        }
        var i, value, tpl, attrName, key;
        for (i = 0; i < items.length; i++) {
            value = '';
            key = items[i].attributes['data-bind'].value;
            if (name != '__data__' && key.indexOf('.') != -1) {
                key = key.substring(name.length + 1);
            }
            var bs = this.util.getBindToNameList(items[i]),
                m = 0;//data-bind-to

            if (bs.length > 0) {
                for (; m < bs.length; m++) {
                    attrName = bs[m];
                    if (items[i].attributes[attrName]) {
                        tpl = items[i].attributes[attrName].value;
                    } else {
                        tpl = items[i][attrName];
                    }
                    //var xf = r.syntax.buildFunc(key, tpl);
                    var xf = r.syntax.cacheFunc('bind', tpl, tpl);
                    if (xf.func) {
                        value = xf.func(this, data);
                    } else {
                        //如果简单的绑定innerHTML,就不再转为纯文本了
                        if (attrName === 'innerHTML') {
                            value = this.util.getValue(key, data);
                        } else {
                            value = this.util.html(this.util.getValue(key, data));
                        }
                    }
                }

            } else {
                //单独处理一下img的data-bind-src，使用模板
                if (items[i].tagName == 'IMG' && items[i].attributes['data-bind-src']) {
                    //var xff = r.syntax.buildFunc(key, items[i].attributes['data-bind-src'].value);
                    var xff = r.syntax.cacheFunc('bind', items[i].attributes['data-bind-src'].value, items[i].attributes['data-bind-src'].value);
                    if (xff.func) {
                        value = xff.func(this, data);
                    } else {
                        value = this.util.getValue(key, data);//不需要html转义
                    }
                } else {
                    value = this.util.html(this.util.getValue(key, data));
                }
            }

            this.util.setValue(items[i], value);
            this.util.show(items[i]);
        }
    };
    /**
     * 重新给某个对象绑定新的值，修改后的值不会更新$scope内部缓存的值
     *
     * @method bindName
     * @param name 绑定名，用data-bind指定
     * @param value 绑定值
     */
    r.bindName = function (name, value) {
        var items = r.util.querySelectorAll('[data-bind="' + name + '"]');
        if (items) {
            for (var i = 0; i < items.length; i++) {
                this.util.setValue(items[i], value);
                this.util.show(items[i]);
            }
        }
    };
    /**
     * 循环绑定数据值
     *
     * 示例：
     *
     *     bindRepeatData([{id:1},{id:2}])
     *     bindRepeatData('news',[{id:1},{id:2}])
     *
     * @method bindRepeatData
     * @param name 要循环输出的模板范围的名称，默认为data，可省略不写
     * @param data 要绑定的数据
     * @param append [可选] 是否追加数据，默认为false
     * @param animation [可选] 是否追加数据，默认为false
     * @param tpl [可选] 指定模板内容
     */
    r.bindRepeatData = function (name, data, append, animation, tpl) {
        if (typeof data == 'undefined') {
            data = name;
            name = 'data';
        }
        if (!data || !r.util.isArray(data)) {
            return;
        }
        var items = r.util.querySelectorAll('[data-repeat-name="' + name + '"]');
        //if (items.length === 0) {
        //    return;
        //}
        //var item = items[0];
        //if (!item || !item.innerHTML) {
        //    return;
        //}

        for (var i = 0; i < items.length; i++) {
            r.doRepeat(name + '_' + i, data, append, animation, tpl, items[i]);
        }
    };
    r.doRepeat = function (name, data, append, animation, tpl, item) {
        if (typeof tpl != 'string') {
            tpl = item.innerHTML;
        }
        var cache = this.syntax.cacheFunc('repeat', name, tpl), i = 0;
        if (!append || cache.isFirst) {
            item.innerHTML = '';
        }
        var func = cache.func;
        if (func) {
            if (animation === true) {
                this.appendData(data, 0, item, func, append);
            } else {
                var html = '';
                for (i = 0; i < data.length; i++) {
                    var tmp = data[i];
                    tmp.__index__ = i;
                    html += func(this, tmp);
                }
                this.setRepeatHtml(item, html, append);
            }
        }
    };
    r.appendData = function (data, i, item, func, append) {
        var tmp = data[i];
        tmp.__index__ = i;
        r.setRepeatHtml(item, func(this, tmp), i === 0 ? (append === true) : true);
        i++;
        if (i < data.length) {
            setTimeout(function () {
                r.appendData(data, i, item, func, append);
            }, 50);
        }
    };
    r.setRepeatHtml = function (item, html, append) {
        if (append === true) {
            item.innerHTML += html;
        } else {
            item.innerHTML = html;
        }
        r.util.show(item);
    };

    /**
     * 如果需要自行扩展Render的函数，请使用本函数。
     * 这些函数可以在html的模板中使用
     *
     * 示例：
     *
     *     addFunc('test',function(){
     *        alert('test');
     *     });
     *
     * 使用时和内部函数一样，语法为{name|test}
     *
     * @method addFunc
     * @param name 函数的名称
     * @param func 函数体
     */
    r.addFunc = function (name, func) {
        if (func && name) {
            this.funcs[name] = func;
        }
    };
})
(window, document, window.jsRender = {});;/**
 * 常用工具方法集合
 * @class Render.util
 */
(function (w, u) {
    'use strict';
    /**
     * 清理代码，主要是清理掉换行和空格
     *
     * @method trim
     * @param val {string} 要清理的内容
     */
    u.trim = function (val) {
        if (typeof(val) == 'string') {
            return val.replace(/\r/g, '').replace(/\n/g, '').replace('　', '').trim();
        } else if (u.isPlainObject(val)) {
            return u.trim(u.getDefaultValue(val));
        } else {
            return String.valueOf(val);
        }
    };
    /**
     * 是否是一个简单的对象
     * @method isPlainObject
     * @param value 目标对象
     * @returns {boolean}
     */
    u.isPlainObject = function (value) {
        return !!value && Object.prototype.toString.call(value) === '[object Object]';
    };

    /**
     * 给指定html网页中对象设置值，目前对img设置src，input设置value，其它设置innerHTML。
     * 此方法内部用。
     *
     * @param ele 对象实例
     * @param value 值
     */
    u.setValue = function (ele, value) {
        var tag = ele.tagName, i = 0;
        var bs = this.getBindToNameList(ele);
        if (bs.length > 0) {
            for (i in bs) {
                var attrName = bs[i];
                if (ele.attributes[attrName]) {
                    ele.setAttribute(attrName, value);
                } else {
                    ele[attrName] = value;
                }
            }
        } else {
            switch (tag) {
                case 'IMG':
                    ele.src = value;
                    break;
                case 'INPUT':
                    ele.value = value;
                    break;
                case 'SELECT':
                    for (i = 0; i < ele.options.length; i++) {
                        if (ele.options[i].value == value) {
                            ele.options[i].selected = true;
                            break;
                        }
                    }
                    break;
                default:
                    ele.innerHTML = value;
                    break;
            }
        }
    };

    /**
     * 过滤html，清理掉所有的html标签和换行空格
     *
     * @param html {string}
     * @returns {string}
     */
    u.html = function (html) {
        if (html && typeof(html) == 'string') {
            html = html.replace(/<[^<]*>/gi, '');
            return html.trim();
        } else {
            return this.getDefaultValue(html);
        }
    };
    /**
     * 判断变量是否为数组
     *
     * @param val 要判断的变量
     * @returns {boolean} 是否为数组
     */
    //u.isArray = function (val) {
    //    return toString.apply(val) === "[object Array]";
    //};
    u.isArray = Array.isArray || function (object) {
            return object instanceof Array;
        };
    /**
     * 取数组的key全集，内部使用
     * @param key
     * @param data
     * @returns {*}
     */
    u.getName = function (key, data) {
        var value = data[key];
        var type = typeof value;
        switch (type) {
            case 'string':
            case 'number':
            case 'boolean':
                return [key];
            case 'object':
                if (u.isArray(value)) {
                    return [key];
                } else {
                    var names = [];
                    for (var k in value) {
                        //跳过非属性
                        if (value.hasOwnProperty(k)) {
                            var tkv = u.getName(k, value);
                            for (var i = 0; i < tkv.length; i++) {
                                names.push(key + '.' + tkv[i]);
                            }
                        }
                    }
                    return names;
                }
                break;
            default:
                return [];
        }
    };
    /**
     * 是否有指定串开头
     *
     * 示例：
     *
     *     startWith('abcdedfs','ab')   输出 true
     *
     * @method startWith
     * @param str {string} 待检查的串
     * @param startString 指定串
     * @returns {boolean}
     */
    u.startWith = function (str, startString) {
        return (typeof str === 'string' && str.indexOf(startString) === 0);
    };
    /**
     * 使用正则表示式判断是否为数字格式
     *
     * @method isNumber
     * @param chars {string}待判断有串
     * @returns {boolean}
     */
    u.isNumber = function (chars) {
        var re = /^(-?\d+)(\.\d+)?/;
        return chars.match(re) !== null;
    };

    /**
     * 取指定数组的值，内部用
     * @param key
     * @param data
     * @returns {*}
     */
    u.getValue = function (key, data) {
        var keys = key.split('.'), result = data[keys.shift()];
        for (var i = 0; result && i < keys.length; i++) {
            result = result[keys[i]];
        }
        //
        return this.getDefaultValue(result);
    };
    /**
     * 取值，支持两种数据，简单变量和数组，如果为null或是undefined，自动转为空串。内部用
     * @param val
     * @returns {*}
     */
    u.getDefaultValue = function (val) {
        if (val === null || typeof val == 'undefined') {
            return '';
        } else {
            return val;
        }
    };
    /**
     * 转向一个url，支持多个参数，第一个参数为url地址，后续为参数
     *
     * 示例：
     *
     *     gotoUrl('index.html','id',1) 跳转到 index.html?id=1
     *     gotoUrl('index.html?id=1','k','news','c','show') 跳转到 index.html?id=1&k=news&c=show
     *
     * @method gotoUrl
     * @param url {string} 要跳转的url地址
     * @param ... 多个自由参数，2个一组，第1个为参数名，第2个为值。
     */
    u.gotoUrl = function () {
        var url = '', i = 0;
        if (arguments.length > 0) {
            url = arguments[i];
        }
        if (url.indexOf('?') != -1) {
            url += '&';
        } else {
            url += '?';
        }
        for (i = 1; i < arguments.length - 1; i += 2) {
            url += arguments[i] + '=' + encodeURIComponent(arguments[i + 1]) + '&';
        }
        w.location.href = url;
    };
    /**
     * 取绑定名列表，多个绑定名用空格分开，内部用
     * @param item 目标
     * @returns {Array} 返回绑定名列表
     */
    u.getBindToNameList = function (item) {
        var binds = item.attributes['data-bind-to'];
        var re = [];
        if (binds && binds.value) {
            var sps = binds.value.split(' ');
            var tmp, i = 0;
            for (; i < sps.length; i++) {
                tmp = u.trim(sps[i]);
                if (tmp !== '') {
                    re.push(tmp);
                }
            }
        }
        return re;
    };
    /**
     * 显示一个对象
     * 设置style.display=''，同时去掉class中名为hide样式
     *
     * @method show
     * @param ele {string} 要显示的对象实例
     * @param isTrue {boolean} 是否显示，默认为true
     */
    u.show = function (ele, isTrue) {
        if (ele) {
            if (isTrue !== false) {
                if (ele.style.display == 'none') {
                    ele.style.display = '';
                }
                u.removeClass(ele, 'hide');
            } else {
                ele.style.display = 'none';
            }
        }
    };
    /**
     * 增加一个class
     * @method setValue
     * @param ele {object} 要操作的对象
     * @param className {string} 要增加的class名称
     */
    u.addClass = function (ele, className) {
        if (ele.classList) {
            if (!ele.classList.contains(className)) {
                ele.classList.add(className);
            }
        } else {
            var css = ele.className;
            if (css) {
                var csss = css.split(' '), exists = false;
                for (var i = 0; i < csss.length; i++) {
                    if (csss[i] == className) {
                        exists = true;
                    }
                }
                if (!exists) {
                    csss.push(className);
                }
                css = csss.join(' ');
            } else {
                css = className;
            }
            ele.className = css;
        }
    };
    /**
     * 删除一个class
     * @method setValue
     * @param ele {object} 要操作的对象
     * @param className {string} 要删除的class名称
     */
    u.removeClass = function (ele, className) {
        if (ele.classList) {
            if (ele.classList.contains(className)) {
                ele.classList.remove(className);
            }
        } else {
            var css = ele.className;
            if (css) {
                var csss = css.split(' ');
                css = '';
                for (var i = 0; i < csss.length; i++) {
                    if (csss[i] != className) {
                        css += csss[i];
                    }
                }
                ele.className = css;
            }
        }
    };
    /**
     * 取url的所有参数
     * @method getUrlQuery
     * @returns {object}
     */
    u.getUrlQuery = function () {
        var args = {};

        var query = w.location.search;//获取查询串
        if (query && query.length > 1) {
            query = query.substring(1);
            var pos = query.indexOf('#');
            if (pos != -1) {
                query = query.substring(0, pos);
            }
            var pairs = query.split("&");
            for (var i = 0; i < pairs.length; i++) {
                pos = pairs[i].indexOf('=');//查找name=value
                if (pos == -1) {
                    continue;
                }
                //如果没有找到就跳过
                var argname = pairs[i].substring(0, pos);//提取name
                if (!argname) {
                    continue;
                }
                var value = pairs[i].substring(pos + 1);//提取value
                if (!value) {
                    continue;
                }
                args[argname] = decodeURIComponent(value);//存为属性
            }
        }
        return args;
    };
    /**
     * 设置url的参数
     * @method setUrlQuery
     * @param qs {object} 一个包含keyvalue的对象
     */
    u.setUrlQuery = function (qs) {
        var search = '';
        for (var q in qs) {
            if (qs[q]) {
                search += q + '=' + encodeURIComponent(qs[q]) + '&';
            }
        }
        w.location.search = search;
    };
    u.querySelectorAll = function (q) {
        if (document.querySelectorAll) {
            return document.querySelectorAll(q);
        }
    };
    /**
     * 计算表达式的值
     * @param fn
     * @returns {*}
     */
    u.eval = function (fn) {
        var Fn = Function; //一个变量指向Function，防止有些前端编译工具报错
        return new Fn('return ' + fn)();
    };
})(window, window.jsRender.util);;/**
 * Render 的语法定义
 */
(function (r) {


    /**
     * 将数据与模块绑定
     * @param tmpl
     * @returns {XML|string|void}
     */
    function runTemplate(tmpl) {
        var i = 0, start = 0, end = 0, word, result = [];
        while (i < tmpl.length) {
            start = tmpl.indexOf('{', i);
            if (start !== -1) {
                end = getEnd(tmpl, start, '}');
                if (end === -1) {
                    end = tmpl.length;
                }
                word = tmpl.substring(start + 1, end).trim();

                result.push(runText(tmpl.substring(i, start)));
                if (word !== '') {
                    result.push(runKeyword(word));
                }
            } else {
                result.push(runText(tmpl.substring(i)));
                end = tmpl.length;
            }
            i = end + 1;
        }
        return result.join('+');
    }

    /**
     * 处理字符串
     * @param text
     */
    function runText(text) {
        if (typeof(text) == 'string') {
            return '"' + text.replace(/"/g, '\\"').replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace('data-bind-src', 'src') + '"';
        } else {
            return r.util.getStringValue(text);
        }
    }

    /**
     * 处理函数关键字
     * @param funcString
     * @returns {*}
     */
    function runKeyword(funcString) {
        var filterHtml = true;
        if (funcString[0] == '!') {
            funcString = funcString.substring(1);
            filterHtml = false;
        }
        if (funcString) {
            var f = splitWord(funcString);
            if (f.length > 0) {
                if (filterHtml) {
                    return 'JsRender.util.html(' + runFuncString(f, f.length - 1) + ')';
                } else {
                    return runFuncString(f, f.length - 1);
                }
            }
        }
        return '""';
    }


    /**
     * 组合出函数结构
     * @param funcs
     * @param i
     * @returns {*}
     */
    function runFuncString(funcs, i) {
        if (funcs.length === 1) {
            return runValue(funcs[0]);
        }
        if (i > 0) {
            var array = [], j = 0, args = '';
            for (; i >= 0; i--) {
                if (funcs[i] === '|') {//发现一个函数
                    var funcName = array.pop();
                    for (j = array.length; j > 0; j--) {
                        args += runValue(array[j - 1]);
                    }

                    args = runFuncString(funcs, i - 1) + args;

                    return runFunc(funcName) + '(' + args + ')';
                } else {
                    array.push(funcs[i]);
                }
            }
            if (array.length > 0) {
                for (j = array.length; j > 0; j--) {
                    args += runValue(array[j - 1]);
                }
                return args;
            }
        } else {
            return runValue(funcs[0]);
        }

        return '';
    }

    /**
     * 取存在有函数名
     * @param funcName
     * @returns {string}
     */
    function runFunc(funcName) {
        if (funcName && funcName.length > 1 && funcName.charAt(0) == '#') {
            return funcName.substring(1);
        } else if (r.funcs[funcName]) {
            return 'my.funcs["' + funcName + '"]';
        } else {
            return 'my.funcs.noFunc';
        }
    }

    /**
     * 处理关键字
     * 有几类数据
     * 1、数字，可以以-.开头
     * 2、#开头的为全局变量
     * 3、循环变量
     * 4、以"或'包围的字符串
     * @param word
     */
    function runValue(word) {
        var val = '';
        switch (word.charAt(0)) {
            case '+':
            case "-":
            case '*':
            case '/':
            case '(':
            case ')':
            case "'":
            case '"':
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                val += word;
                break;
            case '|'://内部用，不开放
                val += '+';
                break;
            case ','://内部用，不开放
                val += ',';
                break;
            case '#'://外部变量
                val += word.substring(1);
                break;
            default :
                val += "my.util.getValue('" + word + "',vo)";
                break;
        }

        return val === '' ? "''" : val;
    }

    /**
     * 拆分单词
     * @param word
     * @returns {Array}
     */
    function splitWord(word) {
        var arr = [], key = '', end = 0, value;
        for (var i = 0; i < word.length; i++) {
            value = word.charAt(i);
            switch (value) {
                case '|':
                case ',':
                case '+':
                case '-':
                case '*':
                case '/':
                    if (key !== '') {
                        arr.push(key);
                        key = '';
                    }
                    arr.push(value);
                    break;
                case '"':
                case "'":
                    if (key !== '') {
                        arr.push(key);
                        key = '';
                    }
                    end = getEnd(word, i, value);
                    if (end > 0) {
                        arr.push(word.substring(i, end + 1));
                        i = end;
                    }
                    break;
                default :
                    if (value && value !== ' ') {
                        key += value;
                    }
                    break;
            }
        }
        if (key !== '') {
            arr.push(key);
        }
        return arr;
    }

    /**
     * 根据单词开始取结尾,
     * @param word
     * @param i
     * @param ec
     * @returns {*}
     */
    function getEnd(word, i, ec) {
        for (var j = i + 1; j < word.length; j++) {
            if (word.charAt(j) == ec) {//找到结尾
                return j;
            } else if (word.charAt(j) == '"' || word.charAt(j) == "'") {
                i = getEnd(word, j, word.charAt(j));
                if (i === 0) {
                    return 0;
                } else {
                    j = i;
                }
            }
        }
        return 0;
    }

    //语法缓存
    r.syntax.cache = {};
    /**
     * 返回绑定函数
     * @param name
     * @param html
     * @returns {*}
     */
    r.syntax.buildFunc = function (name, html) {
        var tpl;
        try {
            tpl = decodeURIComponent(html);
        } catch (e) {
            tpl = html;
        }
        tpl = r.util.trim(tpl);
        if (tpl.length > 0) {
            var funcBody = 'return ' + runTemplate(tpl) + ';';
            try {
                /* jshint ignore:start */
                return new Function('my', 'vo', funcBody);
                /* jshint ignore:end */
            } catch (e) {
                console.log('解析模板' + name + '出错，' + e.message);
                console.log(funcBody);
            }
        }
        return false;
    };

    /**
     * 返回有缓存的方法
     * @param type 类型
     * @param id 标识
     * @param html 模板内容
     * @returns {*}
     */
    r.syntax.cacheFunc = function (type, id, html) {
        var f = this.cache[type + '-func-' + id];
        var re = {func: f};
        if (!f) {
            f = this.buildFunc(id, html);
            if (f) {
                this.cache[type + '-func-' + id] = f;
                re.isFirst = true;
                re.func = f;
            }
        }
        return re;
    };
})(window.jsRender);;/**
 * JsTemplate 所有的扩展函数集合，用于处理html中常见的格式转换，默认值等处理。
 * 如果需要自行扩展，请使用window.Render的addFunc函数
 *
 * @class Render.funcs
 */
(function (r, undefined) {
    'use strict';
    /**
     * 指定输出的默认值，如果有值就原样输出，如果空或是null，就输出默认值。
     *
     * 示例：
     *
     *     {name|default,'小明'}
     *
     * @method default
     * @param val {string} 变量名
     * @param defaultVal 默认值
     * @returns {object}
     */
    r.addFunc('default', function (val, defaultVal) {
        if (val === undefined || typeof(val) == 'undefined' || val === '' || val === 'null') {
            return defaultVal;
        }
        return val;
    });
    /**
     * 判断变量是否为空。
     *
     * 示例：
     *
     *     {name|empty,'空','不空'}
     *
     * @method default
     * @param val {string} 变量名
     * @param emptyValue 为空时显示值
     * @param notEmptyValue 不为空时显示的值
     * @returns {object}
     */
    r.addFunc('empty', function (val, emptyValue, notEmptyValue) {
        if (val === undefined || typeof(val) == 'undefined' || val === '' || val === 'null') {
            return emptyValue;
        } else {
            return notEmptyValue;
        }
    });

    /**
     * 根据设定值返回指定内容
     *
     * 示例：
     *
     *     {status|case,-1,'审核不通过',1,'审核通过','待审核'}
     *     {status|case,-1,'审核不通过',1,'审核通过',2,'VIP','待审核'}
     *
     * 参数说明：参数成对出现，第一个是设定值，第二是要返回的值；后续可以增加多个成队的参数；最后一个参数为默认值，所有设定值都不满足时输出
     * @method case
     * @param val {string} 变量名
     * @returns {object}
     */
    r.addFunc('case', function (val) {
        for (var i = 1; i < arguments.length; i += 2) {
            if (val == arguments[i] && i < arguments.length - 1) {
                return arguments[i + 1];
            }
        }
        return arguments[arguments.length - 1];
    });
    /**
     * 格式化货币，最少小数显示，
     * 示例：
     *
     *     {price|format_money}
     *     如果price为10.0100，显示10.01
     *     如果price为10.000，显示10
     *
     * @method format_money
     * @param val {string} 变量名
     * @returns {number}
     */
    r.addFunc('format_money', function (val) {
        return parseFloat(val);
    });


    /**
     * 将 Date 转化为指定格式的String
     * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * 示例：
     *
     *     {date|format_date,"yyyy-MM-dd hh:mm:ss.S"}   输出  2006-07-02 08:09:04.423
     *     {date|format_date,"yyyy-M-d h:m:s.S"}    输出  2006-7-2 8:9:4.18
     *     {date|format_date,"yyyy-M-d h:m:s"}    输出  2006-7-2 8:9:4
     *
     * @method format_date
     * @param val {string} 变量名
     * @param fmt {string} 格式串
     * @returns {string} 格式化后的日期串
     */
    r.addFunc('format_date', function (val, fmt) {
        if (typeof(val) != 'object') {
            val = new Date(parseInt(val));
        }
        if (!fmt) {
            fmt = 'yyyy-MM-dd hh:mm:ss';
        }
        var format_data_o = {
            "M+": val.getMonth() + 1,                 //月份
            "d+": val.getDate(),                    //日
            "h+": val.getHours(),                   //小时
            "m+": val.getMinutes(),                 //分
            "s+": val.getSeconds(),                 //秒
            "q+": Math.floor((val.getMonth() + 3) / 3), //季度
            "S": val.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (val.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in format_data_o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (format_data_o[k]) : (("00" + format_data_o[k]).substr(("" + format_data_o[k]).length)));
        return fmt;

    });
    /**
     * 数字保留小数位数
     * 示例：
     *
     *     {float_num|fixed,2}
     *
     * @method fixed
     * @param val {string} 要格式的变量名
     * @param c {number} 保留的小数位置，默认为0
     * @returns {number}
     */
    r.addFunc('fixed', function (val, c) {
        if (typeof c == 'undefined') {
            c = 0;
        }
        if (typeof(val) == 'number') {
            return val.toFixed(c);
        } else {
            return val;
        }
    });
    /**
     * 没有正确的函数处理时，用此函数处理，直接输出变量值
     * 外部不要使用
     * @param val {string} 变量名
     * @returns {string}
     */
    r.addFunc('noFunc', function () {
        return '没有找到正确的处理函数';
    });
    /**
     * 重复输出num次val
     *
     * 示例：
     *
     *     {num|repeat,'*'}，当num=4时，输出****
     *
     * @method repeat
     * @param val {string} 重复次数
     * @param res {string}要重复的内容
     * @returns {string}
     */
    r.addFunc('repeat', function (val, res) {
        var result = '';
        for (var i = 0; i < val; i++) {
            result += res;
        }
        return result;
    });
    /**
     * 内部实现简单的循环，注意，内部模板和普通模板有区别，需要使用小括号代替大扩号。
     * 常用于嵌套循环显示。
     *
     * 示例：
     *
     *      {array|range,'(id),'}，如果array=[{id:0},{id:1}]，会输出0,1,
     *
     * @method range
     * @param list {string} 要循环的数组变量名
     * @param tmpl {string} 模板
     * @returns {string} 输出的html
     */
    r.addFunc('range', function (list, tmpl) {
        var html = '';
        if (tmpl) {
            tmpl = tmpl.replace(/\(/g, '{').replace(/\)/g, '}');
            var func = r.syntax.buildFunc('range', tmpl);
            if (func) {
                for (var i = 0; i < list.length; i++) {
                    html += func(r, list[i]);
                }
            }
        }
        return html;
    });
    /**
     * 过滤html字符，因为系统默认已过滤html，所以此函数一般外部不使用
     *
     * 示例：
     *
     *     {code|filter_html}
     *
     * @method filter_html
     * @param html {string} 待过滤的html代码
     * @returns {string}
     */
    r.addFunc('filter_html', function (html) {
        return r.util.html(html);
    });
    /**
     * 从左侧按指定长度截断字串，注意一个汉字按2个字符计算，这样可以准确的控制格式
     *
     * 示例：
     *
     *     {str|left,20,'...'}
     *     {str|left,20}
     *
     * @method left
     * @param str {string} 要截断的字串变量名
     * @param len {number} 截断后的字串长度，一个汉字按2个字符计算
     * @param dot {string} [可选] 截断后补充的串，示例:"..."
     * @returns {string}
     */
    r.addFunc('left', function (str, len, dot) {
        var newLength = 0;
        var newStr = "";
        var chineseRegex = /[^\x00-\xff]/g;
        var singleChar = "";
        var dotLen = 0;
        if (dot) {
            dotLen = dot.length;
        }
        var strLength = str.replace(chineseRegex, "**").length;
        for (var i = 0; i < strLength; i++) {
            singleChar = str.charAt(i).toString();
            if (singleChar.match(chineseRegex) !== null) {
                newLength += 2;
            } else {
                newLength++;
            }
            if (newLength + dotLen > len) {
                if (dotLen > 0) {
                    newStr += dot;
                }
                break;
            }
            newStr += singleChar;
        }
        return newStr;
    });
})(window.jsRender);;/**
 * JsTemplate，简单快速的将json数据绑定到html上
 * @class JsTemplate
 */
(function (d, w, x, r) {
    'use strict';
    //是否已初始化
    x.isInit = false;
    //是否使用其它的ajax方法，默认使用jquery
    x.optAjax = false;
    x.hideRepeat = false;
    x.hideBind = false;
    //准备方法，JsTemplate的入口方法，JsTemplate准备好后将执行这个方法，以便自动执行一些绑定函数等。
    x.ready = function (callback) {
        if (!x.isInit) {
            if (typeof callback === 'function') {
                x.callback = callback;
            }
        } else {
            if (typeof callback === 'function') {
                x.callback = callback;
                x.callback();
            }
        }
    };
    /**
     * 初始化
     */
    x.init = function () {

        if (!x.isInit) {
            x.isInit = true;
            r.init();
            if (x.callback) {
                x.callback();
            }
        }
    };
    /**
     * 取url的参数，并可以指定默认值
     *
     * 示例：
     *
     * 1. query('id')，取url参数中的id的值
     * 2. query('id',10)，取url参数中的id的值，如果id为空值，就返回默认值10
     *
     * @method query
     * @param key {string} 参数名
     * @param defaultValue [可选] 默认值
     */
    x.query = function (key, defaultValue) {
        if (!w.query_args) {
            w.query_args = r.util.getUrlQuery();
        }
        var tmp = w.query_args[key];
        if (typeof tmp == 'undefined' || tmp === '') {
            return defaultValue;
        }
        return tmp;
    };

    /**
     * 将Render.util工具函数集合引入JsTemplate，方便后续使用。具体内容见{{#crossLink "Render.util"}}{{/crossLink}}。
     * @property util
     * @type {Object}
     */
    x.util = r.util;
    /**
     * 使用ajax加载数据，可选的绑定到页面。
     * 支持2类数据，Object和Array。
     *
     * Object为简单绑定，页面中在需要绑定数据的地方用data-bind指定属性名。
     * 当绑定id为空串时，在绑定时直接使用属性名，例：{key:'key1'}，绑定时只需key即可。
     *
     * 示例：
     *
     *     <p data-bind='key'></p>
     *
     * 当指定绑定id时，在绑定时需要在属性名前加上指定的名称，例：{key:'key1'}，名称为data1,绑定时需data1.key
     *
     * 示例：
     *
     *     <p data-bind='data1.key'></p>
     *
     *
     * Array为循环绑定，常用于输出列表，页面中用data-repeat-name指定绑定名。
     * 在使用data-repeat-name后，该节点内部的html内容将成为模板，循环绑定后显示。
     *
     * 示例：
     *
     *     <ul data-repeat-name='data'>
     *         <li>{key}</li>
     *     </ul>
     *
     * 如果Array的内容为[{key:'key1'},{key:'key2'},{key:'key3'}]，输出内容为
     *
     *     <ul data-repeat-name='data'>
     *         <li>key1</li>
     *         <li>key2</li>
     *         <li>key3</li>
     *     </ul>
     *
     * @method load
     * @param  id {string} 绑定id，在html页面中指定
     * @param  postUrl {string} url地址，该地址返回一段json数据
     * @param param 请求的参数，可为空。如果为空是自动使用当前页面地址的query参数
     *
     * 示例：如果当前页面的地址为show.html?id=132，param为''时，系统会将param修改为{id:132}，内容与当前页的参数一致。
     *
     * @param dataFilter {Function} 数据过滤方法，如果请求的数据正常，就返回可以绑定的数据；如果返回false，将不执行绑定。
     *
     * 示例：其中e为从postUrl中取得的json数据
     *
     *     function(e){
     *        if(e.error==0){
     *            return e.data;
     *        }else{
     *            return false;
     *        }
     *     }
     *
     * @param callback {Function} [可选] 请求成功的回调方法
     *
     * 示例：其中e为从postUrl中取得的json数据
     *
     *      function(e){
     *          alert('ok');
     *      }
     *
     * @param errorback {Function} [可选] 请求失败的回调方法
     *
     * 示例：
     *
     *     function(){
     *          alert('error');
     *     }
     *
     */
    x.load = function (id, postUrl, param, dataFilter, callback, errorback) {
        var opt = {};
        opt.url = postUrl;
        if (param === '' || typeof param == 'undefined') {
            param = r.util.getUrlQuery();
        }
        opt.data = param;
        opt.type = 'POST';
        if (errorback) {
            opt.error = errorback;
        } else if (typeof x.error_callback === 'function') {
            opt.error = x.error_callback;
        } else {
            opt.error = function (data, status) {
                console.log(data, status);
            };
        }
        opt.success = function (data) {
            if (typeof data === 'string') {
                data = r.util.eval('(' + data + ')');
            }
            var ok = !!data;
            if (typeof x.checkData === 'function') {
                if (!x.checkData(data)) {
                    ok = false;
                }
            }
            if (ok && dataFilter) {
                data = dataFilter(data);
                if (!data) {
                    ok = false;
                }
            }
            if (ok) {
                if (r.util.isArray(data)) {
                    r.bindRepeatData(id, data);
                } else {
                    if (id) {
                        r.bindData(id, data);
                    } else {
                        r.bindData(data);
                    }
                }
            }
            if (callback) {
                callback(ok, data);
            }
        };
        if (x.isInit) {
            if (x.optAjax) {
                x.optAjax.ajax(opt);
            } else {
                $.ajax(opt);
            }
        }
    };
    /**
     * 设置ajax类，默认为jQuery
     * @method setAjax
     * @param ajax ajax工具类
     */
    x.setAjax = function (ajax) {
        this.optAjax = ajax;
    };
    var testReady = function () {
        if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
            x.init();
            return true;
        }
        return false;
    };
    var timeReady = function () {
        if (!testReady()) {
            setTimeout(timeReady, 5);
        }
    };
    //开始初始化将执行ready方法
    if (!testReady()) {
        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', function () {
                testReady();
            }, false);
        } else {
            setTimeout(timeReady, 5);
        }
    }
})(document, window, window.jsTemplate = {}, window.jsRender);;/**
 * 使用jQuery来兼容ie8以下
 */
(function (util) {
    'use strict';
    if (!document.querySelectorAll) {
        util.querySelectorAll  = function (q) {
            var item = $(q), re = [];
            item.each(function (i, e) {
                re.push(e);
            });
            return re;
        }
    }
    /*
     * String ES5 extend
     */
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }
})(window.jsRender.util);;/**
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
}(window.jsTemplate, window.jsRender, window.app = {}));;/**
 * app的工具函数集合
 * @class app.util
 */
(function (util, xt_util, undefined) {
    //将xt的util导入
    for (var f in xt_util) {
        if(xt_util.hasOwnProperty(f)) {
            util[f] = xt_util[f];
        }
    }
    /**
     * 在指定对象平级附加一个对象
     * @method setValue
     * @param newEl
     * @param targetEl
     */
    util.insertAfter = function (newEl, targetEl) {
        var parentEl = targetEl.parentNode;
        if (!parentEl) {
            return;
        }
        if (parentEl.lastChild == targetEl) {
            parentEl.appendChild(newEl);
        } else {
            parentEl.insertBefore(newEl, targetEl.nextSibling);
        }
    };


    /**
     * 给指定dom设置值
     *
     * 示例：
     *
     *     setValue('#username','jake')
     *     setValue('.username','jake')
     *     setValue('p','jake')
     *
     * @method setValue
     * @param selecter 选择器 可以是#id|.className|p|[attribute]|[attribute=value]等等，详见css选择器
     * @param value
     */
    util.setValue = function (selecter, value) {
        if (util.isPlainObject(value)) {
            value = JSON.stringify(value);
        }
        util.each(xt_util.querySelectorAll(selecter), function (i, ele) {
            switch (ele.tagName) {
                case 'IMG':
                    ele.src = value;
                    break;
                case 'INPUT':
                    ele.value = value;
                    break;
                default:
                    if (typeof ele.innerText != 'undefined') {
                        ele.innerText = value;
                    } else {
                        ele.value = value;
                    }
                    break;
            }
        }, true);
    };
    /**
     * 设置指定目标不可用
     * @method setDisabled
     * @param selector {string} 选择器 可以是#id或是.className，详见css选择器
     * @param truefalse {boolean} 是否可用，默认为true
     */
    util.setDisabled = function (selector, truefalse) {
        if (truefalse === undefined) {
            truefalse = true;
        }
        util.each(xt_util.querySelectorAll(selector), function (i, ele) {
            ele.disabled = truefalse;
        }, true);
    };
    /**
     * 设置指定目标是否隐藏
     * @method setHide
     * @param selector {string} 选择器 可以是#id或是.className，详见css选择器
     * @param truefalse {boolean} 是否可用，默认为true
     */
    util.setHide = function (selector, truefalse) {
        if (truefalse === undefined) {
            truefalse = true;
        }
        util.each(xt_util.querySelectorAll(selector), function (i, ele) {
            if (truefalse) {
                if (ele.style.display != 'none') {
                    ele.style.display = 'none';
                }
            } else {
                if (ele.style.display == 'none') {
                    ele.style.display = '';
                }
                xt_util.removeClass(ele, 'hide');
            }
        }, true);
    };
    /**
     * 定时回调，在指定时间内，每秒回调1次，主要用于读秒更新。
     *
     * 示例：
     *
     *     timedCallback(60,function(s){
     *         $('#tip').text(s+'秒后开始');
     *     });
     *
     * @method timedCallback
     * @param seconds {number} 秒
     * @param callback {function} 每秒的回调
     */
    util.timedCallback = function (seconds, callback) {
        if (callback) {
            if (callback(seconds) === true) {
                seconds = 0;
            }
        }
        seconds--;
        if (seconds >= 0) {
            setTimeout(function () {
                util.timedCallback(seconds, callback);
            }, 1000);
        }
    };
    /**
     * 循环处理
     *
     * 示例：
     *
     *     app.util.each([1,2,3],function(i,a){});
     *
     *
     * @method each
     * @param object {Array|object} 要循环的对象
     * @param callback {function} 处理的函数
     * @returns {*}
     */
    util.each = function (object, callback) {
        if (!object||!callback) {
            return;
        }
        var name, i = 0,
            length = object.length,
            isObj = length === undefined || typeof (object) == 'function';
        if (isObj) {
            for (name in object) {
                if (callback.call(object[name], name, object[name]) === false) {
                    break;
                }
            }
        } else {
            for (; i < length;) {
                if (callback.call(object[i], i, object[i++]) === false) {
                    break;
                }
            }
        }
        return object;
    };


    /**
     * 判断类型是否是Array
     * @method isArray
     * @param object 要判断的对象
     * @returns {boolean}
     */
    util.isArray = Array.isArray || function (object) {
        return object instanceof Array;
    };


    // Copy all but undefined properties from one or more
    // objects to the `target` object.
    util.extend = function (target) {
        var i, k, obj;
        for (i = 1; i < arguments.length; i++) {
            obj = arguments[i];
            if (util.isPlainObject(obj)) {
                for (k in obj) {
                    if (obj[k] !== null && obj[k] !== undefined) {
                        target[k] = obj[k];
                    }
                }
            }
        }
        return target;
    };
    /**
     * 是否是一个简单的对象
     * @method isPlainObject
     * @param value 目标对象
     * @returns {boolean}
     */
    util.isPlainObject = function (value) {
        return !!value && Object.prototype.toString.call(value) === '[object Object]';
    };
    /**
     * 打印日志信息
     * @method log
     * @param args {...} 多个参数
     */
    util.log = function () {
        if (app.debug) {
            for (var i in arguments) {
                console.log(JSON.stringify(arguments[i]));
            }
        }
    };
    /**
     * 取url的参数，并可以指定默认值
     *
     * 示例：
     *
     * 1. query('id')，取url参数中的id的值
     * 2. query('id',10)，取url参数中的id的值，如果id为空值，就返回默认值10
     *
     * @method query
     * @param key {string} 参数名
     * @param defaultValue [可选] 默认值
     */
    util.query = function (key, defaultValue) {
        if (!util.query_args) {
            util.query_args = xt_util.getUrlQuery();
        }
        var tmp = util.query_args[key];
        if (typeof tmp == 'undefined' || tmp === '') {
            return defaultValue;
        }
        return tmp;
    };
    /**
     * 权限一个串生成hash值
     * @param str
     * @returns {number}
     */
    util.hash = function (str) {
        var hash = 0, char;
        if (str.length === 0) return hash;
        for (var i = 0; i < str.length; i++) {
            char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    };
    /**
     * 计算表达式的值
     * @param fn
     * @returns {*}
     */
    util.eval=function(fn) {
        var Fn = Function; //一个变量指向Function，防止有些前端编译工具报错
        return new Fn('return ' + fn)();
    };
})(window.app.util = {}, window.jsTemplate.util);;/**
 * cookie 通过处理类
 */
(function (document) {

    var cookie = function () {
        return cookie.get.apply(cookie, arguments);
    };

    var utils = cookie.utils = {
        // Unlike JavaScript's built-in escape functions, this method
        // only escapes characters that are not allowed in cookies.
        encode: function (value) {
            return String(value).replace(/[,;"\\=\s%]/g, function (character) {
                return encodeURIComponent(character);
            });
        },

        decode: function (value) {
            return decodeURIComponent(value);
        }
    };
    cookie.expiresMultiplier = 60 * 60 * 24;

    cookie.set = function (key, value, expires) {
        expires = new Date(new Date() + 1000 * this.expiresMultiplier * expires); // This is needed because IE does not support the `max-age` cookie attribute.

        if (expires !== '' && 'toGMTString' in expires) expires = ';expires=' + expires.toGMTString();

        document.cookie = utils.encode(key) + '=' + utils.encode(value) + expires;


        return this; // Return the `cookie` object to make chaining possible.
    };

    cookie.remove = function (keys) {
        this.set(keys, '', -1);
        return this; // Return the `cookie` object to make chaining possible.
    };


    cookie.get = function (keys) {
        var cookies = this.all();
        return cookies[keys];
    };

    cookie.all = function () {
        if (document.cookie === '') return {};

        var cookies = document.cookie.split('; '),
            result = {};

        for (var i = 0, l = cookies.length; i < l; i++) {
            var item = cookies[i].split('=');
            var key = utils.decode(item.shift());
            var value = utils.decode(item.join('='));
            result[key] = value;
        }

        return result;
    };
    // If an AMD loader is present use AMD.
    // If a CommonJS loader is present use CommonJS.
    // Otherwise assign the `cookie` object to the global scope.

    if (typeof define === 'function' && define.amd) {
        define(function () {
            return cookie;
        });
    } else window.cookie = cookie;
// If used e.g. with Browserify and CommonJS, document is not declared.
})(document);
;/**
 * jsonp的实现类
 * @class jsonp
 */
(function (app, service, util, undefined) {
    service.request = {};//json的请求

    /**
     * 一个空函数
     */
    service.noop = function () {
    };

    var serialize = function (params, obj, traditional, scope) {
        var array = util.isArray(obj),
            hash = util.isPlainObject(obj);
        util.each(obj, function (key, value) {
            if (scope) {
                key = traditional ? scope :
                scope + '[' + (hash || util.isPlainObject(value) || util.isArray(value) ? key : '') + ']';
            }
            // handle data in serializeArray() format
            if (!scope && array) {
                params.add(value.name, value.value);
            }
            // recurse into nested objects
            else if (util.isArray(value) || (!traditional && util.isPlainObject(value))) {
                serialize(params, value, traditional, key);
            } else {
                params.add(key, value);
            }
        });
    };
    var serializeData = function (options) {
        if (options.data && typeof options.data !== "string") {
            options.data = service.param(options.data, options.traditional);
        }
        options.url = appendQuery(options.url, options.data);
        options.data = undefined;
    };
    var appendQuery = function (url, query) {
        if (query === '') {
            return url;
        }
        return (url + '&' + query).replace(/[&?]{1,2}/, '?');
    };

    /**
     * 常用的ajax参数，只支持常用
     * @type {{type: string, success: function, error: function, complete: function, context: null, xhr: Function, accepts: {script: string, json: string, xml: string, html: string, text: string}, timeout: number, processData: boolean, cache: boolean}}
     */
    service.ajaxSettings = {
        success: service.noop,
        error: service.noop,
        complete: service.noop,
        context: null,
        timeout: 0,
        id: 0
    };

    var ajaxSuccess = function (data, settings) {
        if (settings.success) {
            settings.success.call(settings.context, data, 'success');
        }
        ajaxComplete('success', settings);
    };
    // type: "timeout", "error", "abort", "parsererror"
    var ajaxError = function (error, type, settings) {
        if (settings.error) {
            settings.error.call(settings.context, type, error);
        }
        ajaxComplete(type, settings);
    };
    // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
    var ajaxComplete = function (status, settings) {
        if (settings.complete) {
            settings.complete.call(settings.context, status);
        }
    };
    service.param = function (obj, traditional) {
        var params = [];
        params.add = function (k, v) {
            if (typeof v === 'string' || typeof v === 'boolean' || typeof v === 'number') {
                this.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
            }
        };
        serialize(params, obj, traditional);
        return params.join('&').replace(/%20/g, '+');
    };
    /**
     * 使用ajax请求数据，使用方法和jquery类似
     *
     * @method ajax
     * @param url {string} [可选] 请求的远程地址
     * @param options ajax请求的详细参数，可以为空，但url和options必须有一个参数
     */
    service.ajax = function (url, options) {
        if (typeof url === "object") {
            options = url;
            url = undefined;
        }
        var settings = options || {};

        settings.url = url || settings.url;
        for (var key in service.ajaxSettings) {
            if (settings[key] === undefined) {
                settings[key] = service.ajaxSettings[key];
            }
        }
        settings.id = util.hash(settings.url);
        if (!settings.data) {
            settings.data = {};
        }
        settings.data.jsonp_callback_id = settings.id;
        settings.data.jsonp_callback = 'app.jsonp.callback';
        serializeData(settings);

        settings.url = appendQuery(settings.url, '_=' + (new Date().getTime()));

        settings.timeout = 30000;


        if (settings.timeout > 0) {
            setTimeout(function () {
                delete(service.request[settings.id]);
                var js = document.getElementById(settings.id);
                if (js) {
                    document.body.removeChild(js);
                }
                ajaxError(null, 'timeout', this, settings);
            }, settings.timeout);
        }
        //把当前请求记录，不重复请求
        if (!service.request[settings.id]) {
            service.request[settings.id] = options;
            var script = document.createElement('script');
            script.id = settings.id;
            script.src = settings.url;
            document.body.appendChild(script);
        }
    };
    service.callback = function (id, data) {
        var settings = service.request[id];
        if (settings) {
            ajaxSuccess(data, settings);
            delete(service.request[id]);
            var js = document.getElementById(id);
            if (js) {
                document.body.removeChild(js);
            }
        }
    };
    service.get = function (url, param, callback, errorback) {
        if (!app.util.isPlainObject(param)) {
            param = {};
        }
        var opt = {};
        opt.url = url;
        opt.data = param;
        /**
         * 这里出错说明网络访问有问题
         * @param data
         */
        opt.error = function (data) {
            app.util.log('请求' + url + '错误，jsonp语法未成功。');

            if (!app.disableError) {
                data = {};
                data.error = '网络访问出错，请稍后再试。';
                data.reset = true;
                if (typeof errorback === 'function') {
                    errorback(data);
                } else {
                    app.error(data);
                }
            }
        };
        /**
         * 访问成功
         * @param data
         */
        opt.success = function (data) {
            if (typeof data == 'string' && data !== '') {
                data = util.eval('(' + data + ')');
            }
            if (data && (!data.error || data.error === 0 || data.error === '0')) {
                if (callback) {
                    callback(data);
                }
            } else {
                if (typeof errorback === 'function') {
                    errorback(data);
                } else {
                    app.error(data);
                }
            }
        };
        service.ajax(opt);
    };
})(window.app, window.app.jsonp = {}, window.app.util);

;/**
 * 处理常规的http请求
 * @class app.http
 */
(function (app, util, service) {
    /**
     * 是否允许失败后再次请求数据
     * @property enableRetry
     * @type {boolean}
     * @default true
     */
    service.enableRetry = true;
    /**
     * 请求数据，同时使用通用的处理方式处理数据错误。如果指定的错误的处理方式，就用指定的方式。
     * 请求返回的必须json格式数据，如果为文本，会自动强转为json
     *
     * 示例：
     *
     *     app.http.post('http://www.seefan.net/api/getNews',{"id":1},function(data){
     *         console.log(data);
     *     });
     *
     * @method post
     * @param url {string} 请求的地址
     * @param param 附加的参数
     * @param callback {function} 请求成功的回调参数，可以为空
     * @param errorback {function} 失败的回调参数，可以为空。如果为空使用默认的错误处理
     * @param second {object} 失败的回调参数，可以为空。如果为空使用默认的错误处理
     */
    service.post = function (url, param, callback, errorback, second) {
        if (app.optAjax === false) {
            app.error('没有配置ajax执行类');
            return;
        }
        if (!app.util.isPlainObject(param)) {
            param = {};
        }


        var opt = {};

        opt.url = url;
        opt.type = 'POST';
        opt.dataType = 'json';
        opt.data = param;
        /**
         * 这里出错说明网络访问有问题
         * @param data
         */
        opt.error = function (data) {
            app.util.log('请求' + url + '错误，问题是：' + data.statusText + "，状态：" + data.status + '，返回：' + data.responseText);
            if (second === true) {
                    data = {};
                    data.error = '网络访问出错，请稍后再试。';
                    data.reset = true;
                    if (typeof errorback === 'function') {
                        errorback(data);
                    } else {
                        if (!app.disableError) {
                            app.error(data);
                        }
                    }
            } else if (service.enableRetry) {
                service.post(url, param, callback, errorback, true);
            }
        };
        /**
         * 访问成功
         * @param data
         */
        opt.success = function (data) {
            if (typeof data == 'string' && data !== '') {
                data = util.eval('(' + data + ')');
            }
            if (data && (!data.error || data.error === 0 || data.error === '0')) {
                if (callback) {
                    callback(data);
                }
            } else {
                if (typeof errorback === 'function') {
                    errorback(data);
                } else {
                    app.error(data);
                }
            }
        };
        app.optAjax.ajax(opt);
    };
})
(window.app,window.app.util, window.app.http = {});;/**
 * 字串验证类
 * 验证规则优先级
 *
 *     required，可以和任何规则一起一起使用
 *     pattern，使用后，除required外，其它都失效
 *     data-validate，当没有pattern时有效，使用后除required外，其它都失效
 *     基于input的type属性验证为最低级别
 *
 * 计划支持如下type
 *
 *     date
 *     datetime
 *     month
 *     week
 *     time
 *     email：邮件地址
 *     number
 *     tel：电话号码
 *     url：网址
 *
 * @class validate
 */
(function (v) {
    /**
     * 验证规则
     * @param rules {object} 规则集合
     * @param strs {Array}待验证的字符串数组
     * @return {boolean|string} 验证是否通过，如果返回字符串，说明是required单独定义的错误信息
     */
    v.validate = function (rules, strs) {
        if (!rules.hasRule) {
            return true;
        }
        var hasValue = false, i = 0;
        for (; i < strs.length; i++) {
            if (strs[i] !== '') {
                hasValue = true;
                break;
            }
        }

        if (!hasValue) {
            if (this.hasRequired(rules)) {
                if (rules.required !== '') {
                    return rules.required;
                } else if (rules.valtext !== '') {
                    return rules.valtext;
                } else {
                    return false;
                }
            }
        }
        if (hasValue) {
            for (var rule in  rules) {
                if (rule !== 'required') {//required已经验证过
                    if (!this.validateItem(rule, rules[rule], strs)) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    /**
     * 验证规则
     * @param rule {string}
     * @param ruleOption {string}
     * @param strs {Array}
     */
    v.validateItem = function (rule, ruleOption, strs) {
        for (var i = 0; i < strs.length; i++) {
            if (this.rule[rule] && !this.rule[rule](strs[i], ruleOption)) {
                return false;
            }
        }
        return true;
    };
    /**
     * 是否有required要求
     * @param rules {object} 规则集合
     */
    v.hasRequired = function (rules) {
        return rules.hasOwnProperty('required');
    };
    /**
     * 验证规则
     * @type {object}
     */
    v.rule = {};

    /**
     * 正则验证，使用本验证后，基本type的验证失效
     *
     * 示例：
     *
     *     <input type="text" pattern="/\d+/" >
     *
     *
     * @param str
     * @param rule
     * @returns {boolean}
     */
    v.rule.pattern = function (str, rule) {
        var reg = new RegExp(rule, 'g');
        return (reg.test(str));
    };
    //email
    /**
     * 验证email的地址
     *
     * 示例：
     *
     *     <input type="email" >
     *
     * @property rule.email
     * @param str {string} 待验证串
     * @returns {boolean}
     */
    v.rule.email = function (str) {
        return v.regex.email.test(str);
    };
    //url
    /**
     * 验证网址，这个是html自带的验证
     *
     * 示例：
     *
     *     <input type="url" >
     *
     * @property rule.url
     * @param str {string} 待验证串
     * @returns {boolean}
     */
    v.rule.url = function (str) {
        return v.regex.url.test(str);
    };

    /**
     * 电话验证
     * @param str
     * @returns {boolean}
     */
    v.rule.tel = function (str) {
        return v.regex.tel.test(str);
    };
    /**
     * 两个字段值相同难
     * @param str
     * @param rule
     * @returns {boolean}
     */
    v.rule.confirm = function (str, rule) {
        return str == rule;
    };
    /**
     * 扩展验证
     * 已支持
     *
     *     mobile：手机号验证
     *
     * 示例：
     *
     *     <input type="text" data-validate="mobile">
     *
     * @property  rule.data-validate
     * @param str 要验证的内容
     * @param rule 规则
     * @returns {boolean}
     */
    v.rule['data-validate'] = function (str, rule) {
        if (v.regex[rule]) {
            return v.regex[rule].test(str);
        }
        return true;
    };
    /**
     * 常用正则表达式
     */
    v.regex = {};
    //email
    v.regex.email = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    //手机
    v.regex.mobile = /^1[34578]{1}\d{9}$/;
    //网址
    v.regex.url = /[a-zA-z]+:\/\/[^\s]*/;
    //电话
    v.regex.tel = /\d+/;

//    1 Email地址：^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$
//    2 域名：[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(/.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+/.?
//    3 InternetURL：[a-zA-z]+://[^\s]* 或 ^http://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?$
//    4 手机号码：^1[34578]{1}\d{9}$
//    7 身份证号^(\d{18,18}|\d{15,15}|\d{17,17}x)$
//    12 日期格式：^\d{4}-\d{1,2}-\d{1,2}
//    13 一年的12个月(01～09和1～12)：^(0?[1-9]|1[0-2])$
//    14 一个月的31天(01～09和1～31)：^((0?[1-9])|((1|2)[0-9])|30|31)$
//    26 中文字符的正则表达式：[\u4e00-\u9fa5]
//    32 中国邮政编码：[1-9]\d{5}(?!\d)    (中国邮政编码为6位数字)
//    33 IP地址：\d+\.\d+\.\d+\.\d+    (提取IP地址时有用)
})(window.Validate = {});;/**
 * 处理表单内容，用于数据传送
 * @class app.form
 */
(function (service, va, util, undefined) {

    /**
     * 表单项

     *
     * @param name 表单项名
     * @constructor
     */
    function FormItem(name) {
        /**
         * 表单项名称
         */
        this.name = name;
        /**
         * 值
         * @type {Array}
         */
        this.values = [];
        /**
         * 验证规则
         */
        this.validateRule = {};
        /**
         * 验证串
         * @type {string}
         */
        this.valtext = '';

    }

    /**
     * 返回表单项的值
     *
     * @returns {*}
     */
    FormItem.prototype.getValue = function () {
        if (this.values.length == 1) {
            return this.values[0];
        } else {
            return this.values;
        }
    };
    /**
     * 验证表单项
     *
     * @returns {boolean|string}
     */
    FormItem.prototype.noValidate = function () {
        if (va) {
            var re = va.validate(this.validateRule, this.values);
            if (typeof re === 'string') {
                return re;
            } else if (!re) {
                return this.valtext;
            }
        }
        var chk = this.item;
        if (chk.attributes['error-to-parent'] && chk.parentElement) {
            chk = chk.parentElement;
        }
        util.removeClass(chk, 'has-error');
        return false;
    };
    /**
     * 显示一个错误提示
     */
    FormItem.prototype.showError = function (msg) {
        var chk = this.item;
        if (service.errorHtml !== '') {
            var errId = chk.name + '_error';
            var errObj = document.getElementById(errId);
            if (errObj) {
                errObj.innerHTML = msg;
            } else {
                var ele = document.createElement("span");
                ele.innerHTML = service.errorHtml;
                ele.children[0].innerHTML = msg;
                ele.children[0].id = errId;
                ele.children[0].name = errId;
                ele = ele.children[0];
                util.insertAfter(ele, chk);
            }
        }
        if (typeof chk.focus === 'function') {
            chk.focus();
        }
        if (chk.attributes['error-to-parent'] && chk.parentElement) {
            chk = chk.parentElement;
        }
        util.addClass(chk, 'has-error');
    };
    /**
     * 根据指定元素的名称或是id选取值
     * @method val
     * @param selector {string} 目标的id值或是名称，如果是id，需要在id前加#
     * @param valid {boolean} 是否执行验证，默认为false
     * @return {Array|string|undefined} 如果执行了验证，在验证不通过时会返回undefined
     */
    service.val = function (selector, valid) {
        if (typeof selector != 'string' || selector === '') {
            return;
        }
        var items;
        if (selector.substr(0, 1) == '#') {
            selector = selector.substr(1);
            items = [];
            var item = document.getElementById(selector);
            if (item) {
                items.push(item);
            }
        } else {
            items = document.getElementsByName(selector);
        }
        if (!items || items.length === 0) {
            return;
        }
        var values = this.getItemsValue(items);
        for (var k in values) {
            var value = values[k], msg;
            if (valid === true) {
                if ((msg = value.noValidate()) === false) {
                    return value.getValue();
                } else {
                    if (msg && service.isAlertError) {
                        app.error(msg);
                    }
                    value.showError(msg);
                    return undefined;//返回验证失败
                }
            } else {
                return value.getValue();
            }
        }
    };
    /**
     * 取一组表单项的值
     * @param items
     * @returns {object}
     */
    service.getItemsValue = function (items) {
        var forms = {}, item;
        for (var i = 0; i < items.length; i++) {
            item = items[i];
            if (!item.disabled && item.name) {
                var formitem;
                if (!forms[item.name]) {
                    formitem = new FormItem(item.name);
                    formitem.item = item;
                    forms[item.name] = formitem;
                } else {
                    formitem = forms[item.name];
                }
                if (item.tagName === 'INPUT') {//如果input内容，前提是非disabled，取value
                    if (item.type === 'radio' || item.type === 'checkbox') {
                        if (item.checked) {
                            formitem.values.push(item.value);
                        }
                    } else {
                        formitem.values.push(item.value);
                    }
                } else if (item.tagName === 'SELECT') {
                    if (item.selectedIndex >= 0 && item.options[item.selectedIndex].value) {
                        formitem.values.push(item.options[item.selectedIndex].value);
                    }
                } else {
                    formitem.values.push(item.value);
                }
                //取验证规则
                if (item.attributes.hasOwnProperty('valtext')) {
                    if (item.attributes.valtext.value !== '') {
                        formitem.valtext = item.attributes.valtext.value;
                    }
                } else {
                    if (item.attributes.hasOwnProperty('placeholder') && item.attributes.placeholder.value !== '') {
                        formitem.valtext = item.attributes.placeholder.value;
                    }
                }
                //required,pattern
                if (item.attributes.hasOwnProperty('required')) {
                    if (item.attributes.required.value === '') {
                        formitem.validateRule.required = formitem.valtext;
                    } else {
                        formitem.validateRule.required = item.attributes.required.value;
                    }
                    formitem.validateRule.hasRule = true;
                }
                //confirm
                if (item.attributes.hasOwnProperty('confirm')) {
                    formitem.validateRule.confirm = service.val(item.attributes.confirm.value);
                    formitem.validateRule.hasRule = true;
                }


                if (item.attributes.hasOwnProperty('pattern') && item.attributes.pattern.value !== '') {
                    formitem.validateRule.pattern = item.attributes.pattern.value;
                    formitem.validateRule.hasRule = true;
                } else if (item.attributes.hasOwnProperty('data-validate')) {
                    formitem.validateRule['data-validate'] = item.attributes['data-validate'].value;
                    formitem.validateRule.hasRule = true;
                } else {
                    //date	定义日期字段（带有 calendar 控件）
                    //datetime	定义日期字段（带有 calendar 和 time 控件）
                    //month	定义日期字段的月（带有 calendar 控件）
                    //week	定义日期字段的周（带有 calendar 控件）
                    //time	定义日期字段的时、分、秒（带有 time 控件）
                    //email	定义用于 e-mail 地址的文本字段
                    //                number	定义带有 spinner 控件的数字字段
                    //tel	定义用于电话号码的文本字段。
                    //url  定义用于 URL 的文本字段
                    if (item.tagName === 'INPUT') {
                        switch (item.type) {
                            case 'date':
                            case 'datetime':
                            case 'month':
                            case 'week':
                            case 'time':
                            case 'email':
                            case 'number':
                            case 'tel':
                            case 'url':
                                formitem.validateRule[item.type] = '';
                                formitem.validateRule.hasRule = true;
                                break;
                        }
                    }
                }

            }
        }
        return forms;
    };

    /**
     * 检查表单项
     * @method check
     * @param name {string|array|object} 表单的id或是表单元素名称的数组或是表单本身(this)
     * @return {boolean} 是否通过验证
     *
     * @example
     * app.form.check(this)
     **/
    service.check = function (name) {
        return service.getFormParam(name, true) !== undefined;
    };
    /**
     * 是否弹出错误信息
     * @property isAlertError
     * @type {boolean}
     * @default true
     */
    service.isAlertError = true;

    /**
     * 验证出错是追加到页面的html内容，追加到出错对象后面。
     * @property errorHtml
     * @type {string}
     */
    service.errorHtml = '';

    /**
     * 权限form的id取到form后，将表单内容转为参数，也可以将多个表单项一起取值
     * @method getFormParam
     * @param name {string|array|object} 表单的id或是表单元素名称的数组或是表单本身(this)
     * @param valid {boolean} 是否执行验证，默认为false
     * @return {Hash|undefined} 如果执行了验证，在验证不通过时会返回undefined
     */
    service.getFormParam = function (name, valid) {
        var param = {}, item, i = 0, v;
        if (util.isArray(name)) {//name的数组
            for (; i < name.length; i++) {
                v = this.val(name[i], valid);
                if (v === undefined) {
                    return;
                }
                param[name[i]] = v;
            }
            return param;
        }
        if (name === '') {
            return param;
        }
        //以下处理完整表单
        var form;
        if (typeof name === 'string') {
            form = document.getElementById(name);
        } else if (typeof name === 'object') {
            form = name;
        }
        if (!form) {
            return param;
        }
        var items = [];
        for (i = 0; i < form.length; i++) {
            items.push(form[i]);
        }
        var values = this.getItemsValue(items);
        for (var k in values) {
            var value = values[k], msg;
            if (valid === true) {
                if ((msg = value.noValidate()) === false) {
                    param[value.name] = value.getValue();
                } else {
                    if (msg && service.isAlertError) {
                        app.error(msg);
                    }
                    value.showError(msg);
                    return undefined;//返回验证失败
                }
            } else {
                param[value.name] = value.getValue();
            }
        }
        return param;
    };
})(window.app.form = {}, window.Validate, window.app.util);