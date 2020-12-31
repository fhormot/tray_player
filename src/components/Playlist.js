import React, { Fragment } from 'react';
import { PlayerConsumer } from '../context';

import { videoCard } from './helper_components';

const Playlist = () => {
    return (
        <PlayerConsumer>
            {
                (contextStore) => {
                    const {
                        playlist,
                        startPlaylist, 
                        playlistRemove,
                        startShufflePlaylist
                    } = contextStore;

                    return (
                        <Fragment>
                            <div className="card panel z-depth-1" style={{margin: "0", marginBottom: "5px", padding: "0"}}>
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
                                    (playlist.length)
                                    ? playlist.map(item => videoCard(
                                        item, 
                                        false, 
                                        () => startPlaylist(item.url),  
                                        () => playlistRemove(item)
                                    ))
                                    : <h6 className="noCardText">
                                        The playlist is empty.
                                      </h6> 
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