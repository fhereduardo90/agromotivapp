import { Component } from 'react'

import FullscreenLoader from './components/fullscreen-loader'

class AsyncComponent extends Component {
  state = {
    // short for "module" but that's a keyword in js, so "mod"
    mod: FullscreenLoader
  }

  componentWillMount() {
    this.load(this.props)
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps)
    }
  }

  load(props) {
    import(`${props.load}`)
      .then( mod => {
        this.setState({
          // handle both es imports and cjs
          mod: mod.default ? mod.default : mod
        })
      } );
  }

  render() {
    return this.state.mod ? this.props.children(this.state.mod) : null
  }
}

export default AsyncComponent