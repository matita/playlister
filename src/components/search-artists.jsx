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
      selectedIndex: -1,
      hasFocus: false
    }
  },

  componentDidMount: function () {
    this.focusIfNeeded()
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (prevProps.focused != this.props.focused)
      this.focusIfNeeded()
  },

  focusIfNeeded: function () {
    if (this.props.focused)
      this.refs.input.focus()
    else
      this.refs.input.blur()
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

  handleFocus: function () {
    this.setState({ hasFocus: true })
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout)
      this.blurTimeout = 0
    }
  },

  handleBlur: function () {
    var me = this
    me.blurTimeout = setTimeout(function () {
      me.blurTimeout = 0
      me.setState({ hasFocus: false })
    }, 250)
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
      var disambiguation = artist.disambiguation ? artist.disambiguation : ''
      var className = 'search-artists-item'
      if (me.state.selectedIndex === i)
        className += ' selected'

      return (<li key={i} className={className} onClick={me.handleItemClick.bind(me, artist)}>
          <span className="search-artists-item-name">{artist.name}</span>
          <span className="search-artists-item-disambiguation">{disambiguation}</span>
        </li>)
    })

    var resultsWrapper = (this.state.hasFocus && this.state.searchText && this.state.results.length ? <ul className="search-artists-results">
      {results}
    </ul> : '')

    return (
      <HotKeys handlers={keysHandlers}>
        <div className="search-artists">
          <h2 className="search-artists-prompt">Which artist do you want to listen to?</h2>
          <div className="search-artists-container">
            <input 
              ref="input" 
              placeholder="artist name"
              value={this.state.searchText}
              onInput={this.handleInput}
              onKeyPress={this.handleKeyPress}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur} />
          </div>
          {resultsWrapper}
        </div>
      </HotKeys>
    )
  }
})