import React, { Component } from "react"
import { ipcRenderer } from 'electron';

const PlayerContext = React.createContext()

const PlayerProvider = PlayerContext.Provider
const PlayerConsumer = PlayerContext.Consumer

class MyContext extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playback_url: 'https://www.youtube.com/watch?v=9Gj47G2e1Jc',
      playback_volume: 100,
      playback_playing: false,
      playback_repeat: false,
      playback_duration: 0,
      playback_progress: {
        playedSeconds: 0,
        played: 0
      },
      playback_mute: false,
      playback_metadata: {},
      search_query: "plastic love",
      search_results: [],
      playlist: []
    };

    this.playbackToggle.bind(this);
    this.playbackRepeatToggle.bind(this);
    this.playbackMuteToggle.bind(this);
    this.playbackVolume.bind(this);
    this.contextSet.bind(this);
    this.queryGetResults.bind(this);
    this.playNext.bind(this);
    this.playlistAppend(this);
    this.playlistRemove(this);
  }

  playbackToggle = () => {
    this.setState({
      playback_playing: !this.state.playback_playing
    });
  }

  playbackRepeatToggle = () => {
    this.setState({
      playback_repeat: !this.state.playback_repeat
    });
  }

  playbackMuteToggle = () => {
    this.setState({
      playback_mute: !this.state.playback_mute
    });
  }

  playbackVolume = (e) => {
    this.setState({
      playback_volume: e.target.value
    });
  }

  contextSet = (event) => {
    this.setState({
      [event.name]: event.value
    });
  }

  playbackGetMetadata = () => {
    ipcRenderer.send('youtube-dl:metadata', this.state.playback_url);

    ipcRenderer.on('youtube-dl:metadata', (event, info) => {
      console.log(info);
      this.setState({
        playback_metadata: info
      });
    });
  }

  queryGetResults = () => {
    if(this.state.search_query){
      ipcRenderer.send('search:query', this.state.search_query);

      ipcRenderer.on('search:query', (event, info) => {
        // console.log(info);
        this.setState({
          search_results: info
        })
      });
    }
  }

  playNext = (url) => {
    // console.log(url);
    this.setState({
      playback_url: url, 
      playback_playing: true
    })
  }

  playlistAppend = (item) => {
    this.setState({
      playlist: [...this.state.playlist, item]
    });
  }

  playlistRemove = (item) => {
    const items = this.state.playlist.filter(item => item.videoId !== item.videoId);
    this.setState({ 
      playlist: items 
    });
  }

  render() {
    return (
      <PlayerProvider 
        value={{
          ...this.state,
          playbackToggle: this.playbackToggle,
          playbackVolume: this.playbackVolume,
          contextSet: this.contextSet,
          queryGetResults: this.queryGetResults,
          playbackRepeatToggle: this.playbackRepeatToggle,
          playbackMuteToggle: this.playbackMuteToggle,
          playbackGetMetadata: this.playbackGetMetadata,
          playNext: this.playNext,
          playlistAppend: this.playlistAppend,
          playlistRemove: this.playlistRemove
        }}
      >
          {this.props.children}
      </PlayerProvider>
    )
  }
}

export { PlayerContext, PlayerConsumer, MyContext }