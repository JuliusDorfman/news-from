import React, { Component } from 'react';
import { Chart } from 'react-chartjs-2';
import 'react-chartjs-2';
import './ChartComponent.css';
import 'chartjs-plugin-datalabels';


class ChartComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mainChart: {},
			barType: '',
			chartData: {
				cnn: '',
				fox: '',
				breitbart: '',
				msnbc: ''
			},
			searchValue: ''
		};
		this.reRenderDoughnut = this.reRenderDoughnut.bind(this);
		this.reRenderBar = this.reRenderBar.bind(this);
	}

	componentDidUpdate(prevProps, prevState) {
	}

	buildDoughnut(data) {
		let barType = this.state.barType;
		var ctx = document.getElementById(barType);
		new Chart(ctx, {
			type: barType,
			data: {
				labels: ['CNN', 'FOX', 'BREITBART', 'MSNBC'],
				datasets: [
					{
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
				scales: {},
				legend: {
					position: 'bottom'
				}
			}
		});
		this.setState({ mainChart: ctx }, function () { });
		console.log('barType', this.state.barType);
	}

	buildBar(data) {
		let barType = this.state.barType;
		var ctx = document.getElementById(barType);
		new Chart(ctx, {
			type: barType,
			data: {
				labels: ['CNN', 'FOX', 'BREITBART', 'MSNBC'],
				datasets: [
					{
						label: `Appearences of ${this.props.searchValue}`,
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
					display: false
				},
				plugins: {
					display: true
				}
			}
		});
		this.setState({ mainChart: ctx }, function () { });
		console.log('barType', this.state.barType);
	}

	reRenderDoughnut(e) {
		this.setState({ barType: e.target.name });
		this.setState({ searchValue: this.props.searchValue });

		if (this.props.searchValue === '') {
			return null;
		}

		this.setState(
			{
				chartData: {
					searchValue: this.props.searchValue,
					cnn: this.state.chartData.cnn,
					fox: this.state.chartData.fox,
					breitbart: this.state.chartData.breitbart,
					msnbc: this.state.chartData.msnbc
				}
			},
			function () {
				this.buildDoughnut();
				console.log('searchValue in chart', this.state.searchValue);
			}
		);
	}

	reRenderBar(e) {
		this.setState({ barType: e.target.name });
		this.setState({ searchValue: this.props.searchValue });

		if (this.props.searchValue === '') {
			return null;
		}

		this.setState(
			{
				chartData: {
					searchValue: this.props.searchValue,
					cnn: this.state.chartData.cnn,
					fox: this.state.chartData.fox,
					breitbart: this.state.chartData.breitbart,
					msnbc: this.state.chartData.msnbc
				}
			},
			function () {
				this.buildBar();
				console.log('searchValue in chart', this.state.searchValue);
			}
		);
	}


	componentDidMount() {
		console.log('chart props', this.props);
	}

	render() {
		return (
			<div className="chart-component">
				<div className="buttons-wrapper">
					<button
						className="render-button"
						name="doughnut"
						onClick={this.reRenderDoughnut}
					>
						Render Doughnut
					</button>

					<button
						className="render-button"
						name="bar"
						onClick={this.reRenderBar}
					>
						Render Bar
					</button>
				</div>
				{this.state.searchValue === '' ? (
					<span />
				) : (
						<div className="chart-title">{`Number of Times "${
							this.state.searchValue
							}" appears.`}</div>
					)}
				{this.state.searchValue === '' ? (
					<span />
				) : (
						<div className="canvas-wrapper">
							<canvas id="doughnut" />
							<canvas id="bar" />
						</div>
					)}
			</div>
		);
	}
}

export default ChartComponent;
