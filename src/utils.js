/**
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
})(window.app.util = {}, window.jsTemplate.util);