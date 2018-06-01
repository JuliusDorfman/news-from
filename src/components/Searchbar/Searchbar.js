import React, { Component } from 'react';
import axios from 'axios';

import ChartComponent from '../ChartComponent';
import './Searchbar.css';

class Searchbar extends Component {
	constructor() {
		super();
		this.state = {
			name: '',
			value: '',
			cnnDisplay: 'none',
			foxDisplay: 'none',
			breitbartDisplay: 'none',
			msnbcDisplay: 'none',
			buttonDisplay: 'none',
			spinnerDisplay: 'none',
			searchResults: [],
			cnnMenuOptions: [],
			foxMenuOptions: [],
			breitbartMenuOptions: [],
			msnbcMenuOptions: []
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.toggleDisplay = this.toggleDisplay.bind(this);
	}

	onChange(e) {
		this.setState({
			value: e.target.value
		});
	}

	onSubmit(e) {
		let cnnMenuArray = [];
		let foxMenuArray = [];
		let breitbartMenuArray = [];
		let msnbcMenuArray = [];
		e.preventDefault();
		this.setState({
			spinnerDisplay: 'block'
		});

		axios
			.get(`/routes/api/allArticles/searchword/${this.state.value}`)
			.then(result => {
				console.log('Promise Return');
				result.data.map((resultItem, index) => {
					if (resultItem.site === 'cnn') {
						cnnMenuArray.push(resultItem);
					}
					return null;
				});
				result.data.map((resultItem, index) => {
					if (resultItem.site === 'fox') {
						foxMenuArray.push(resultItem);
					}
					return null;
				});
				result.data.map((resultItem, index) => {
					if (resultItem.site === 'breitbart') {
						breitbartMenuArray.push(resultItem);
					}
					return null;
				});
				result.data.map((resultItem, index) => {
					if (resultItem.site === 'msnbc') {
						msnbcMenuArray.push(resultItem);
					}
					this.setState({ cnnMenuOptions: cnnMenuArray });
					this.setState({ foxMenuOptions: foxMenuArray });
					this.setState({ breitbartMenuOptions: breitbartMenuArray });
					this.setState({ msnbcMenuOptions: msnbcMenuArray });
					this.setState({ spinnerDisplay: 'none' });
					this.setState({ buttonDisplay: 'block' });
					return null;
				});
			});
	}

	toggleDisplay(e) {
		e.preventDefault();
		let el = e.target.name;
		if (el === 'dropdown-button-cnn') {
			if (this.state.cnnDisplay === 'none') {
				this.setState({ cnnDisplay: 'block' });
				this.setState({ foxDisplay: 'none' });
				this.setState({ breitbartDisplay: 'none' });
				this.setState({ msnbcDisplay: 'none' });
			} else {
				this.setState({ cnnDisplay: 'none' });
			}
		}
		if (el === 'dropdown-button-fox') {
			if (this.state.foxDisplay === 'none') {
				this.setState({ foxDisplay: 'block' });
				this.setState({ cnnDisplay: 'none' });
				this.setState({ breitbartDisplay: 'none' });
				this.setState({ msnbcDisplay: 'none' });
			} else {
				this.setState({ foxDisplay: 'none' });
			}
		}
		if (el === 'dropdown-button-breitbart') {
			if (this.state.breitbartDisplay === 'none') {
				this.setState({ breitbartDisplay: 'block' });
				this.setState({ cnnDisplay: 'none' });
				this.setState({ foxDisplay: 'none' });
				this.setState({ msnbcDisplay: 'none' });
			} else {
				this.setState({ breitbartDisplay: 'none' });
			}
		}
		if (el === 'dropdown-button-msnbc') {
			if (this.state.msnbcDisplay === 'none') {
				this.setState({ msnbcDisplay: 'block' });
				this.setState({ cnnDisplay: 'none' });
				this.setState({ foxDisplay: 'none' });
				this.setState({ breitbartDisplay: 'none' });
			} else {
				this.setState({ msnbcDisplay: 'none' });
			}
		}
	}

	render() {
		return (
			<div>
				<div className="searchbar-component">
					<form>
						<input
							type="text"
							placeholder="Buzzword/Public Figure"
							name="search"
							value={this.state.value}
							onChange={this.onChange}
						/>
						<input type="submit" onClick={this.onSubmit} />
					</form>

					<div
						className="spinner-overlay"
						style={{ display: this.state.spinnerDisplay }}
					>
						<img
							className="loading-spinner"
							src="/assets/images/news-from-logo.png"
							alt="loading-spinner"
						/>
					</div>


					<div
						className="all-dropdown-container"
						style={{ display: this.state.buttonDisplay }}
					>
						<div className="dropdown-container dropdown-container-cnn">
							<button
								name="dropdown-button-cnn"
								className="dropdown-button dropdown-button-cnn"
								onClick={this.toggleDisplay}
							>
								CNN
							</button>
							<div
								className="dropdown-menu dropdown-menu-cnn"
								style={{ display: this.state.cnnDisplay }}
							>
								{this.state.cnnMenuOptions.map((results, index) => {
									return (
										<div
											key={results.site + 'item' + index}
											className="dropdown-item dropdown-item-cnn"
										>
											<a href={results.url}>{results.title}</a>
											<div className="dropdown-item-seperator" />
										</div>
									);
								})}
							</div>
						</div>
						<div className="dropdown-container dropdown-container-fox">
							<button
								name="dropdown-button-fox"
								className="dropdown-button dropdown-button-fox"
								onClick={this.toggleDisplay}
							>
								Fox
							</button>
							<div
								className="dropdown-menu dropdown-menu-fox"
								style={{ display: this.state.foxDisplay }}
							>
								{this.state.foxMenuOptions.map((results, index) => {
									return (
										<div
											key={results.site + 'item' + index}
											className="dropdown-item dropdown-item-fox"
										>
											<a href={results.url}>{results.title}</a>
											<div className="dropdown-item-seperator" />
										</div>
									);
								})}
							</div>
						</div>
						<div className="dropdown-container dropdown-container-breitbart">
							<button
								name="dropdown-button-breitbart"
								className="dropdown-button dropdown-button-breitbart"
								onClick={this.toggleDisplay}
							>
								Breitbart
							</button>
							<div
								className="dropdown-menu dropdown-menu-breitbart"
								style={{ display: this.state.breitbartDisplay }}
							>
								{this.state.breitbartMenuOptions.map((results, index) => {
									return (
										<div
											key={results.site + 'item' + index}
											className="dropdown-item dropdown-item-breitbart"
										>
											<a href={results.url}>{results.title}</a>
											<div className="dropdown-item-seperator" />
										</div>
									);
								})}
							</div>
						</div>
						<div className="dropdown-container dropdown-container-msnbc">
							<button
								name="dropdown-button-msnbc"
								className="dropdown-button dropdown-button-msnbc"
								onClick={this.toggleDisplay}
							>
								MSNBC
							</button>
							<div
								className="dropdown-menu dropdown-menu-msnbc"
								style={{ display: this.state.msnbcDisplay }}
							>
								{this.state.msnbcMenuOptions.map((results, index) => {
									return (
										<div
											key={results.site + 'item' + index}
											className="dropdown-item dropdown-item-msnbc"
										>
											<a href={results.url}>{results.title}</a>
											<div className="dropdown-item-seperator" />
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Searchbar;
