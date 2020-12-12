import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";

import { PlayerContext } from '../context';

import ReactPlayer from 'react-player';

import Playback from './Playback';
import Playlist from './Playlist';
import Search from './Search';
import Settings from './Settings';

class App extends React.Component { 
    static contextType = PlayerContext;    
    
    render() {
        const contextStore = this.context

        const player_ref = player => {
            this.ref = player;
        }
        
        return (
            <Fragment>
                <Router>
                    <main>
                        <nav>
                            <ul>
                                <li className="left">
                                    <Link to="/"><i className="medium material-icons">play_arrow</i></Link>
                                </li>
                                <li className="left">
                                    <Link to="/playlist"><i className="medium material-icons">playlist_play</i></Link>
                                </li>
                                <li className="left">
                                    <Link to="/search"><i className="medium material-icons">zoom_in</i></Link>
                                </li>
                                <li className="right">
                                    <Link to="/settings"><i className="medium material-icons">settings</i></Link>
                                </li>
                            </ul>
                        </nav>
                        <Switch>
                            <Route path='/' exact component={() => Playback(this.ref)} />
                            <Route path='/playlist' exact component={Playlist} />
                            <Route path='/search' exact component={Search} />
                            <Route path='/settings' exact component={Settings} />
                            <Redirect to="/" />
                        </Switch>
                    </main>
                </Router>

                <ReactPlayer
                    ref={player_ref}
                    width="1%"
                    height="1%"
                    className="hide"
                    loop={contextStore.playback_repeat}
                    url={contextStore.playback_url}
                    playing={contextStore.playback_playing}
                    volume={contextStore.playback_volume/100}
                    muted={contextStore.playback_mute}
                    onDuration={(duration) => contextStore.contextSet({name: "playback_duration", value: duration})}
                    onProgress={(duration) => contextStore.contextSet({name: "playback_progress", value: duration})}
                    // onEnded={() => contextStore.playNext(contextStore.play_next)}
                />
            </Fragment>
        );
    }
}

export default App;