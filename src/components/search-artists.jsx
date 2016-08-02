var React = require('react')
var musicbrainz = require('../utils/musicbrainz')
var Artist = require('../models/artist')

module.exports = React.createClass({

  getInitialState: function () {
    return {
      searchText: '',
      lastSearchText: '',
      results: []
    }
  },

  search: function () {
    var me = this

    if (me.state.searching)
      return

    if (me.searchTimeoutId) {
      clearTimeout(me.searchTimeoutId)
      delete me.searchTimeoutId
    }

    if (!me.state.searchText || me.state.lastSearchText == me.state.searchText)
      return;

    me.searchTimeoutId = setTimeout(function () {
      delete me.searchTimeoutId

      if (!me.state.searchText || me.state.lastSearchText == me.state.searchText)
        return;

      me.setState({ 
        searching: true
      })

      var searchText = me.state.searchText

      musicbrainz.searchArtists(searchText, function (err, result) {
        if (err || !result || !result.artists) {
          me.setState({ searching: false })
          return me.search()
        }

        me.setState({
          searching: false,
          results: result && result.artists.map(Artist) || me.state.results,
          lastSearchText: searchText,
          error: err
        })
        me.search()
      })
    }, 250)
  },

  handleInput: function (ev) {
    this.setState({
      searchText: ev.target.value
    })
    this.search()
  },

  handleKeyPress: function (ev) {
    /*if (ev.which == 13)
      this.search()*/
  },

  handleItemClick: function (artist) {
    this.props.onArtistClicked(artist)
    this.setState(this.getInitialState())
  },

  render: function () {
    var me = this

    var results = this.state.results.length === 0 ? '' : this.state.results.map(function (artist, i) {
      var disambiguation = artist.disambiguation ? ' - ' + artist.disambiguation : ''

      return (<li className="search-artist-item" key={i} onClick={me.handleItemClick.bind(me, artist)}>
        {artist.name}{disambiguation}
      </li>)
    })

    var resultText = this.state.lastSearchText ? 'Artists matching ' + this.state.lastSearchText : '---'

    return (
      <div className="search-artists">
        <div className="search-artists-container">
          <input type="search" placeholder="Add artist" value={this.state.searchText} onInput={this.handleInput} onKeyPress={this.handleKeyPress} />
        </div>
        <ul className="search-artists-results">
          {results}
        </ul>
      </div>
    )
  }
})