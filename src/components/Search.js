import React, { Fragment } from 'react';
import { PlayerConsumer } from '../context';

import { videoCard, buttonHelper } from './helper_components';

const Search = () => {
    return (
        <PlayerConsumer>
            {
                (contextStore) => {
                    const {
                        contextSet,
                        search_results,
                        queryGetResults,
                        playNext, 
                        playlistAppend, 
                        playlistExists
                    } = contextStore;

                    return (
                        <Fragment>
                            <div className="row z-depth-1" style={{display: "flex", margin: "0", marginBottom: "5px"}}>
                                <div className="input-field col s8" style={{margin: "0"}}>
                                    <input 
                                        autoFocus
                                        placeholder="Search" 
                                        type="text" 
                                        className="validate" 
                                        name="search_query"
                                        onChange={(e) => contextSet(e.target)}
                                        onKeyPress={(e) => {
                                            if(e.key === 'Enter'){
                                                queryGetResults();
                                            }
                                        }}
                                    />
                                </div>

                                <div className="col s4 center-align" style={{alignSelf: "center"}}>
                                    {buttonHelper({
                                        icon: "search",
                                        size: "small",
                                        active: true,
                                        onClick: queryGetResults
                                    })}
                                </div>
                            </div>

                            { 
                                (search_results.length)
                                    ? search_results.map(item => {
                                        if (!playlistExists(item)){
                                            return videoCard(item, true, () => playNext(item),  () => playlistAppend(item));
                                        } else {
                                            return videoCard(item, false, () => playNext(item),  () => playlistRemove(item));
                                        }
                                    })
                                    : <h6 className="noCardText">
                                        Type your search query into the search bar.
                                      </h6> 
                            }
                        </Fragment>
                    );
                }
            }
        </PlayerConsumer>
    );
}

export default Search;