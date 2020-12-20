import React, { Fragment } from 'react';

import PlayerContext from '../context';

export function buttonHelper(config) {
    const icon = config.icon || 'update';
    const size = config.size || 'medium';
    const onClick = config.onClick;
    const active = (config.active) ? "" : "darken-2"
    const name = config.name || "button";
    const xtraStyles = config.xtraStyles || "";

    return (
        <Fragment>
            <a
                className={`btn-floating ${xtraStyles} btn-${size} waves-effect waves-light grey ${active}`}
                onClick={onClick}
                name={name}
            >
                <i className="material-icons">{icon}</i>
            </a>
        </Fragment>
    );
}

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

export function sec2timestamp(input_seconds) {
    const hours = (input_seconds/3600) ? zeroPad(Math.floor(input_seconds/3600), 2) : "";
    const minutes = zeroPad(Math.floor((input_seconds%3600)/60), 2);
    const seconds = zeroPad(Math.floor(input_seconds%60), 2);

    return(
        <p style={{marginTop: 0, marginBottom: 0}}>
            {hours}{(hours) ? ":" : ""}{minutes}:{seconds}
        </p>
    );
}

export function videoCard(info, playlistAdd, onPlayClick, onAddClick) {
    // console.log(info);
    const videoId = info.videoId;
    if (videoId){
        const thumbnail = info.thumbnail || "";
        const title = info.title || "";
        const duration = (info.duration) ? info.duration.timestamp : "";
        const type = info.type;
        
        return (
            <Fragment key={videoId}>
                <div className="row">
                    {/* <div className="col s12"> */}
                        <div className="card">
                            <div className="row">
                                <div className="card-image col s4">
                                        <img src={thumbnail} />
                                </div>
                                <div className="card-content col s8" style={{padding: "3px"}}>
                                    <p className="truncate">{title}</p>

                                    {buttonHelper({
                                        icon: "play_arrow",
                                        size: "small",
                                        xtraStyles: "halfway-fab",
                                        onClick: onPlayClick
                                    })}
                                </div>
                            </div>
                            
                            <div className="card-action">
                                <a href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onAddClick();
                                    }}
                                    >
                                    {(playlistAdd) ? "Add to playlist" : "Remove"}
                                </a>
                            </div>
                            
                        </div>
                    {/* </div> */}
                </div>
            </Fragment>
        );
    }
}



