"use strict";

function Beaufort() {
    this.encrypt = function (val, idx, key) {
        var keyVal = this.keyForIdx(key, idx);
        if (val < 0 || keyVal < 0) {
            return val;
        }
        return keyVal - val;
    };
    this.decrypt = function (val, idx, key) {
        var keyVal = this.keyForIdx(key, idx);
        if (val < 0 || keyVal < 0) {
            return val;
        }
        return keyVal - val;
    };
}
Beaufort.prototype = new Vigenere();
crypt = new Beaufort();