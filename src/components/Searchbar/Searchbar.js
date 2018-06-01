import React, { Component } from 'react';
import axios from 'axios';
import './Searchbar.css';

class Searchbar extends Component {
	constructor() {
		super();
		this.state = {
			name: '',
			value: '',
			searchResults: []

		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}


	onChange(e) {
		this.setState({
			value: e.target.value
		});
	}

	onSubmit(e) {
		e.preventDefault();

		this.setState({
			value: ''
		});

		axios
			.get(`/routes/api/allArticles/searchword/${this.state.value}`)
			.then(result => {
				console.log(result.data);
				this.setState({ searchResults: result.data });
			});
	}

	render() {
		return (
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
				{this.state.searchResults.map((results, index) => {
					console.log('results', results);
					return (
						<a href={results.url}>
							<div key={results.site + index}>{results.title} -----------------------> {results.site}</div>
						</a>
					);
				})}
			</div>
		);
	}
}

export default Searchbar;
