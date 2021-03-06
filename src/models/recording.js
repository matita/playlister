import YouTube from '../api/YouTube';

class Recording {

  constructor(props) {

    this.id = props.id;
    this.title = props.title;
    this.length = props.length;

  }

  getSearchText(text) {
    return text
      .replace(/\W/g, ' ')
      .replace(/\s+/g, ' ')
      .toLowerCase();
  }


  searchSources(callback) {
    if (!this.searchText)
      this.searchText = this.getSearchText(this.artistName + ' ' + this.title);
    
    YouTube.search(this.searchText, (err, sources) => {
      if (err)
        return callback(err);

      var words = this.searchText.toLowerCase().split(/\W+/g);
      this.sources = sources
        .filter(this.matchAllWords(words))
        .filter(this.isDurationAcceptable, this);
      this.sources.forEach(s => this.applyScore(s));
      this.sources.sort((s1, s2) => s2.score - s1.score);
      callback(null, this.sources);
    });
  }


  getDurationDelta(v) {
    var videoDuration = v.duration * 1000
    return Math.abs(videoDuration - this.length)
  }


  matchAllWords(words) {
    return function (source) {
      const sourceTitle = source.title.toLowerCase()
      const sourceDescription = source.description.toLowerCase();
      const sourceText = sourceTitle + ' ' + sourceDescription;

      for (var i = 0; i < words.length; i++) {
        var word = words[i];
        if (sourceText.indexOf(word) === -1)
          return false
      }
      return true
    }
  }

  isDurationAcceptable(source) {
    const videoDuration = source.duration * 1000;
    return videoDuration >= this.length * 0.75 && videoDuration < this.length * 1.5;
  }


  applyScore(source) {
    var sourceTitle = source.title.toLowerCase();
    var recordingTitle = this.title.toLowerCase();

    var sourceHasLyrics = sourceTitle.indexOf('lyrics') !== -1;
    var recordingHasLyrics = recordingTitle.indexOf('lyrics') !== -1;
    var lyricsScore = sourceHasLyrics && !recordingHasLyrics ? 100 : 0;

    var sourceIsLive = sourceTitle.indexOf('live') !== -1;
    var recordingIsLive = recordingTitle.indexOf('live') !== -1;
    var liveScore = sourceIsLive && !recordingIsLive ? -100 : 0;

    var sourceIsRemix = sourceTitle.indexOf('remix') !== -1;
    var recordingIsRemix = recordingTitle.indexOf('remix') !== -1;
    var remixScore = sourceIsRemix && !recordingIsRemix ? -100 : 0;

    var durationDelta = this.getDurationDelta(source) / 1000;
    var durationScore = isNaN(this.length) ? 0 : 50 / (durationDelta || 1);

    source.score = lyricsScore + liveScore + durationScore + remixScore;
  }

}


export default Recording;