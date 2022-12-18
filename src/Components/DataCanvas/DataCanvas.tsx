import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Spinner from '../Spinner/Spinner';
import './DataCanvas.scss';
//type the props and state
interface Props {
  second?: string;
}
interface State {
  initialized: boolean;
}
export default class DataCanvas extends Component<Props, State> {
  constructor(props: Props, state: State) {
    super(props);
    this.state = {
      initialized: false,
    }
  }
  // static propTypes = {second: third}

  render() {
    let { initialized } = this.state;
    return (
      <section id="dataCanvas-component">
        <h2 id="dataCanvas__header">
          Data-Visualizer
        </h2>
        <div className="data-canvas-wrapper">
          {initialized ?
            <div id="dataCanvas">

            </div>
            :
            <Spinner />
          }
        </div>
      </section>
    )
  }
}
