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
                        playNext, 
                        playlistRemove
                    } = value;

                    return (
                            <div className="container">
                                <p>Playlist</p>
                                {playlist.map(item => videoCard(item, false, () => playNext(item.url),  () => playlistRemove(item)))}
                            </div>
                    );
                }
            }
        </PlayerConsumer>
    );      
}

export default Playlist;