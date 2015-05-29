import assign from 'react/lib/Object.assign'

export function polyfillObserve(ComposedComponent) {

  class Enhanced extends ComposedComponent {
    constructor(props, context) {
      super(props, context)
      this.state = this.state || {}

      if(this.observe){
        this._subscriptions = {}
        this.state.__data = {}
      }

    }

    get data(){
      return this.state.__data
    }

    componentWillMount(){
      if(this.observe){
        this._resubscribe(this.props, this.context)
      }
    }

    componentWillReceiveProps(newProps, newContext) {
      super.componentWillReceiveProps && super.componentWillReceiveProps(newProps, newContext)
      if(this.observe){
        this._resubscribe(newProps, newContext)
      }
    }

    componentWillUnmount() {
      super.componentWillUnmount && super.componentWillUnmount()
      if(this._subscriptions){
        this._unsubscribe()
      }
    }

    _resubscribe(props, context) {
      const newObservables = this.observe(props, context)
      const newSubscriptions = {}
      const that = this

      for (let key in newObservables) {
        newSubscriptions[key] = newObservables[key].subscribe(
          function onNext(value){
            that.setState(({__data}) => {
              __data[key] = value
              return {__data}
            })
          },
          function onError(){},
          function onCompleted(){}
        )
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

  Enhanced.propTypes = ComposedComponent.propTypes
  Enhanced.contextTypes = ComposedComponent.contextTypes

  return Enhanced
}