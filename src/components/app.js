import React from 'react';

import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";

import Playback from './Playback';
import Playlist from './Playlist';
import Search from './Search';
import Settings from './Settings';

const App = () => {
    return (
        <Router>
            <main>
                <nav>
                    <ul>
                        <li className="left"><Link to="/"><i class="medium material-icons">play_arrow</i></Link></li>
                        <li className="left"><Link to="/playlist"><i class="medium material-icons">playlist_play</i></Link></li>
                        <li className="left"><Link to="/search"><i class="medium material-icons">zoom_in</i></Link></li>
                        <li className="right"><Link to="/settings"><i class="medium material-icons">settings</i></Link></li>
                    </ul>
                </nav>
                <Switch>
                    <Route path='/' exact component={Playback} />
                    <Route path='/playlist' exact component={Playlist} />
                    <Route path='/search' exact component={Search} />
                    <Route path='/settings' exact component={Settings} />
                    <Redirect to="/" />
                </Switch>
            </main>
        </Router>
    )
}

export default App;