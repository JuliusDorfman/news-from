// React Library
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

// Homepage Components
import Searchbar from '../../components/Searchbar';
import ChartComponent from '../../components/ChartComponent';

// Dependencies
import axios from 'axios';
import moment from 'moment';

// Styles
import './Homepage.css';

export class Homepage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cnnIsLoading: true,
			foxIsLoading: true,
			breitbartIsLoading: true,
			msnbcIsLoading: true,
			cnn: [],
			cnnCount: '',
			fox: [],
			foxCount: '',
			breitbart: [],
			breitbartCount: '',
			msnbc: [],
			msnbcCount: '',
			showChart: true,
			searchValue: '',
			chartData: {}
		};
		this.onRefresh = this.onRefresh.bind(this);
	}

	componentWillMount() {
		this.initializeCnn();
		this.initializeFox();
		this.initializeBreitbart();
		this.initializeMsnbc();
	}

	componentDidMount() {
		console.log('homepage props', this.props);
	}

	initializeCnn() {
		console.log('initializeCnn');
		axios.get('/routes/api/cnnArticles').then(res => {
			this.setState({
				cnn: res.data,
				cnnIsLoading: false
			});
		});
	}

	initializeFox() {
		console.log('initializeFox');
		axios.get('/routes/api/foxArticles').then(res => {
			this.setState({
				fox: res.data,
				foxIsLoading: false
			});
		});
	}

	initializeBreitbart() {
		console.log('initializeBreitbart');
		axios.get('/routes/api/breitbartArticles').then(res => {
			this.setState({
				breitbart: res.data,
				breitbartIsLoading: false
			});
		});
	}

	initializeMsnbc() {
		console.log('initializeMsnbc');
		axios.get('/routes/api/msnbcArticles').then(res => {
			this.setState({
				msnbc: res.data,
				msnbcIsLoading: false
			});
		});
	}

	onRefresh(e) {
		e.preventDefault();
		const targetElement = e.target;
		const targetSite = e.target.value;
		const targetState = `${targetSite}IsLoading`;

		targetElement.style.display = 'none';

		this.setState({
			[targetState]: true
		});

		this.setState({
			[`${targetSite}Count`]: ''
		});

		axios.post(`/routes/api/${targetSite}Articles/`).then(() => {
			if (targetSite === 'cnn') {
				this.initializeCnn();
			}
			if (targetSite === 'fox') {
				this.initializeFox();
			}
			if (targetSite === 'breitbart') {
				this.initializeBreitbart();
			}
			if (targetSite === 'msnbc') {
				this.initializeMsnbc();
			}
		});

		setTimeout(() => {
			targetElement.style.display = 'block';
		}, 5000);
	}

	onSearchbarUpdate = (documentCount, articleDisplay) => {
		this.setState({
			cnnCount: documentCount.cnnValue,
			foxCount: documentCount.foxValue,
			breitbartCount: documentCount.breitbartValue,
			msnbcCount: documentCount.msnbcValue,
			cnn: articleDisplay.cnnDocs,
			fox: articleDisplay.foxDocs,
			breitbart: articleDisplay.breitbartDocs,
			msnbc: articleDisplay.msnbcDocs
		});
	};

	searchValueUpdate = searchValue => {
		console.log('searchvalueupdate')
		this.setState({
			searchValue: searchValue
		});
		this.ChartComponentUpdate(searchValue);
	};

	highlightText() {
		console.log('highlightText', this.state.searchValue)
	}

	ChartComponentUpdate = searchValue => {
		this.setState({ showChart: false });
		this.setState({ showChart: true });
	};

	componentDidUpdate() {
		this.highlightText()
		console.log("componentdidupdate")
	}

	render() {
		return (
			<div className="homepage">
				<div className="ui-instruction">
					<p>1. Enter your search. (Case Sensitive)</p>
					<p>2. Pick your chart format.</p>
					<p>3. Draw your conclusions.</p>
				</div>
				<Searchbar
					onSearchbarUpdate={this.onSearchbarUpdate}
					searchValueUpdate={this.searchValueUpdate}
					ChartComponentUpdate={this.ChartComponentUpdate}
				/>
				<div className="chartcomponent-wrapper">
					{this.state.showChart === false ? (
						<span />
					) : (
							<ChartComponent
								ChartComponentUpdate={this.ChartComponentUpdate}
								cnnCount={this.state.cnnCount}
								foxCount={this.state.foxCount}
								breitbartCount={this.state.breitbartCount}
								msnbcCount={this.state.msnbcCount}
								searchValue={this.state.searchValue}
								searchValueCharts={this.props.searchValue}
							/>
						)}
				</div>
				<div className="container">
					<div className="content" id="cnn-content">
						<div className="news-site">
							<h2>CNN</h2>
							<div className="doc-btn-holder">
								<button
									className="refresh-button refresh-button-cnn"
									value="cnn"
									onClick={this.onRefresh}
								>
									REFRESH
							</button>
								{
									this.state.cnnIsLoading ? <span className="doc-numbers">Loading</span> :
										this.state.cnnCount === '' ? (
											<span className="doc-numbers">{`${this.state.cnn.length} Documents`}</span>
										) : (
												<span className="doc-numbers">{`${this.state.cnnCount} Documents (${this.state.searchValue})`}</span>
											)
								}

							</div>
						</div>
						<Scrollbars universal autoHeight autoHeightMin={60 + 'vh'}>
							{this.state.cnnIsLoading === true ? (
								<div className="spinner-overlay">
									<img
										className="loading-spinner"
										src="/assets/images/news-from-logo.png"
										alt="loading-spinner"
									/>
								</div>
							) : (
									<div className="articles">
										{this.state.cnn.map((cnnItem, index) => {
											if (index > 100) {
												return null
											}
											return (
												<article key={'cnn' + index}>
													<div className="overlay">
														<h3
															className="article-headline"
															key={cnnItem.title}
														>
															<a className="article-link" href={cnnItem.url} target="_blank"><i className="far fa-newspaper"></i>{" " + cnnItem.title}</a>
														</h3>
														<time
															className="article-date"
															key={'cnn' + cnnItem.created}
														>
															{moment(cnnItem.created).format(
																'MMMM Do YYYY, h:mm a'
															)}
														</time>
													</div>
												</article>
											);
										})}
									</div>
								)}
						</Scrollbars>
					</div>
					<div className="content" id="fox-content">
						<div className="news-site">
							<h2>Fox</h2>
							<div className="doc-btn-holder">
								<button
									className="refresh-button refresh-button-fox"
									value="fox"
									onClick={this.onRefresh}
								>
									REFRESH
							</button>

								{
									this.state.foxIsLoading ? <span className="doc-numbers">Loading</span> :
										this.state.foxCount === '' ? (
											<span className="doc-numbers">{`${this.state.fox.length} Documents`}</span>
										) : (
												<span className="doc-numbers">{`${this.state.foxCount} Documents (${this.state.searchValue})`}</span>
											)

								}
							</div>
						</div>
						<Scrollbars universal autoHeight autoHeightMin={60 + 'vh'}>
							{this.state.foxIsLoading === true ? (
								<div className="spinner-overlay">
									<img
										className="loading-spinner"
										src="/assets/images/news-from-logo.png"
										alt="loading-spinner"
									/>
								</div>
							) : (
									<div className="articles">
										{this.state.fox.map((foxItem, index) => {
											if (index > 100) {
												return null
											}
											return (
												<article key={'fox' + index}>
													<div className="overlay">
														<h3
															className="article-headline"
															key={foxItem.title}
														>
															<a className="article-link" href={foxItem.url} target="_blank"><i className="far fa-newspaper"></i>{" " + foxItem.title}</a>
														</h3>
														<time
															className="article-date"
															key={'fox' + foxItem.created}
														>
															{moment(foxItem.created).format(
																'MMMM Do YYYY, h:mm a'
															)}
														</time>
													</div>
												</article>
											);
										})}
									</div>
								)}
						</Scrollbars>
					</div>
				</div>

				<div className="container">
					<div className="content" id="breitbart-content">
						<div className="news-site">
							<h2>Breitbart</h2>
							<div className="doc-btn-holder">
								<button
									className="refresh-button refresh-button-breitbart"
									value="breitbart"
									onClick={this.onRefresh}
								>
									REFRESH
							</button>
								{
									this.state.breitbartIsLoading ? <span className="doc-numbers">Loading</span> :
										this.state.breitbartCount === '' ? (
											<span className="doc-numbers">{`${this.state.breitbart.length} Documents`}</span>
										) : (
												<span className="doc-numbers">{`${this.state.breitbartCount} Documents (${this.state.searchValue})`}</span>
											)

								}
							</div>
						</div>
						<Scrollbars universal autoHeight autoHeightMin={60 + 'vh'}>
							{this.state.breitbartIsLoading === true ? (
								<div className="spinner-overlay">
									<img
										className="loading-spinner"
										src="/assets/images/news-from-logo.png"
										alt="loading-spinner"
									/>
								</div>
							) : (
									<div className="articles">
										{this.state.breitbart.map((breitbartItem, index) => {
											if (index > 100) {
												return null
											}
											return (
												<article key={'breitbart' + index}>
													<div className="overlay">
														<h3
															className="article-headline"
															key={breitbartItem.title}
														>
															<a className="article-link" href={breitbartItem.url} target="_blank">
																<i className="far fa-newspaper"></i>{" " + breitbartItem.title}
															</a>
														</h3>
														<time
															className="article-date"
															key={'breitbart' + breitbartItem.created}
														>
															{moment(breitbartItem.created).format(
																'MMMM Do YYYY, h:mm a'
															)}
														</time>
													</div>
												</article>
											);
										})}
									</div>
								)}
						</Scrollbars>
					</div>
					<div className="content" id="msnbc-content">
						<div className="news-site">
							<h2>MSNBC</h2>
							<div className="doc-btn-holder">
								<button
									className="refresh-button refresh-button-msnbc"
									value="msnbc"
									onClick={this.onRefresh}
								>
									REFRESH
							</button>
								{
									this.state.msnbcIsLoading ? <span className="doc-numbers">Loading</span> :
										this.state.msnbcCount === '' ? (
											<span className="doc-numbers">{`${this.state.msnbc.length} Documents`}</span>
										) : (
												<span className="doc-numbers">{`${this.state.msnbcCount} Documents (${this.state.searchValue})`}</span>
											)

								}
							</div>
						</div>
						<Scrollbars universal autoHeight autoHeightMin={60 + 'vh'}>
							{this.state.msnbcIsLoading === true ? (
								<div className="spinner-overlay">
									<img
										className="loading-spinner"
										src="/assets/images/news-from-logo.png"
										alt="loading-spinner"
									/>
								</div>
							) : (
									<div className="articles">
										{this.state.msnbc.map((msnbcItem, index) => {
											if (index > 100) {
												return null
											}
											return (
												<article key={'msnbc' + index}>
													<div className="overlay">
														<h3
															className="article-headline"
															key={msnbcItem.title}
														>
															<a className="article-link" href={msnbcItem.url} target="_blank">	<i className="far fa-newspaper"></i>{" " + msnbcItem.title}</a>
														</h3>
														<time
															className="article-date"
															key={'msnbc' + msnbcItem.created}
														>
															{moment(msnbcItem.created).format(
																'MMMM Do YYYY, h:mm a'
															)}
														</time>
													</div>
												</article>
											);
										})}
									</div>
								)}
						</Scrollbars>
					</div>
				</div>
			</div>
		);
	}
}

export default Homepage;
