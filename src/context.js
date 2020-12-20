import React, { Component } from "react"
import { ipcRenderer } from 'electron';

const PlayerContext = React.createContext()

const PlayerProvider = PlayerContext.Provider
const PlayerConsumer = PlayerContext.Consumer

class MyContext extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playback_url: '',
      playback_volume: 100,
      playback_volume_dB: 0,
      playback_playing: false,
      playback_repeat: false,
      playback_shuffle: false,
      playback_duration: 0,
      playback_progress: {
        playedSeconds: 0,
        played: 0
      },
      playback_mute: false,
      playback_metadata: {},
      search_query: "",
      search_results: [],
      playlist: [],
      playback_playlist: [],
      play_from_playlist: true, 
      playlist_index: 0,
      settings_logarithmic_volume: true
    };

    this.playbackToggle.bind(this);
    this.playbackRepeatToggle.bind(this);
    this.playbackMuteToggle.bind(this);
    this.contextSet.bind(this);
    this.queryGetResults.bind(this);
    this.playNext.bind(this);
    this.playlistAppend.bind(this);
    this.playlistRemove.bind(this);
    this.volumeAdjust.bind(this);
    this.startPlaylist.bind(this);
    this.startSearchPlaylist.bind(this);
    this.playbackBack.bind(this);
  }

  componentDidMount() {
    this.setState({
      playback_volume: JSON.parse(localStorage.getItem('playback_volume')) || 100,
      playback_volume_dB: JSON.parse(localStorage.getItem('playback_volume_dB')) || 0,
      playback_repeat: JSON.parse(localStorage.getItem('playback_repeat')) || this.state.playback_repeat,
      playback_mute: JSON.parse(localStorage.getItem('playback_mute')) || this.state.playback_mute,
      playlist: JSON.parse(localStorage.getItem('playlist')) || [],
    });
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

  contextSet = (event) => {
    this.setState({
      [event.name]: event.value
    }, () => {
      localStorage.setItem(event.name, JSON.stringify(event.value));
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

  playNext = (forward = true) => {
      // console.log(this.state.playlist_index);

      let idx = (this.state.playlist_index >= this.state.playback_playlist.length) 
        ? 0 : this.state.playlist_index;

      // console.log(idx);

      this.setState({
        playback_url: this.state.playback_playlist[idx].url, 
        playback_playing: true,
        playlist_index: idx+1
      });
  }

  startPlaylist = (url) => {
    // Find index by url
    let idx = 0;
    for (let item of this.state.playlist){
      if(item.url === url) {
        break;
      } else {
        idx++;
      }
    }

    // Rotate playlist depending on the song that is played
    let playlist = this.state.playlist.slice(idx).concat(this.state.playlist.slice(0, idx));

    this.setState({
      playlist_index: 0,
      playback_playlist: playlist,
      play_from_playlist: true
    }, () => {
      this.playNext();
    });
  }

  startSearchPlaylist = (item) => {
    this.setState({
      playlist_index: 0,
      playback_playlist: item,
      play_from_playlist: false
    }, () => {
      this.playNext();
    })
  }

  playlistAppend = (item) => {
    let playlist_array = [...this.state.playlist, item];

    playlist_array.sort((a, b) => {
      var nameA = a.title.toUpperCase(); // ignore upper and lowercase
      var nameB = b.title.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1; //nameA comes first
      }
      if (nameA > nameB) {
        return 1; // nameB comes first
      }
      return 0;  // names must be equal
    });

    this.setState({
      playlist: playlist_array
    }, () => {
      localStorage.setItem('playlist', JSON.stringify(this.state.playlist));
      // console.log(this.state.playlist);
    });
  }

  playlistRemove = (info) => {
    const items = this.state.playlist.filter(item => item.videoId !== info.videoId);

    this.setState({ 
      playlist: items 
    }, () => {
      localStorage.setItem('playlist', JSON.stringify(this.state.playlist));
    });
  }

  volumeAdjust = (event) => {
    const volume_linear = 
      (this.state.settings_logarithmic_volume) 
        ? Math.round(Math.pow(10, (event.value/20.0))) 
        : event.value;
    const volume_db = 
      (this.state.settings_logarithmic_volume) 
        ? event.value 
        : Math.round(20*Math.log10(event.value));
    
    this.contextSet({name: "playback_volume", value: volume_linear});
    this.contextSet({name: "playback_volume_dB", value: volume_dB});
  }

  playbackBack = (ref) => {
    if(this.state.playback_progress.playedSeconds > 5){
      ref.seekTo(0);
    } else {
      const pl_len = this.state.playlist.length;
      const idx = (this.state.playlist_index + pl_len - 1) % (pl_len);

      this.setState({
        playlist_index: idx
      }, this.playNext());
    }
  }

  render() {
    return (
      <PlayerProvider 
        value={{
          ...this.state,
          playbackToggle: this.playbackToggle,
          contextSet: this.contextSet,
          queryGetResults: this.queryGetResults,
          playbackRepeatToggle: this.playbackRepeatToggle,
          playbackMuteToggle: this.playbackMuteToggle,
          playbackGetMetadata: this.playbackGetMetadata,
          playlistAppend: this.playlistAppend,
          playlistRemove: this.playlistRemove,
          volumeAdjust: this.volumeAdjust,
          startPlaylist: this.startPlaylist,
          playNext: this.playNext,
          startSearchPlaylist: this.startSearchPlaylist,
          playbackBack: this.playbackBack
        }}
      >
          {this.props.children}
      </PlayerProvider>
    )
  }
}

export { PlayerContext, PlayerConsumer, MyContext }