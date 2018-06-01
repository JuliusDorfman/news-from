import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './Searchbar.css';
import Dropdown from 'rc-dropdown';
import Menu, { Item as MenuItem, Divider } from 'rc-menu';
import 'rc-dropdown/assets/index.css';

// :TODO build own dropdown. . do the master branch first

class Searchbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			value: '',
			searchResults: [],
			cnnMenuData: [],
			foxMenuData: [],
			breitbartMenuData: [],
			msnbcMenuData: []
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSelect({ key }) {
		console.log(`${key} selected`);
	}

	onVisibleChange(e) {
	}

	onMouseEnter(e) {
	}

	onMouseLeave(e) {
	}

	onChange(e) {
		this.setState({
			value: e.target.value
		});
	}

	onSubmit(e) {
		e.preventDefault();
		let cnnMenuData = [];
		let foxMenuData = [];
		let breitbartMenuData = [];
		let msnbcMenuData = [];

		this.setState({
			value: ''
		});

		axios
			.get(`/routes/api/allArticles/searchword/${this.state.value}`)
			.then(result => {
				result.data.forEach((result, index) => {
					if (result.site === 'cnn') {
						cnnMenuData.push(result);
					}
					if (result.site === 'fox') {
						foxMenuData.push(result);
					}
					if (result.site === 'breitbart') {
						breitbartMenuData.push(result);
					}
					if (result.site === 'msnbc') {
						msnbcMenuData.push(result);
					}

					this.setState({
						cnnMenuData: cnnMenuData,
						foxMenuData: foxMenuData,
						breitbartMenuData: breitbartMenuData,
						msnbcMenuData: msnbcMenuData
					});
				});
			});
	}

	componentWillMount() {}

	render() {
		const cnnMenu = (
			<Menu onSelect={this.onSelect}>
				{this.state.cnnMenuData.map((results, index) => {
					return (
						<a className="menu-link" key={results.url + index} href={results.url}>
							<MenuItem key={results.site + index} onItemHover={console.log("hello")}>{results.title}</MenuItem>
						</a>
					);
				})}
			</Menu>
		);
		const foxMenu = (
			<Menu onSelect={this.onSelect}>
				{this.state.foxMenuData.map((results, index) => {
					return (
						<a className="menu-link" key={results.url + index} href={results.url}>
							<MenuItem key={results.site + index}>{results.title}</MenuItem>
						</a>
					);
				})}
			</Menu>
		);
		const breitbartMenu = (
			<Menu onSelect={this.onSelect}>
				{this.state.breitbartMenuData.map((results, index) => {
					return (
						<a className="menu-link" key={results.url + index} href={results.url}>
							<MenuItem key={results.site + index}>{results.title}</MenuItem>
						</a>
					);
				})}
			</Menu>
		);
		const msnbcMenu = (
			<Menu onSelect={this.onSelect}>
				{this.state.msnbcMenuData.map((results, index) => {
					return (
						<a className="menu-link" key={results.url + index} href={results.url}>
							<MenuItem key={results.site + index}>{results.title}</MenuItem>
						</a>
					);
				})}
			</Menu>
		);
		return (
			<div className="search-wrapper">
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
				</div>

				<div className="dropdown-menus" style={{ margin: 20 }}>
					<div style={{ height: 100 }} />
					<div>
						<Dropdown
							trigger={['click']}
							overlay={cnnMenu}
							animation="slide-up"
							onVisibleChange={this.onVisibleChange}
							onMouseEnter={this.onMouseEnter}
							onMouseLeave={this.onMouseLeave}
						>
							<button style={{ width: 100 }}>CNN</button>
						</Dropdown>
						<Dropdown
							trigger={['click']}
							overlay={foxMenu}
							animation="slide-up"
							onVisibleChange={this.onVisibleChange}
							onMouseEnter={this.onMouseEnter}
							onMouseLeave={this.onMouseLeave}
						>
							<button style={{ width: 100 }}>Fox</button>
						</Dropdown>
						<Dropdown
							trigger={['click']}
							overlay={breitbartMenu}
							animation="slide-up"
							onVisibleChange={this.onVisibleChange}
							onMouseEnter={this.onMouseEnter}
							onMouseLeave={this.onMouseLeave}
						>
							<button style={{ width: 100 }}>Breitbart</button>
						</Dropdown>
						<Dropdown
							trigger={['click']}
							overlay={msnbcMenu}
							animation="slide-up"
							onVisibleChange={this.onVisibleChange}
							onMouseEnter={this.onMouseEnter}
							onMouseLeave={this.onMouseLeave}
						>
							<button style={{ width: 100 }}>MSNBC</button>
						</Dropdown>
					</div>
				</div>
			</div>
		);
	}
}

export default Searchbar;
