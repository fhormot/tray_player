import React, { Fragment } from 'react';
import { render } from 'react-dom';

import { Redirect } from "react-router-dom";

export function buttonHelper(config) {
    const icon = config.icon || 'update';
    const size = config.size || 'medium';
    const onClick = config.onClick;
    const active = (!config.active) ? "" : "darken-2"
    const name = config.name || "button";
    const xtraStyles = config.xtraStyles || "";

    return (
        <Fragment>
            <a
                className={`btn-floating ${xtraStyles} btn-${size} waves-effect waves-light grey ${active}`}
                onClick={onClick}
                name={name}
            >
                <i className="material-icons" style={{margin: "0"}}>{icon}</i>
            </a>
        </Fragment>
    );
}

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

export function sec2timestamp(input_seconds) {
    const hours = (Math.floor(input_seconds/36000))? zeroPad(Math.floor(input_seconds/3600), 2) : "";
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
                <div className="row" style={{margin: "0", marginBottom: "5px"}}>
                    <div className="card" style={{margin: "0"}}>
                        <div className="row" style={{margin: "0"}}>
                            <div className="card-image col s4 cardImg" style={{padding: "0", backgroundColor: 'black'}}>
                                <div className="hoverCtrl">
                                    <a onClick={onPlayClick}>
                                        <img src={thumbnail} style={{alignSelf: 'center'}} />
                                    </a>
                                </div>
                                <div className="hoverHide">
                                        <a style={{color: 'white'}} onClick={onPlayClick}>
                                            <i className="medium material-icons center-align"
                                                style={{margin: "0", padding: "0"}}
                                            >
                                                play_arrow
                                            </i>
                                        </a>
                                </div>
                            </div>
                            <div className="card-content col s8" style={{padding: "3px"}}>
                                    <p className="truncate">{title}</p> 

                                <div className="card-action" style={{padding: "3px", margin: "0"}}>
                                    <a 
                                        onClick={onAddClick} 
                                        style={{padding: "3px", margin: "0"}}
                                    >
                                        {(playlistAdd) ? "Add" : "Remove"}
                                    </a>
                                </div>
                            </div>
                        </div>                            
                    </div>
                </div>
            </Fragment>
        );
    }
}

export function settingsItem(config) {
    return (
        <div className="row" style={{display: "flex", marginBottom: "0"}}>
            <div className="col s8 left-align">
                <p>
                    {config.title}
                </p>
            </div>
            <div 
                className="switch col s4 center-align" 
                style={{alignSelf: "center"}}
            >
                <label>
                    {""}
                    <input 
                        type="checkbox" 
                        checked={config.active} 
                        onClick={config.onClick} 
                    />
                    <span className="lever" />
                    {""}
                </label>
            </div>
        </div>
    );
}
