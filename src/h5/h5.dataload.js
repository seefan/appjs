/**
 * 对app进行h5扩展
 * @class app
 * @module app.h5common
 */
(function (app, undefined) {
    var keepId = -1, loadFunction;
    /**
     * 页面滚动到底部加载数据
     * @method bottomLoad
     * @param f 加载数据的函数，
     */
    app.bottomLoad = function (f) {
        if (typeof f === 'function' && loadFunction === undefined) {
            loadFunction = f;
            //注册事件
            document.addEventListener("plusscrollbottom", function () {
                keepId = loadFunction(keepId);
            }, false);
        }
    };

}(window.app));