import React, { Fragment } from 'react';
import { PlayerConsumer } from '../context';

import { videoCard } from './helper_components';

const Playlist = () => {
    return (
        <PlayerConsumer>
            {
                (value) => {
                    const {
                        playlist,
                        startPlaylist, 
                        playlistRemove,
                        startShufflePlaylist
                    } = value;

                    return (
                        <Fragment>
                            <div className="card panel z-depth-2" style={{margin: "0", marginBottom: "5px", padding: "0"}}>
                                <div className="card-action" style={{margin: "0", padding: "10px"}}>
                                    <a onClick={startShufflePlaylist} className="center-align" style={{margin: "0", padding: "0"}}>
                                        <p className="center-align" style={{margin: "0", padding: "0"}}> 
                                            Shuffle Playlist
                                        </p>
                                    </a>
                                </div>
                            </div>

                            {/* <div className="divider" /> */}

                            <div className="scrollHide">
                                {
                                    playlist.map(item => videoCard(
                                        item, 
                                        false, 
                                        () => startPlaylist(item.url),  
                                        () => playlistRemove(item)
                                        ))
                                }
                            </div>
                        </Fragment>
                    );
                }
            }
        </PlayerConsumer>
    );
}

export default Playlist;