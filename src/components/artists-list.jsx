var React = require('react')

module.exports = React.createClass({
  render: function () {
    var me = this
    var artists = this.props.artists.length ? this.props.artists.map(function (artist, i) {
      return (<div className="artists-list-item" key={i}>
        {artist.name}
        <button className="artist-list-remove" onClick={function () { me.props.onRemove(artist) }}>Remove</button>
      </div>)
    }) : 'No artist selected'

    return (<div className="artists-list">
      Playlist with: {artists}
    </div>)
  }
})