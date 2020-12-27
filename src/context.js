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
      playlist_loop: false,
      playback_shuffle: false,
      playback_duration: 0,
      playback_progress: {
        playedSeconds: 0,
        played: 0
      },
      playback_current: {
        title: ""
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
    this.playlistExists.bind(this);
    this.playlistLoopToggle.bind(this);
    this.playbackShuffleToggle.bind(this);
    this.playlistLogVolToggle.bind(this);
  }

  componentDidMount() {
    this.setState({
      playback_volume: JSON.parse(localStorage.getItem('playback_volume')) || 100,
      playback_volume_dB: JSON.parse(localStorage.getItem('playback_volume_dB')) || 0,
      playback_repeat: JSON.parse(localStorage.getItem('playback_repeat')) || this.state.playback_repeat,
      playback_mute: JSON.parse(localStorage.getItem('playback_mute')) || this.state.playback_mute,
      playlist: JSON.parse(localStorage.getItem('playlist')) || [],
      playback_repeat: JSON.parse(localStorage.getItem('playback_repeat')) || false,
      playback_shuffle: JSON.parse(localStorage.getItem('playback_shuffle')) || false,
      playback_mute: JSON.parse(localStorage.getItem('playback_mute')) || false,
      playlist_loop: JSON.parse(localStorage.getItem('playlist_loop')) || false,
    });

    ipcRenderer.on('control:playback', (event, info) => this.playbackToggle());
    ipcRenderer.on('control:next', (event, info) => this.playNext());
    ipcRenderer.on('control:back', (event, info) => this.playNext(false));
    ipcRenderer.on('control:mute', (event, info) => this.playbackMuteToggle());
  }

  playbackToggle = () => {
    // If nothing to play -> do nothing
    if(!this.state.playback_playlist.length) {
      return;
    }
    
    this.setState({
      playback_playing: !this.state.playback_playing
    });
  }

  playbackRepeatToggle = () => {
    this.setState({
      playback_repeat: !this.state.playback_repeat
    }, () => {
      localStorage.setItem("playback_repeat", JSON.stringify(this.state.playback_repeat));
    });
  }

  playbackShuffleToggle = () => {
    this.setState({
      playback_shuffle: !this.state.playback_shuffle
    }, () => {
      localStorage.setItem("playback_shuffle", JSON.stringify(this.state.playback_shuffle));
    });
  }

  playbackMuteToggle = () => {
    this.setState({
      playback_mute: !this.state.playback_mute
    }, () => {
      localStorage.setItem("playback_mute", JSON.stringify(this.state.playback_mute));
    });
  }

  playlistLoopToggle = () => {
    this.setState({
      playlist_loop: !this.state.playlist_loop
    }, () => {
      localStorage.setItem("playlist_loop", JSON.stringify(this.state.playlist_loop));
    });
  }

  playlistLogVolToggle = () => {
    this.setState({
      settings_logarithmic_volume: !this.state.settings_logarithmic_volume
    }, () => {
      localStorage.setItem(
        "settings_logarithmic_volume", 
        JSON.stringify(this.state.settings_logarithmic_volume)
      );
    });
  }

  contextSet = (event) => {
    this.setState({
      [event.name]: event.value
    }, () => {
      localStorage.setItem(event.name, JSON.stringify(event.value));
    });
  }

  playbackGetMetadata = (item) => {
    ipcRenderer.send('youtube-dl:metadata', item.url);

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
    // If nothing to play -> do nothing
    if(!this.state.playback_playlist.length) {
      return;
    }

    const pl_len = this.state.playback_playlist.length;
    let idx = (this.state.playlist_index % pl_len); 

    if(!forward){     
      // Roll index back by 2 (one song back + playlist_index offset of 1)
      idx = (this.state.playlist_index + 2*pl_len - 2) % (pl_len);
    }
            
    this.setState({
      playback_url: this.state.playback_playlist[idx].url, 
      playback_current: this.state.playback_playlist[idx],
      playback_playing: true,
      playlist_index: idx+1
    });
  }

  playlistExists = (info) => {
    const items = this.state.playlist.filter(item => item.videoId === info.videoId);

    // console.log(items);

    return (items.length) ? true : false;
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
    // let playlist = this.state.playlist.slice(idx).concat(this.state.playlist.slice(0, idx));

    this.setState({
      playlist_index: idx,
      playback_playlist: this.state.playlist,
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
    // Append playlist with the new item
    let playlist_array = [...this.state.playlist, item];

    // Sort alphabetically
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

    // Remove doubles from the playlist (just in case there are some)
    const unique_playlist = [];

    playlist_array.forEach((item) => {
      let flag = false;

      unique_playlist.forEach(element => {
        if(item.videoId === element.videoId){
          flag = true;
        }
      });

      if(!flag){
        unique_playlist.push(item);
      }
    });


    this.setState({
      playlist: unique_playlist
    }, () => {
      // Store in local storage
      localStorage.setItem('playlist', JSON.stringify(this.state.playlist));
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
        ? 100.0*Math.pow(10, (event.value/20.0)) 
        : event.value;
    const volume_dB = 
      (this.state.settings_logarithmic_volume) 
        ? event.value 
        : 20.0*Math.log10(event.value);

    // console.log(volume_linear);
    // console.log(volume_dB);
    
    this.contextSet({name: "playback_volume", value: volume_linear});
    this.contextSet({name: "playback_volume_dB", value: volume_dB});
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
          playlistExists: this.playlistExists,
          playlistLoopToggle: this.playlistLoopToggle,
          playbackShuffleToggle: this.playbackShuffleToggle,
          playlistLogVolToggle: this.playlistLogVolToggle
        }}
      >
          {this.props.children}
      </PlayerProvider>
    );
  }
}

export { PlayerContext, PlayerConsumer, MyContext }