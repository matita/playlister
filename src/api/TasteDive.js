import request from 'browser-request';
import encodeParams from '../utils/encode-params';

const BASE_URI = 'https://tastedive.com/api/similar';
const API_KEY = '258301-Playlist-3PQ1B0S4';

class TasteDive {

    searchSimilar(artistNames, callback) {
        var callbackName = ('callback' + Math.random()).replace('.', '');

        var params = {
            q: artistNames.map(n => 'band:' + n).join(', '),
            type: 'music',
            k: API_KEY,
            callback: callbackName
        };

        var encodedParams = encodeParams(params);
        var uri = BASE_URI + (encodedParams ? '?' + encodedParams : '');

        window[callbackName] = (results) => {
            delete window[callbackName];
        }

        var s = document.createElement('script');
        s.onerror = (e) => {
            callback(e);
            delete window[callbackName];
        };
        s.src = uri;
        document.body.appendChild(s);

    }

}


export default new TasteDive();