import React, { Component } from 'react'
import assign from 'react/lib/Object.assign'

export default function polyfillObserve(ComposedComponent, observe) {

  class Enhancer extends ComposedComponent {
    constructor(props, context) {
      super(props, context)

      if(this.observe){
        this._subscriptions = {}
        this.data = {}
        this._resubscribe(props, context)
      }
      
    }

    componentWillUpdate(...args){
      super.componentWillUpdate(...args)
      if(this.observe){
        this._resubscribe(this.props, this.context)
      }
    }

    componentWillReceiveProps(newProps, newContext) {
      super.componentWillReceiveProps(newProps, newContext)
      if(this.observe){
        this._resubscribe(newProps, newContext)
      }
    }

    componentWillUnmount() {
      super.componentWillUnmount()
      if(this._subscriptions){
        this._unsubscribe()
      }
    }

    _resubscribe(props, context) {
      const newObservables = this.observe(props, context)
      const newSubscriptions = {}

      for (let key in newObservables) {
        newSubscriptions[key] = newObservables[key].subscribe({
          onNext: (value) => {
            this.data[key] = value
            this.forceUpdate()
          },
          onError: () => {},
          onCompleted: () => {}
        })
      }

      this._unsubscribe()
      this._subscriptions = newSubscriptions
    }

    _unsubscribe() {
      Object.keys(this._subscriptions)
        .forEach(key => this._subscriptions[key].dispose())

      this._subscriptions = {}
    }

  }

  Enhancer.propTypes = ComposedComponent.propTypes
  Enhancer.contextTypes = ComposedComponent.contextTypes

  return Enhancer
}