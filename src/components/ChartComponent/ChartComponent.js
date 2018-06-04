import React, { Component } from 'react';
import { Chart } from 'react-chartjs-2';
import 'react-chartjs-2';
import './ChartComponent.css';

class ChartComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mainChart: {},
			chartData: {
				cnn: '',
				fox: '',
				breitbart: '',
				msnbc: ''
			}
		};
		this.reRender = this.reRender.bind(this);
	}

	buildChart(data) {
		var ctx = document.getElementById('myChart');
		var myChart = new Chart(ctx, {
			type: 'doughnut',
			data: {
				labels: ['CNN', 'FOX', 'BREITBART', 'MSNBC'],
				datasets: [
					{
						label: '# of Appearances',
						data: [
							this.props.cnnCount,
							this.props.foxCount,
							this.props.breitbartCount,
							this.props.msnbcCount
						],
						backgroundColor: [
							'rgba(255, 99, 132, 0.2)',
							'rgba(54, 162, 235, 0.2)',
							'rgba(255, 206, 86, 0.2)',
							'rgba(75, 192, 192, 0.2)'
						],
						borderColor: [
							'rgba(255,99,132,1)',
							'rgba(54, 162, 235, 1)',
							'rgba(255, 206, 86, 1)',
							'rgba(75, 192, 192, 1)'
						],
						borderWidth: 3
					}
				]
			},
			options: {
				scales: {
					yAxes: [
						{
							ticks: {
								beginAtZero: true
							}
						}
					]
				},
				legend: {
					display: true,
					labels: {}
				}
			}
		});
		this.setState({ mainChart: ctx }, function() {
			console.log('this.state.mainChart', this.state.mainChart);
		});
	}

	reRender(e) {
		this.setState(
			{
				chartData: {
					cnn: this.state.chartData.cnn,
					fox: this.state.chartData.fox,
					breitbart: this.state.chartData.breitbart,
					msnbc: this.state.chartData.msnbc
				}
			},
			function() {
				this.buildChart();
			}
		);
	}

	componentDidMount() {}

	render() {
		console.log('child props', this.props);
		return (
			<div className="chart-component">
				<div className="canvas-wrapper">
					<canvas id="myChart" />
				</div>
				<button onClick={this.reRender}>Render Doughnut</button>
			</div>
		);
	}
}

export default ChartComponent;
