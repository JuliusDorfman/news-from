import React, { Component } from 'react';
import axios from 'axios';

import ChartComponent from '../ChartComponent';
import './Searchbar.css';

class Searchbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			value: '',
			highlightWord: '',
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

	updateProps() {
		let documentCountObject = {
			cnnValue: this.state.cnnMenuOptions.length,
			foxValue: this.state.foxMenuOptions.length,
			breitbartValue: this.state.breitbartMenuOptions.length,
			msnbcValue: this.state.msnbcMenuOptions.length
		};
		let articleDisplayObject = {
			cnnDocs: this.state.cnnMenuOptions,
			foxDocs: this.state.foxMenuOptions,
			breitbartDocs: this.state.breitbartMenuOptions,
			msnbcDocs: this.state.msnbcMenuOptions
		};
		this.props.onSearchbarUpdate(documentCountObject, articleDisplayObject);
	}

	onSubmit(e) {
		e.preventDefault();
		if (this.state.value.length < 1) {
			let element = document.getElementsByClassName('filter-search');
			return (element = element[0].placeholder = 'Please Enter Text to Search');
		}
		this.highlightText();
		let cnnMenuArray = [];
		let foxMenuArray = [];
		let breitbartMenuArray = [];
		let msnbcMenuArray = [];
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
					this.setState({
						cnnMenuOptions: cnnMenuArray,
						foxMenuOptions: foxMenuArray,
						breitbartMenuOptions: breitbartMenuArray,
						msnbcMenuOptions: msnbcMenuArray,
						spinnerDisplay: 'none',
						buttonDisplay: 'block'
					});
					return null;
				});
			})
			.then(val => {
				this.updateProps();
				console.log(this.props);
			});
	}

	toggleDisplay(e) {
		e.preventDefault();
		let el = e.target.name;
		if (el === 'dropdown-button-cnn') {
			if (this.state.cnnDisplay === 'none') {
				this.setState({
					cnnDisplay: 'block',
					foxDisplay: 'none',
					breitbartDisplay: 'none',
					msnbcDisplay: 'none'
				});
			} else {
				this.setState({ cnnDisplay: 'none' });
			}
		}
		if (el === 'dropdown-button-fox') {
			if (this.state.foxDisplay === 'none') {
				this.setState({
					cnnDisplay: 'none',
					foxDisplay: 'block',
					breitbartDisplay: 'none',
					msnbcDisplay: 'none'
				});
			} else {
				this.setState({ foxDisplay: 'none' });
			}
		}
		if (el === 'dropdown-button-breitbart') {
			if (this.state.breitbartDisplay === 'none') {
				this.setState({
					cnnDisplay: 'none',
					foxDisplay: 'none',
					breitbartDisplay: 'block',
					msnbcDisplay: 'none'
				});
			} else {
				this.setState({ breitbartDisplay: 'none' });
			}
		}
		if (el === 'dropdown-button-msnbc') {
			if (this.state.msnbcDisplay === 'none') {
				this.setState({
					cnnDisplay: 'none',
					foxDisplay: 'none',
					breitbartDisplay: 'none',
					msnbcDisplay: 'block'
				});
			} else {
				this.setState({ msnbcDisplay: 'none' });
			}
		}
	}

	highlightText() {
		let highlightWord = document.getElementsByClassName('filter-search');
		this.setState({ highlightWord: highlightWord[0].value });
	}

	componentDidMount() {}

	render() {
		return (
			<div>
				<div className="searchbar-component">
					<form className="submit-filter">
						<input
							type="text"
							className="filter-search"
							placeholder="Buzzword/Public Figure"
							name="search"
							value={this.state.value}
							onChange={this.onChange}
							autoComplete="off"
						/>
						<input type="submit" value="Filter!" onClick={this.onSubmit} />
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
