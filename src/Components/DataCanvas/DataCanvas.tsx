import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './DataCanvas.scss';

export default class DataCanvas extends Component {
  constructor(props: any) {
    super(props);

  }
  // static propTypes = {second: third}

  render() {
    return (
      <section id="dataCanvas-component">
        <h2 id="dataCanvas__header">
          Data-Visualizer
        </h2>
        <div id="dataCanvas">

        </div>
      </section>
    )
  }
}
