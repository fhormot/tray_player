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
                <div className="row margin-B5px z-depth-1">
                    <div className="card margin-0">
                        <div className="card-image col s4 cardImg padding-0">
                            <div className="hoverCtrl selfCenter">
                                <a onClick={onPlayClick}>
                                    <img src={thumbnail} className="selfCenter"/>
                                </a>
                            </div>
                            <div className="hoverHide">
                                    <a style={{color: 'white'}} onClick={onPlayClick}>
                                        <i className="medium material-icons center-align iconImg margin-0 padding-0">
                                            play_arrow
                                        </i>
                                    </a>
                            </div>
                        </div>

                        <div className="card-content col s8 padding-A5px">
                                <p className="truncate">{title}</p> 

                            <div className="card-action center-align margin-0 padding-T5px" 
                                    style={{display: 'flex'}}>
                                <a 
                                    onClick={onAddClick} 
                                    className="margin-0 padding-0 selfCenter"
                                >
                                    {(playlistAdd) ? "Add" : "Remove"}
                                </a>
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
