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
		this.hideChart = this.hideChart.bind(this);
	}


	buildDoughnut(data) {
		let barType = this.state.barType;
		let ctx = document.getElementById(barType);
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
							'rgba(225, 60, 60, 0.2)',
							'rgba(75, 75, 75, 0.2)'
						],
						borderColor: [
							'rgba(255,99,132,1)',
							'rgba(54, 162, 235, 1)',
							'rgba(255, 69, 0, 0.6)',
							'rgba(100, 100, 100, 1)'
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
		this.setState({ mainChart: ctx }, function() { });
	}

	buildBar(data) {
		let barType = this.state.barType;
		let ctx = document.getElementById(barType);
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
							'rgba(225, 60, 60, 0.2)',
							'rgba(75, 75, 75, 0.2)'
						],
						borderColor: [
							'rgba(255,99,132,1)',
							'rgba(54, 162, 235, 1)',
							'rgba(255, 69, 0, 0.6)',
							'rgba(100, 100, 100, 0.6)'
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
		this.setState({ mainChart: ctx }, function() { });
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
			function() {
				this.buildDoughnut();
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
			function() {
				this.buildBar();
			}
		);
	}

	hideChart(e) {
		this.setState({ searchValue: "" })
	}

	componentDidMount() {
		console.log('chart props', this.props);
	}

	render() {
		return (
			<div className="chart-component">
				<div className="buttons-wrapper">
					<div className="column">
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
					<div className="column">
						<button
							className="hide-button"
							name="doughnut"
							onClick={this.hideChart}
						>
							Hide Charts
					</button>
					</div>

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
