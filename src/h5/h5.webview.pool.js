/**
 * Created by seefan on 15/10/12.
 * h5的webview的扩展，内部使用
 * @class app.webviewPool
 */
(function (pool, undefined) {
    /**
     * 缓存的内容
     * @type {Array}
     */
    pool.cache = [];
    /**
     * 取一个webview
     * @returns {webview}
     */
    pool.get = function () {
        for (var i in pool.cache) {
            if (pool.cache[i]['isActive'] != true && !pool.cache[i]['template']) {
                pool.cache[i]['isActived'] = true;
                return pool.cache[i];
            }
        }
    };
    pool.getTemplate = function () {
        for (var i in pool.cache) {
            if (pool.cache[i]['isActived'] != true && pool.cache[i]['template']) {
                pool.cache[i]['isActived'] = true;
                return pool.cache[i];
            }
        }
    };
    /**
     * 回收一个webview到池中
     * @param w
     * @param isDelete
     */
    pool.close = function (w, isDelete) {
        if (isDelete === true) {
            var i = -1;
            for (i in pool.cache) {
                if (pool.cache[i] == w) {
                    break;
                }
            }
            if (i != -1) {
                pool.cache.splice(i, 1);
            }
        } else {
            w['isActived'] = false;
        }
    };
    /**
     * 增加一个webview到池中
     * @param w
     */
    pool.add = function (w) {
        w['isActived'] = true;
        pool.cache.push(w);
    };
    /**
     * 关闭所有窗口
     * @method closeAll
     */
    pool.closeAll = function () {
        var w;
        while ((w = pool.cache.shift()) != undefined) {
            w.close('none');
        }
    };
})(window.app.webviewPool = {});