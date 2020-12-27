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
                        playlistRemove
                    } = value;

                    return (
                        <Fragment>
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