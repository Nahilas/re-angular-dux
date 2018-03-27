# re-angular-dux
Simple angular connector for Redux, based on the `props` object from React.

There are several great Redux connectors for Angular 2+ out there, and most of them uses the Observables pattern from RxJS which makes a lot of sense. However, many times you just want the newest state available and you don't want to have to worry about observable sequences and asynchronous data. Enter re-angular-dux (React-Angular-Redux - GET IT?).

You basically connect the constructor of your component with the Redux store, and define which part of the store you're interested in with the InputMapper and off you go. All of this is typesafe. See an example below:

```typescript
import { Connect, InputMapper } from 're-angular-dux'

// Assuming we have a store class called AppState which looks like this
class AppState {
    helloWorldState = {
        hello = "Hello",
        world = "world"
    }
}

// In the component you want to connect, start by declaring which properties you want (this.state is automagically set by re-angular-dux)
class Input extends InputMapper<AppState> {
    hello = this.state.helloWorldState.hello;
    world = this.state.helloWorldState.world;
}


@Component({
    selector: 'hello-world-connected-component',
    template: `
        {{ props.hello }}, {{ props.world }}!
    `
})
// This line is important. It Connects (duh) your component to the store using the input mapper we just built.
class HelloWorldConnectedComponent extends Connect(Input) { 
    constructor(changeDetectorRef: ChangeDetectorRef) {
        super(changeDetectorRef)
    }

    // All mapped properties are available with type safety
    someMethod() {
        alert(props.hello + ', ' + props.world);
    }
}
```

## That's great and all... How do I get it?
Quite right! Re-angular-dux is very easy to set up, since it sidesteps angulars dependency injector. This might get changed at a later date, but for now the store reference is just a static value that needs to be set on NgReduxComponent. A complete setup example below:

```typescript
import { createStore } from 'redux'
import { NgReduxComponent } from 're-angular-dux'

// Setup your redux store with reducer, default state and middleware
const store = createStore<AppState>();

// Make your newly created store available to re-angular-dux
NgReduxComponent.store = store;
```

And that's it! Your angular components can now connect to Redux. If you're using redux and re-angular-dux everywhere in your application, I recommend telling angular to use the push change detection strategy. Since we're manually telling angular to update, we can tell it to stop listening for changes everywhere. Do this in your outermost component.

```typescript
    @Component({
        ...
        changeDetection: ChangeDetectionStrategy.OnPush,
        ...
    })
    class MyAppComponent {}
```

## State mixins
So say you have your store set up in a way, that a subset of whatever state you have matches the needs of one of your connected components. Enter state mixins! Let's start with the example from before:

```typescript
import { Connect, InputMapper } from 're-angular-dux'

class HelloWorldState {
    hello = "Hello";
    world = "World";
}
class AppState {
    helloWorldState = new HelloWorldState();
}

// Now instead of selecting invidiual properties from the state
// lets mixin the HelloWorldState
class Input extends InputMapper<AppState> {
    constructor(state: AppState) {
        super(state, state.helloWorldState);
    }
}

@Component({
    selector: 'hello-world-connected-component',
    template: `
        {{ props.hello }}, {{ props.world }}!
    `
})
// When we connect, let's tell re-angular-dux which state we're mixin in, for type safety's sake
class HelloWorldConnectedComponent extends Connect(Input, HelloWorldState) { 
    constructor(changeDetectorRef: ChangeDetectorRef) {
        super(changeDetectorRef)
    }

    // All mapped properties are available with type safety
    someMethod() {
        alert(props.hello + ', ' + props.world);
    }
}
```

So now even large complex state trees can be mixed in, without having to change a lot of code. Note that you can still pick out properties from other parts of the store.


## A word on ngOnChanges
Because of the way re-angular-dux works right now, ngOnChanges does not get fired on connected components. It'll still work on any components in the tree rendered by a connected component, just not the one with the Connect() directly attached to it's constructor... Which leads us to...

## TODO
Stuff that would be nice to have in this package:
* ngOnChanges support.
* Test suite with Travis integration

