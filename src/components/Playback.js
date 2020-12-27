import React, { Fragment } from 'react';

import { PlayerConsumer } from '../context';
import { buttonHelper, sec2timestamp } from './helper_components';

const Playback = (player_ref) => {
    
    return (
        <PlayerConsumer>
            {
                (context) => {
                    const { 
                        valueToggle,
                        playback_playing,
                        playback_repeat,
                        playback_volume,
                        playback_volume_dB,
                        playback_duration,
                        playback_progress,
                        playback_mute,
                        playNext,
                        volumeAdjust,
                        settings_logarithmic_volume,
                        playback_current,
                        playlist_loop,
                        playback_shuffle,
                    } = context;
                    
                    return (
                        <Fragment>
                            <div className="divider" />

                            <div className="row" style={{display: "flex", marginBottom: 0}}>
                                <div className="col s12">
                                    <p className="range-field">
                                        <input type="range" min="0" max={playback_duration}
                                            style={{marginBottom: 0}} 
                                            value={playback_progress.playedSeconds}                                        
                                            name="playback_progress"
                                            onChange={(e) => player_ref.seekTo(e.target.value)}
                                        />
                                    </p>
                                </div>
                            </div>

                            <div className="row" style={{paddingTop: 0, margin: 0}}>
                                <div className="col s4 left-align" style={{alignSelf: "center"}}>
                                    {sec2timestamp(playback_progress.playedSeconds)}
                                </div>

                                <div className="col s4" />

                                <div className="col s4 right-align" style={{alignSelf: "center"}}>
                                    {sec2timestamp(playback_duration)}
                                </div>
                            </div>

                            <div className="row" style={{display: "flex", margin: 0}}>
                                <div className="col s12">
                                    <p className="truncate center-align">
                                        {(playback_playing) ? playback_current.title : "Not playing"}
                                    </p>
                                </div>
                            </div>


                            <div className="row" style={{marginTop: '30px'}}>
                                <div className="col s4 right-align">
                                    {buttonHelper({
                                        icon: "repeat",
                                        size: "small",
                                        active: playback_repeat,
                                        onClick: () => valueToggle("playback_repeat")
                                    })}
                                </div>
                                <div className="col s4 center-align">
                                    {buttonHelper({
                                        icon: "loop",
                                        size: "small",
                                        active: playlist_loop,
                                        onClick: () => valueToggle("playlist_loop")
                                    })}
                                </div>
                                <div className="col s4 left-align">
                                    {buttonHelper({
                                        icon: "shuffle",
                                        size: "small",
                                        active: playback_shuffle,
                                        onClick: () => valueToggle("playback_shuffle")
                                    })}
                                </div>
                            </div>

                            <div className="row" style={{display: "flex", marginBottom:0}}>
                                <div className="col s4 right-align" style={{alignSelf: "center"}}>
                                    {buttonHelper({
                                        icon: "fast_rewind",
                                        size: "medium",
                                        active: true,
                                        // onClick: callPlayback
                                        onClick: () => {
                                            if(playback_progress.playedSeconds > 5) {
                                                player_ref.seekTo(0);
                                            } else {
                                                playNext(false);
                                            }
                                        }
                                    })}
                                </div>
                                <div className="col s4 center-align">
                                    {buttonHelper({
                                        icon: (playback_playing) ? "pause" : "play_arrow",
                                        size: "large",
                                        active: true,
                                        onClick: () => valueToggle("playback_playing")
                                    })}
                                </div>
                                <div className="col s4 left-align" style={{alignSelf: "center"}}>
                                    {buttonHelper({
                                        icon: "fast_forward",
                                        size: "medium",
                                        active: true,
                                        onClick: playNext
                                    })}
                                </div>
                            </div>

                            <div className="row" style={{
                                display: "flex", 
                                marginTop: "20px", 
                                marginBottom: 0
                            }}>
                                <div className="col s9 center-align">
                                    <p className="range-field">
                                        {
                                            (!settings_logarithmic_volume) ?
                                                <input type="range" min="0" max="100" 
                                                    style={{marginBottom: 0}}
                                                    value={playback_volume}                                        
                                                    name="playback_volume"
                                                    onChange={(e) => volumeAdjust(e.target)}
                                                />
                                            :
                                                <input type="range" min="-60" max="0" 
                                                    style={{marginBottom: 0}}
                                                    value={playback_volume_dB}                                        
                                                    name="playback_volume"
                                                    onChange={(e) => volumeAdjust(e.target)}
                                                />
                                        }
                                    </p>
                                </div>
                                <div className="col s3" style={{alignSelf: "center"}}>
                                    {buttonHelper({
                                        icon: (playback_mute) ? "volume_off" : "volume_up",
                                        size: "small",
                                        active: !playback_mute,
                                        onClick:  () => valueToggle("playback_mute")
                                    })}
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