/**
 * h5支付扩展
 * @class app.pay
 * @module app.pay.h5
 */

(function (service) {
    /**
     * 支持的支付类型
     * @type {hash}
     */
    service.pays = {};
    /**
     *
     * @type {number}
     */
    service.pays.length = 0;

    /**
     * 获取支付通道，如果可用在app里可以显示出来
     *
     * 支付对象结构，如果支付通道服务未安装，将不出现在返回的参数里。
     *
     *      {
     *        id: 支付通道标识,
     *        description: 支付通道描述,
     *        serviceReady: 支付通道服务是否安装
     *      }
     *
     * @method getPayChannel
     * @param callback {function} 回调方法，回传支持的通道参数
     */
    service.getPayChannel = function (callback) {
        if (service.pays.length > 0) {
            if (callback) {
                callback(service.pays);
            }
            return;
        }
        if (window.plus) {
            // 获取支付通道
            plus.payment.getChannels(function (channels) {
                for (var j in channels) {
                    var channel = channels[j];
                    if (channel.serviceReady) {
                        service.pays[channel.id] = channel;
                        service.pays.length++;
                    }
                }
                if (callback) {
                    callback(service.pays);
                }
            }, function (e) {
                console.log("获取支付通道失败：" + e.message);
            });
        } else {
            if (callback) {
                callback(service.pays);
            }
        }

    };
    /**
     * 发起支付
     * @method payOrder
     * @param order_id {number} 订单id
     * @param paytype {string} 支付类型 [my|wxpay|alipay]
     * @param callback {function} 成功后回调，如果支付成功，回传参数0，其它为错误代码
     */
    service.payOrder = function (order_id, paytype, callback) {
        service.getPayInfo(order_id, paytype, function (e) {
            var channel = service.pays[paytype];
            var payinfo = e.data;
            if (window.plus && payinfo != 'myok') {
                plus.payment.request(channel, payinfo, function () {
                    if (callback) {
                        callback(0);
                    }
                }, function (e) {
                    if (callback) {
                        callback(e.code);
                    }
                });
            } else {
                if (callback) {
                    callback(0);
                }
            }
        });
    }
})(window.app.pay);