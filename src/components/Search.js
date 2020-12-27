import React, { Fragment } from 'react';
import { PlayerConsumer } from '../context';

import { videoCard, buttonHelper } from './helper_components';

const Search = () => {
    return (
        <PlayerConsumer>
            {
                (value) => {
                    const {
                        contextSet,
                        search_results,
                        queryGetResults,
                        playNext, 
                        playlistAppend, 
                        playlistExists
                    } = value;

                    return (
                        <Fragment>
                            {/* <div className="row"> */}
                                {/* <div className="col s12"> */}
                                    <div className="row" style={{display: "flex"}}>
                                        <div className="input-field col s8">
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
                                {/* </div> */}
                            {/* </div> */}

                            {search_results.map(item => {
                                if (!playlistExists(item)){
                                    return videoCard(item, true, () => playNext(item),  () => playlistAppend(item));
                                } else {
                                    return videoCard(item, false, () => playNext(item),  () => playlistRemove(item));
                                }
                            })}
                        </Fragment>
                    );
                }
            }
        </PlayerConsumer>
    );
}

export default Search;