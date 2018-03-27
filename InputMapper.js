"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var InputMapper = /** @class */ (function () {
    function InputMapper(state, mixin) {
        var _this = this;
        this.state = state;
        if (mixin) {
            var mixinMap_1 = immutable_1.Map.isMap(mixin) ? mixin : immutable_1.Map(mixin);
            mixinMap_1.keySeq().forEach(function (key) {
                _this[key] = mixinMap_1.get(key);
            });
        }
    }
    return InputMapper;
}());
exports.InputMapper = InputMapper;
