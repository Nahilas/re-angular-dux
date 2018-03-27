import { OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { InputMapper } from './InputMapper';
import { NgReduxComponent } from './NgReduxComponent';

const overrideMethod = (name: string, obj: any, overrideWith: () => void) => {
    let ownRef: any;
    
    if (obj[name] && overrideWith !== obj[name]) {
        ownRef = obj[name];
    }

    obj[name] = function() {
        overrideWith.call(this, this);

        if (ownRef) {
            ownRef.call(this);
        }
    };
};

export function Connect<A, 
                                I extends InputMapper<A>, M>(
                                    input: new(...args: any[]) => I,
                                    mixin?: new(...args: any[]) => M
                                    ): new(changeDetector: ChangeDetectorRef) => NgReduxComponent<A, I, M> {
    let newCtor = function(changeDetector: ChangeDetectorRef) { // NOTE: function and not arrow on purpose for this
        overrideMethod('ngOnDestroy', this, NgReduxComponent.prototype.ngOnDestroy);

        NgReduxComponent.call(this, input, changeDetector);
    };
    newCtor.prototype = NgReduxComponent.prototype;
    
    return newCtor as any;
}

// Extends ConnectConstructor and adds a mandatory reset command that's called on ngOnInit
export function ConnectWithReset<A,
    I extends InputMapper<A>, M, P>(
    input: new (...args: any[]) => I,
    mixin?: new (...args: any[]) => M,
    resetOnDestroy = false
): new (changeDetectorRef: ChangeDetectorRef, onReset: (page: NgReduxComponent<A, I, M>) => void, resetOnDestroy?: boolean) => NgReduxComponent<A, I, M> {

    // Start by creating a constructor we can extend from
    let connectedCtor = Connect(input, mixin);
    
    // Create a new constructor with the reset action
    let newCtor = function (changeDetectorRef: ChangeDetectorRef, onReset: () => void) { // NOTE: function and not arrow on purpose for this
        // Call our connected constructor
        connectedCtor.call(this, changeDetectorRef);

        overrideMethod(resetOnDestroy ? 'ngOnDestroy' : 'ngOnInit', this, onReset);
    } as any;
    // Be sure to set the prototype of our new constructor to that of our connected one
    newCtor.prototype = connectedCtor.prototype;

    return newCtor;
};