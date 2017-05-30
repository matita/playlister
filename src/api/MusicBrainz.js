import request from 'browser-request';
import encodeParams from '../utils/encode-params';


const BASE_URI = '//musicbrainz.org/ws/2/';


class MusicBrainz {

  api(endpoint, params, callback, timeoutMs, retry) {
    
    params = params || {};
    params.fmt = 'json';

    if (!timeoutMs)
      timeoutMs = 200;

    if (!retry)
      retry = 0;

    var encodedParams = encodeParams(params);
    var uri = BASE_URI + endpoint + (encodedParams ? '?' + encodedParams : '');
    
    return request({ uri: uri, json: true }, (err, response, body) => {
      // sometimes musicbrainz fails
      // try to reissue the request for some times
      // delaying at every retry
      if (err && retry < 5)
        setTimeout(() => this.api(endpoint, params, callback, timeoutMs + 100, retry + 1), timeoutMs);
      else
        callback(err, body);
    });
  }

  
  searchArtists(query, callback) {
    return this.api('artist', { query: query, limit: 5 }, callback);
  }


  searchRecordings(query, params, callback) {
    params.query = query
    this.api('recording', params, callback)
  }

}


export default new MusicBrainz();