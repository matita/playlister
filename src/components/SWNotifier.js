import React, { Component } from 'react';


class SWNotifier extends Component {

  componentDidMount() {
    if (!navigator.serviceWorker)
      return;

    
  }


  onMessageReceived(evt) {
    var message = JSON.parse(evt.data);
    console.log('onMessageReceived', message);
  }

  render() {
    return <div style={{display: 'none'}}></div>
  }

}


export default SWNotifier;