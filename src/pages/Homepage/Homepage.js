// React Library
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

// Homepage Components
import Searchbar from '../../components/Searchbar';


import axios from 'axios';
import moment from 'moment';

// import services from '../../services/rssService.js';

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
			fox: [],
			breitbart: [],
			msnbc: [],
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

		console.log('targetSite', targetSite);
		targetElement.style.display = 'none';

		this.setState({
			[targetState]: true
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

	render() {
		return (
			<div className="homepage">
				<Searchbar />
				<div className="container">
					<div className="content" id="cnn-content">
						<div className="news-site">
							<h2>CNN</h2>
							{this.state.cnnIsLoading === true ? (
								<img
									className="loading-spinner"
									src="/assets/images/news-from-logo.png"
									alt="loading-spinner"
									style={{ width: 50 + 'px', height: 50 + 'px' }}
								/>
							) : (
								<button value="cnn" onClick={this.onRefresh}>
									REFRESH
								</button>
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
										while (index < 5) {
											return (
												<article key={'cnn' + index}>
													<div className="overlay">
														<time
															className="article-date"
															key={'cnn' + cnnItem.created}
														>
															{moment(cnnItem.created).format(
																'MMMM Do YYYY, h:mm a'
															)}
														</time>
														<h3
															className="article-headline"
															key={cnnItem.title}
														>
															{cnnItem.title}
														</h3>
														{/*<p>{cnnItem.description}</p>*/}
														{
															<a className="article-link" href={cnnItem.url}>
																...->
															</a>
														}
													</div>
												</article>
											);
										}
										return null;
									})}
								</div>
							)}
						</Scrollbars>
					</div>
					<div className="content" id="fox-content">
						<div className="news-site">
							<h2>Fox</h2>
							{this.state.foxIsLoading === true ? (
								<img
									className="loading-spinner"
									src="/assets/images/news-from-logo.png"
									alt="loading-spinner"
									style={{ width: 50 + 'px', height: 50 + 'px' }}
								/>
							) : (
								<button value="fox" onClick={this.onRefresh}>
									REFRESH
								</button>
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
										while (index < 5) {
											return (
												<article key={'fox' + index}>
													<div className="overlay">
														<time
															className="article-date"
															key={'fox' + foxItem.created}
														>
															{moment(foxItem.created).format(
																'MMMM Do YYYY, h:mm a'
															)}
														</time>
														<h3
															className="article-headline"
															key={foxItem.title}
														>
															{foxItem.title}
														</h3>
														{/*<p>{foxItem.description}</p>*/}
														{
															<a className="article-link" href={foxItem.url}>
																...->
															</a>
														}
													</div>
												</article>
											);
										}
										return null;
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
							{this.state.breitbartIsLoading === true ? (
								<img
									className="loading-spinner"
									src="/assets/images/news-from-logo.png"
									alt="loading-spinner"
									style={{ width: 50 + 'px', height: 50 + 'px' }}
								/>
							) : (
								<button value="breitbart" onClick={this.onRefresh}>
									REFRESH
								</button>
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
										while (index < 5) {
											return (
												<article key={'breitbart' + index}>
													<div className="overlay">
														<time
															className="article-date"
															key={'breitbart' + breitbartItem.created}
														>
															{moment(breitbartItem.created).format(
																'MMMM Do YYYY, h:mm a'
															)}
														</time>
														<h3
															className="article-headline"
															key={breitbartItem.title}
														>
															{breitbartItem.title}
														</h3>
														{/*<p>{breitbartItem.description}</p>*/}
														{
															<a
																className="article-link"
																href={breitbartItem.url}
															>
																...->
															</a>
														}
													</div>
												</article>
											);
										}
										return null;
									})}
								</div>
							)}
						</Scrollbars>
					</div>
					<div className="content" id="msnbc-content">
						<div className="news-site">
							<h2>MSNBC</h2>
							{this.state.msnbcIsLoading === true ? (
								<img
									className="loading-spinner"
									src="/assets/images/news-from-logo.png"
									alt="loading-spinner"
									style={{ width: 50 + 'px', height: 50 + 'px' }}
								/>
							) : (
								<button value="msnbc" onClick={this.onRefresh}>
									REFRESH
								</button>
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
										while (index < 5) {
											return (
												<article key={'msnbc' + index}>
													<div className="overlay">
														<time
															className="article-date"
															key={'msnbc' + msnbcItem.created}
														>
															{moment(msnbcItem.created).format(
																'MMMM Do YYYY, h:mm a'
															)}
														</time>
														<h3
															className="article-headline"
															key={msnbcItem.title}
														>
															{msnbcItem.title}
														</h3>
														{/*<p>{msnbcItem.description}</p>*/}
														{
															<a className="article-link" href={msnbcItem.url}>
																...->
															</a>
														}
													</div>
												</article>
											);
										}
										return null;
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
