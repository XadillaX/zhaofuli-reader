/**
 * Created by XadillaX on 2015/3/12.
 */
Object.defineProperty(Object.prototype, "getPath", {
    value: function(path, defaultValue) {
        if(path.indexOf(".") < 0) {
            return this[path] === undefined ? defaultValue : this[path];
        }

        path = path.split(".");
        var obj = this[path.shift()];
        if(!(obj instanceof Object) || !obj) return defaultValue;
        return obj.getPath(path.join("."), defaultValue);
    },
    enumerable: false
});
