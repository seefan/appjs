/**
 * 微信初始化
 */
(function (app) {
    app.initFunction.push(function () {
        //重置关闭login页方式
        app.closeLogin = function () {
            location.reload();
        };
    });

})(window.app);