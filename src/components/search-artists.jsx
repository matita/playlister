var React = require('react')
var musicbrainz = require('../utils/musicbrainz')
var Artist = require('../models/artist')
var HotKeys = require('react-hotkeys').HotKeys

module.exports = React.createClass({

  getInitialState: function () {
    return {
      searchText: '',
      lastSearchText: '',
      results: [],
      selectedIndex: -1
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
        searching: true,
        selectedIndex: -1
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

  selectUp: function () {
    this.setState({
      selectedIndex: (this.state.selectedIndex - 1) % this.state.results.length
    })
    return false
  },

  selectDown: function () {
    this.setState({
      selectedIndex: (this.state.selectedIndex + 1) % this.state.results.length
    })
    return false
  },

  selectItem: function () {
    if (this.state.selectedIndex >= 0) {
      var artist = this.state.results[this.state.selectedIndex]
      if (artist)
        this.handleItemClick(artist)
    }
  },

  render: function () {
    var me = this
    var keysHandlers = {
      'togglePlay': function () {  },
      'up': me.selectUp,
      'down': me.selectDown,
      'enter': me.selectItem,
      'esc': function () { me.setState(me.getInitialState()) }
    }

    var results = this.state.searching ? <i>Loading</i> : this.state.results.length === 0 ? '' : this.state.results.map(function (artist, i) {
      var disambiguation = artist.disambiguation ? ' - ' + artist.disambiguation : ''
      var className = 'search-artists-item'
      if (me.state.selectedIndex === i)
        className += ' selected'

      return (<li key={i} className={className} onClick={me.handleItemClick.bind(me, artist)}>
          {artist.name}{disambiguation}
        </li>)
    })

    return (
      <HotKeys handlers={keysHandlers}>
        <div className="search-artists">
          <div className="search-artists-container">
            <input type="search" placeholder="Add artist" value={this.state.searchText} onInput={this.handleInput} onKeyPress={this.handleKeyPress} />
          </div>
          <ul className="search-artists-results">
            {results}
          </ul>
        </div>
      </HotKeys>
    )
  }
})