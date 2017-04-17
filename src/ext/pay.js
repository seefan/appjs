/**
 * 支付相关
 * @class app.pay
 */

(function (app, service) {
    /**
     * 从后台获取支付信息
     * @method getPayInfo
     * @param orderid {number} 订单id
     * @param paytype {string} 支付类型，支持alipay,wxpay,my（余额）
     * @param callback {function} 获取成功的回调，根据支付类型的不同和app的不同返回不同的内容
     */
    service.getPayInfo = function (orderid, paytype, callback) {
        var url = '/User/Pay/AppOrder'; //余额
        switch (paytype) {
            case 'alipay': //支付宝
                url = '/Alipay/Pay/AppOrder';
                break;
            case 'wxpay': //微信
                url = '/Weichat/Pay/AppOrder';
                break;
        }
        app.http.post(app.root + url,
            {order_id: orderid},
            function (e) {
                if (callback) {
                    callback(e);
                }
            });
    };

})(window.app, window.app.pay = {});