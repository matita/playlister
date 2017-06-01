import React, { Component } from 'react';
import TasteDive from '../api/TasteDive.js';


class ArtistsSuggestions extends Component {

    constructor(props) {
        super(props);

        this.state = {
            results: [],
            artistNames: ''
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.artists.map(a => a.name).join(', ') !== this.state.artistNames)
            this.searchSimilar(nextProps.artists);
    }


    searchSimilar(artists) {
        if (!artists || !artists.length)
            return;

        var artistsNames = artists.map(a => a.name);
        this.setState({ artistNames: artistsNames.join(', ') });
        //TasteDive.searchSimilar(artistsNames, this.onSimilarFound.bind(this));
    }


    onSimilarFound(err, results) {
        if (err)
            return console.error('TasteDive API error', err);

        console.log('TasteDive results', results);
        this.setState({ results: results });
    }


    render() {
        return <div className="artists-suggestions"></div>;
    }

}


export default ArtistsSuggestions;