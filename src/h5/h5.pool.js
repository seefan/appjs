/**
 * Created by seefan on 15/10/12.
 * 缓存，内部使用
 * @class app.pool
 */
(function (pool) {
    /**
     * 缓存的内容
     * @type {object}
     */
    pool.cache = {};
    /**
     * 取缓存
     * @method get
     * @param id {string} 缓存的键值
     * @returns {object}
     */
    pool.get = function (id) {
        return this.cache[id];
    };
    /**
     * 设置缓存
     * @method set
     * @param id {string} 缓存的键值
     * @param obj 缓存的内容
     */
    pool.set = function (id, obj) {
        this.cache[id] = obj;
    };
    /**
     * 删除缓存内容
     * @method remove
     * @param id {string} 缓存的键值
     */
    pool.remove = function (id) {
        if (pool.exists(id)) {
            delete this.cache[id];
        }
    };
    /**
     * 是否存在指定键值
     * @method exists
     * @param id {string} 缓存的键值
     * @returns {boolean}
     */
    pool.exists = function (id) {
        return this.cache.hasOwnProperty(id);
    };
})(window.app.pool = {});