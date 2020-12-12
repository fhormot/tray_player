import React, { Fragment } from 'react';

import { PlayerConsumer } from '../context';
import { buttonHelper, sec2timestamp } from './helper_components';

const Playback = (player_ref) => {
    
    return (
        <PlayerConsumer>
            {
                (value) => {
                    const { 
                        playback_playing,
                        playback_repeat,
                        playback_volume,
                        playback_duration,
                        playback_progress,
                        playback_mute,
                        playbackToggle, 
                        playbackRepeatToggle, 
                        contextSet, 
                        playbackMuteToggle,
                        playback_metadata
                    } = value;

                    // console.log(player_ref);
                    return (
                        <Fragment>
                            <div className="divider" />

                            <div className="container">
                                <div className="row" style={{display: "flex"}}>
                                    <div className="col s9">
                                        <p className="range-field">
                                            <input type="range" min="0" max={playback_duration} 
                                                value={playback_progress.playedSeconds}                                        
                                                name="playback_progress"
                                                onChange={(e) => player_ref.seekTo(e.target.value)}
                                            />
                                        </p>
                                    </div>
                                    <div className="col s3" style={{alignSelf: "center"}}>
                                    {(playback_playing) ? sec2timestamp(playback_progress.playedSeconds) : "00:00"}
                                    </div>
                                </div>

                                <div className="row" style={{display: "flex"}}>
                                    <div className="col s12">
                                        <p className="truncate">
                                            {(playback_metadata.title) ? playback_metadata.title : " "}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="divider" />

                            <div className="section">
                                <div className="container">
                                    <div className="row">
                                        <div className="col s4 right-align">
                                            {buttonHelper({
                                                icon: "repeat",
                                                size: "small",
                                                active: {playback_repeat},
                                                onClick: playbackRepeatToggle
                                            })}
                                        </div>
                                        <div className="col s4 center-align">
                                            {buttonHelper({
                                                icon: "loop",
                                                size: "small"
                                            })}
                                        </div>
                                        <div className="col s4 left-align">
                                            {buttonHelper({
                                                icon: "shuffle",
                                                size: "small"
                                            })}
                                        </div>
                                    </div>

                                    <div className="row" style={{display: "flex"}}>
                                        <div className="col s4 right-align" style={{alignSelf: "center"}}>
                                            {buttonHelper({
                                                icon: "fast_rewind",
                                                size: "medium"
                                            })}
                                        </div>
                                        <div className="col s4 center-align">
                                            {buttonHelper({
                                                icon: (playback_playing) ? "pause" : "play_arrow",
                                                size: "large",
                                                onClick: playbackToggle
                                            })}
                                        </div>
                                        <div className="col s4 left-align" style={{alignSelf: "center"}}>
                                            {buttonHelper({
                                                icon: "fast_forward",
                                                size: "medium"
                                            })}
                                        </div>
                                    </div>

                                    <div className="row" style={{display: "flex"}}>
                                        <div className="col s9 center-align">
                                            <p className="range-field">
                                                <input type="range" min="0" max="100" 
                                                    value={playback_volume}                                        
                                                    name="playback_volume"
                                                    onChange={(e) => contextSet(e.target)}
                                                />
                                            </p>
                                        </div>
                                        <div className="col s3" style={{alignSelf: "center"}}>
                                            {buttonHelper({
                                                icon: (playback_mute) ? "volume_off" : "volume_up",
                                                size: "small",
                                                active: {playback_mute},
                                                onClick: playbackMuteToggle
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    );
                }
            }
        </PlayerConsumer>
    );
};

export default Playback;