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

	componentDidMount() {}

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

		console.log('targetSite', targetSite);
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
		console.log('onChartComponentUpdate', this.state.cnnCount);
	};

	onChartComponentUpdate = val => {
		this.setState({ showChart: true });
	};

	render() {
		return (
			<div className="homepage">
				<Searchbar onSearchbarUpdate={this.onSearchbarUpdate} />
				<div className="chartcomponent-wrapper">
					{this.state.showChart === false ? (
						<span />
					) : (
						<ChartComponent
							onChartComponentUpdate={this.onChartComponentUpdate}
							cnnCount={this.state.cnnCount}
							foxCount={this.state.foxCount}
							breitbartCount={this.state.breitbartCount}
							msnbcCount={this.state.msnbcCount}
						/>
					)}
				</div>
				<div className="container">
					<div className="content" id="cnn-content">
						<div className="news-site">
							<h2>CNN</h2>
							<button
								className="refresh-button refresh-button-cnn"
								value="cnn"
								onClick={this.onRefresh}
							>
								REFRESH
							</button>
							{this.state.cnnCount === '' ? (
								<span>{`${this.state.cnn.length} Documents`}</span>
							) : (
								<span>{`${this.state.cnnCount} Documents`}</span>
							)}
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
										return (
											<article key={'cnn' + index}>
												<div className="overlay">
													<p className="article-link">
														<a href={cnnItem.url}>Link</a>
													</p>
													<h3 className="article-headline" key={cnnItem.title}>
														{'> ' + cnnItem.title}
													</h3>
													<time
														className="article-date"
														key={'cnn' + cnnItem.created}
													>
														<span className="smalltext">Published on </span>
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
							<button
								className="refresh-button refresh-button-fox"
								value="fox"
								onClick={this.onRefresh}
							>
								REFRESH
							</button>
							{this.state.foxCount === '' ? (
								<span>{`${this.state.fox.length} Documents`}</span>
							) : (
								<span>{`${this.state.foxCount} Documents`}</span>
							)}
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
										return (
											<article key={'fox' + index}>
												<div className="overlay">
													<p className="article-link">
														<a href={foxItem.url}>Link</a>
													</p>
													<h3 className="article-headline" key={foxItem.title}>
														{'> ' + foxItem.title}
													</h3>
													<time
														className="article-date"
														key={'fox' + foxItem.created}
													>
														<span className="smalltext">Published on </span>
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
							<button
								className="refresh-button refresh-button-breitbart"
								value="breitbart"
								onClick={this.onRefresh}
							>
								REFRESH
							</button>
							{this.state.breitbartCount === '' ? (
								<span>{`${this.state.breitbart.length} Documents`}</span>
							) : (
								<span>{`${this.state.breitbartCount} Documents`}</span>
							)}
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
										return (
											<article key={'breitbart' + index}>
												<div className="overlay">
													<p className="article-link">
														<a href={breitbartItem.url}>Link</a>
													</p>
													<h3
														className="article-headline"
														key={breitbartItem.title}
													>
														{'> ' + breitbartItem.title}
													</h3>
													<time
														className="article-date"
														key={'breitbart' + breitbartItem.created}
													>
														<span className="smalltext">Published on </span>
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
							<button
								className="refresh-button refresh-button-msnbc"
								value="msnbc"
								onClick={this.onRefresh}
							>
								REFRESH
							</button>
							{this.state.msnbcCount === '' ? (
								<span>{`${this.state.msnbc.length} Documents`}</span>
							) : (
								<span>{`${this.state.msnbcCount} Documents`}</span>
							)}
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
										return (
											<article key={'msnbc' + index}>
												<div className="overlay">
													<p className="article-link">
														<a href={msnbcItem.url}>Link</a>
													</p>
													<h3
														className="article-headline"
														key={msnbcItem.title}
													>
														{'> ' + msnbcItem.title}
													</h3>
													<time
														className="article-date"
														key={'msnbc' + msnbcItem.created}
													>
														<span className="smalltext">Published on </span>
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
