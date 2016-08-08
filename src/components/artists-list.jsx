var React = require('react')

module.exports = React.createClass({
  removeArtist: function (artist) {
    var me = this
    return function () {
      me.props.onRemove(artist)
    }
  },

  render: function () {
    var me = this
    var artists = this.props.artists.length ? this.props.artists.map(function (artist, i) {
      return (<div className="artists-list-item" key={i}>
        {artist.name}
        <button className="artists-list-remove" onClick={me.removeArtist(artist)}>&times;</button>
      </div>)
    }) : ''

    return (<div className="artists-list">
      {artists}
    </div>)
  }
})