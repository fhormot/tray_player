import React, { Fragment } from 'react';
import { PlayerConsumer } from '../context';

import { settingsItem } from './helper_components';
    
const Settings = () => {
    return (
        <PlayerConsumer>
            {
                (context) => {
                    const {
                        settings_logarithmic_volume,
                        playlistLogVolToggle
                    } = context;

                    return (
                        <Fragment>
                            <div className="container">
            
                                {settingsItem({
                                    title: "Logarithmic volume control", 
                                    active: settings_logarithmic_volume, 
                                    onClick: playlistLogVolToggle
                                })}
        
                            </div>
                        </Fragment>
                    );
                }
            }
        </PlayerConsumer>
    );
}

export default Settings;