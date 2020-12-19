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
                            <div className="container">
                                <p>Playlist</p>
                                {playlist.map(item => videoCard(item, false, () => startPlaylist(item.url),  (info) => playlistRemove(info)))}
                            </div>
                    );
                }
            }
        </PlayerConsumer>
    );
}

export default Playlist;