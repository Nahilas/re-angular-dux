import { Store } from 'redux';
import { ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { InputMapper } from './InputMapper';

export abstract class NgReduxComponent<A, I extends InputMapper<A>, M> implements OnDestroy, OnInit {
    static store: Store<any>;
    
    public props: I & M = <any> {};
    private unsubscribeStore: Function;
    
    constructor(
        private inputMapper: new(...args: any[]) => I,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.init();
    }

    init() {
        this.unsubscribeStore = NgReduxComponent.store.subscribe(() => {
            this.onStoreChange(NgReduxComponent.store);

            if (this.changeDetectorRef) {
                this.changeDetectorRef.markForCheck();
            }
        });
        this.onStoreChange(NgReduxComponent.store);
    }
    
    ngOnInit() {
        // noop, this ensures angular calls any overrides further down the ctor chain
    }

    ngOnDestroy() {
        this.unsubscribeStore();
    }

    onStoreChange(store: Store<A>) {
        this.props = Object.assign(
            {},
            new this.inputMapper(store.getState()),
            { state: null }
        ) as any;
    }
}