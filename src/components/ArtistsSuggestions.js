import React, { Component } from 'react';
import TasteDive from '../api/TasteDive.js';

import './ArtistsSuggestions.css';


class ArtistsSuggestions extends Component {

    constructor(props) {
        super(props);

        this.state = {
            results: [],
            artistNames: [],
            artistNamesStr: '',
            collapsed: false
        };
    }

    componentDidUpdate() {
        if (this.props.artists.map(a => a.name.toLowerCase()).join(', ') !== this.state.artistNamesStr)
            this.searchSimilar(this.props.artists);
    }


    searchSimilar(artists) {
        if (!artists || !artists.length)
            return;

        var artistsNames = artists.map(a => a.name.toLowerCase());
        this.setState({ 
            artistNames: artistsNames,
            artistNamesStr: artistsNames.join(', ') 
        });
        TasteDive.searchSimilar(artistsNames, this.onSimilarFound.bind(this));
    }


    onSimilarFound(err, results) {
        if (err)
            return console.error('TasteDive API error', err);

        console.log('TasteDive results', results);
        this.setState({ 
            results: results.Similar.Results
                .filter(r => r.Type === 'music')
                .filter(r => this.state.artistNames.indexOf(r.Name.toLowerCase()) === -1) 
        });
    }


    handleCloseClick() {
        this.setState({ collapsed: true });
    }


    handleSuggestionsClick() {
        if (this.state.collapsed)
            this.setState({ collapsed: false });
    }


    render() {
        let results = this.state.results.map(a => <span className="similar-name" key={a.Name} onClick={() => this.props.onSimilarClick(a.Name)}>{a.Name}</span>);
        
        let classNames = ['artists-suggestions'];
        if (results.length)
            classNames.push('artists-suggestions-open');
        if (this.state.collapsed)
            classNames.push('artists-suggestions-collapsed');

        let closeBtn = <span className="artists-suggestions-close" onClick={this.handleCloseClick.bind(this)}>&times;</span>

        return <div className={classNames.join(' ')} data-similar-count={this.state.results.length} onClick={this.handleSuggestionsClick.bind(this)}>
            {results.length && !this.state.collapsed ? closeBtn : ''}
            {results.length && !this.state.collapsed ? results : ''}
        </div>;
    }

}


export default ArtistsSuggestions;