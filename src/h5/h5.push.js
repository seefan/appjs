/**
 * h5扩展，消息推送
 *
 * 支持消息类型
 *
 *     1.普通文本消息提示
 *     2.系统消息，不提示，只引导系统调用功能
 *
 * 系统下传消息格式为{title:'消息',type:'text|sys',data:{}}
 *
 * 参数说明：
 *
 *     1.title为消息的标题。
 *     2.type为消息的类型。text：普通提示消息，sys：系统消息，不提示给用户。
 *     3.data为附加参数。根据系统不同灵活调整。
 *
 *
 * @class app.push
 */
(function (app, s) {
    /**
     * 是否启动消息推关
     * @property enabled
     * @type {boolean}
     * @default false
     */
    s.enabled = false;
    /**
     * 设置用户点击消息后的动作
     * @param f {function} 回调函数，参数为下传消息的data字段
     * @method setMessageCallback
     *
     */
    s.setMessageCallback = function (f) {
        s.message_callback_function = f;
    };
    /**
     * 收到消息的默认回调
     * @method setCallback
     * @param f  {function} 回调函数，参数为{title:'消息',type:'text|sys',data:{}}
     */
    s.setCallback = function (f) {
        s.callback_function = f;
    };
    /**
     * 创建一个消息
     * @param title {string} 标题
     * @param data 参数
     */
    s.createMessage = function (title, data) {
        var options = {
            cover: true
        };
        plus.push.createMessage(title, data, options);
    };
    /**
     * 注册用户，用于推送消息
     */
    s.register = function () {
        var data = {};
        data.source = plus.os.name === 'iOS' ? 2 : 3; //app
        data.uuid = plus.device.uuid;
        data.model = plus.device.model;
        data.vendor = plus.device.vendor;
        data.osname = plus.os.name;
        data.osversion = plus.os.version;
        data.oslanguage = plus.os.language;
        data.osvendor = plus.os.vendor;
        data.resolutionWidth = plus.screen.resolutionWidth;
        data.resolutionHeight = plus.screen.resolutionHeight;
        var client = plus.push.getClientInfo();
        if (client) {
            data.clientid = client.clientid;
            data.token = client.token;
            data.appid = client.appid;
        }
        app.http.post(app.root + '/Appm/Api/reg', data);
    };
    /**
     * 注册到系统，不能多次注册
     */

    app.h5GlobalFunction.push(function () {
        if (!s.enabled) {
            return;
        }
        // 监听点击消息事件
        plus.push.addEventListener("click", function (msg) {
            if (typeof s.message_callback_function === 'function') {
                s.message_callback_function(msg);
            }
        }, false);
        // 监听在线消息事件，只接收透传事件
        plus.push.addEventListener("receive", function (msg) {
            if (msg.payload) {
                var ms = msg.payload.split('|');
                if (ms.length > 1) {
                    switch (ms[0]) {
                        case '0':
                            s.createMessage(ms[1], msg.payload);
                            break;
                        default:
                            if (typeof s.callback_function === 'function') {
                                s.callback_function(msg.payload);
                            }
                            break;
                    }
                }
            }
        }, false);
        s.register();
    });
})(window.app, window.app.push = {});