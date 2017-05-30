import search from 'youtube-search';
import request from 'browser-request';
import durationToSeconds from '../utils/iso8601-seconds';

const YT_KEY = 'AIzaSyDyZVX8On7QglmGjrarAAsr8aLnoWp9Lck';
const BASE_URL = 'https://www.googleapis.com/youtube/v3/videos'

class YouTube {

  search(text, callback) {
    search(text, { maxResults: 5, type: 'video', key: YT_KEY }, (err, results) => {
      if (err)
        return callback(err);

      var ids = results.map(r => r.id);
      this.getDetails(ids, (err, result) => {
        if (err)
          return callback(err);

        result.items.forEach(this.mergeParts(results));
        callback(null, results);
      })
    });
  }


  getDetails(ids, callback) {
    var url = BASE_URL + '?id=' + ids.join(',') + '&part=contentDetails&key=' + YT_KEY
    request({ uri: url, json: true }, function (err, response, body) {
      callback(err, body)
    })
  }


  mergeParts(items) {
    return function (item) {
      var id = item.id
      for (var i = 0; i < items.length; i++) {
        if (items[i].id !== id)
          continue;

        items[i].url = 'https://www.youtube.com/watch?v=' + items[i].id;
        items[i].duration = durationToSeconds(item.contentDetails.duration);
        items[i].contentDetails = item.contentDetails
      }
    }
  }

}


export default new YouTube();