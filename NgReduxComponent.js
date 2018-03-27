"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NgReduxComponent = /** @class */ (function () {
    function NgReduxComponent(inputMapper, changeDetectorRef) {
        this.inputMapper = inputMapper;
        this.changeDetectorRef = changeDetectorRef;
        this.props = {};
        this.init();
    }
    NgReduxComponent.prototype.init = function () {
        var _this = this;
        this.unsubscribeStore = NgReduxComponent.store.subscribe(function () {
            _this.onStoreChange(NgReduxComponent.store);
            if (_this.changeDetectorRef) {
                _this.changeDetectorRef.markForCheck();
            }
        });
        this.onStoreChange(NgReduxComponent.store);
    };
    NgReduxComponent.prototype.ngOnInit = function () {
        // noop, this ensures angular calls any overrides further down the ctor chain
    };
    NgReduxComponent.prototype.ngOnDestroy = function () {
        this.unsubscribeStore();
    };
    NgReduxComponent.prototype.onStoreChange = function (store) {
        this.props = Object.assign({}, new this.inputMapper(store.getState()), { state: null });
    };
    return NgReduxComponent;
}());
exports.NgReduxComponent = NgReduxComponent;
