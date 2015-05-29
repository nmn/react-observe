# react-observe
A complete polyfill for the upcoming React Observe API

## Not a Higher Order Component, Not a mixin
There are other polyfills for the Observe API out there. This one takes a lot of inspiration from them, but it works a little differently.

You use it like you would a Higher Order Component. It's a simple function that takes your Component as an argument.
However, instead of wrapping your component in another component and passing down data as a prop, it extends your class instead.

Similar to the mixins that polyfill observe, the data is stored on the state, on the __data property. However, there is a simple ES5 getter for data that lets you use the data property with `this.data` instead and be closer to the actual API.

As of now, there is still no way to use state in your observe method, but I'm working to fix that soon too.
