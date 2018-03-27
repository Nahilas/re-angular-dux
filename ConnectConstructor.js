"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NgReduxComponent_1 = require("./NgReduxComponent");
var overrideMethod = function (name, obj, overrideWith) {
    var ownRef;
    if (obj[name] && overrideWith !== obj[name]) {
        ownRef = obj[name];
    }
    obj[name] = function () {
        overrideWith.call(this, this);
        if (ownRef) {
            ownRef.call(this);
        }
    };
};
function Connect(input, mixin) {
    var newCtor = function (changeDetector) {
        overrideMethod('ngOnDestroy', this, NgReduxComponent_1.NgReduxComponent.prototype.ngOnDestroy);
        NgReduxComponent_1.NgReduxComponent.call(this, input, changeDetector);
    };
    newCtor.prototype = NgReduxComponent_1.NgReduxComponent.prototype;
    return newCtor;
}
exports.Connect = Connect;
// Extends ConnectConstructor and adds a mandatory reset command that's called on ngOnInit
function ConnectWithReset(input, mixin, resetOnDestroy) {
    if (resetOnDestroy === void 0) { resetOnDestroy = false; }
    // Start by creating a constructor we can extend from
    var connectedCtor = Connect(input, mixin);
    // Create a new constructor with the reset action
    var newCtor = function (changeDetectorRef, onReset) {
        // Call our connected constructor
        connectedCtor.call(this, changeDetectorRef);
        overrideMethod(resetOnDestroy ? 'ngOnDestroy' : 'ngOnInit', this, onReset);
    };
    // Be sure to set the prototype of our new constructor to that of our connected one
    newCtor.prototype = connectedCtor.prototype;
    return newCtor;
}
exports.ConnectWithReset = ConnectWithReset;
;
