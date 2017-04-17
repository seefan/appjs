/**
 * h5扩展，音频处理
 * @class app.audio
 */
(function (app, s, undefined) {
    /**
     * 是否可用
     *
     * @type {boolean}
     */
    s.inited = false;

    /**
     * 录音对象
     * @type {undefined}
     */
    s.recorder = undefined;

    /**
     * 是否在扬声器播放
     * @property playOnSpeaker
     * @type {boolean}
     * @default true
     */
    s.playOnSpeaker = true;
    /**
     * 是否正在录音
     * @type {boolean}
     */
    s.recording = false;
    /**
     * 播放音频对象
     * @type {undefined}
     */
    s.player = undefined;

    /**
     * 默认的录音格式
     * @property fileFormat
     * @type {string}
     * @default amr
     */
    s.fileFormat = 'amr';
    /**
     * 最近的一个文件
     * @type {undefined}
     */
    s.path = undefined;
    /**
     * 初始化音频类
     */
    s.init = function () {
        // 获取音频目录对象
        plus.io.resolveLocalFileSystemURL("_doc/", function (entry) {
            entry.getDirectory("audio", {
                create: true
            }, function () {
                s.inited = true;
                // app.util.log('创建目录成功');
            }, function (e) {
                app.util.log("Get directory \"audio\" failed: " + e.message);
            });
        }, function (e) {
            app.util.log("Resolve \"_doc/\" failed: " + e.message);
        });
    };
    /**
     * 播放指定文件
     * @method play
     * @param file {string} 要播放的文件的地址
     * @param callback {function} 播放回调，播放完成后调用，失败返回e
     */
    s.play = function (file, callback) {
        if (s.inited) {
            file = file || s.path;
            if (!file) {
                return;
            }
            if (s.player != undefined) {
                return;
            }
            s.player = plus.audio.createPlayer(file);

            s.player.setRoute(s.playOnSpeaker ? plus.audio.ROUTE_SPEAKER : plus.audio.ROUTE_EARPIECE);
            s.player.play(function () {
                if (typeof callback === 'function') {
                    callback();
                }
                //app.util.log("播放完成！");
                if (s.player) {
                    s.player.stop();
                    s.player = undefined;
                }
            }, function (e) {
                s.player = undefined;
                if (typeof callback === 'function') {
                    callback(e);
                }
                app.util.log("播放音频文件\"" + file + "\"失败：" + e.message);
            });
        }
    };
    /**
     * 录音
     * @method record
     * @param callback {function} 录音回调，录制完成后调用，返回录音文件的地址，失败返回e
     */
    s.record = function (callback) {
        if (s.recording) {
            return;
        }
        s.recording = true;
        if (s.recorder == undefined) {
            s.recorder = plus.audio.getRecorder();
            if (s.recorder == null) {
                app.util.log("录音对象未获取");
                return;
            }
        }
        s.recorder.record({
            format: s.fileFormat,
            samplerate: s.recorder.supportedSamplerates[0],
            filename: "_doc/audio/"
        }, function (f) {
            s.path = f;
            if (typeof callback === 'function') {
                callback(f);
            }
        }, function (ex) {
            app.util.log("录音失败：" + ex.message);
            if (typeof callback === 'function') {
                callback(ex);
            }
        });
    };
    /**
     * 停止录音
     * @method stopRecord
     */
    s.stopRecord = function () {
        if (s.recording && s.recorder != undefined) {
            s.recorder.stop();
            s.recording = false;
        }
    };
    /**
     * 初始化
     */
    app.h5InitFunction.push(function () {
        s.init();
    });
})
(window.app, window.app.audio = {});