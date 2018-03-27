import { Map } from 'immutable';

export class InputMapper<S> {
    constructor(public state: S, mixin: Map<string, any> | object = null) {
        if (mixin) {
            const mixinMap: Map<any, any> = Map.isMap(mixin) ? mixin as Map<any, any> : Map(mixin);

            mixinMap.keySeq().forEach(key => {
                (this as any)[key] = mixinMap.get(key)
            });
        }
    }
}