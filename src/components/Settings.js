import React, { Fragment } from 'react';
import { PlayerConsumer } from '../context';

import { settingsItem } from './helper_components';
    
const Settings = () => {
    return (
        <PlayerConsumer>
            {
                (contextStore) => {
                    const {
                        settings_logarithmic_volume,
                        settings_play_on_start,
                        valueToggle
                    } = contextStore;

                    return (
                        <Fragment>
                            <div className="container">
                                {settingsItem({
                                    title: "Play on app start", 
                                    active: settings_play_on_start, 
                                    onClick: () => valueToggle("settings_play_on_start")
                                })}
            
                                {settingsItem({
                                    title: "Logarithmic volume control", 
                                    active: settings_logarithmic_volume, 
                                    onClick: () => valueToggle("settings_logarithmic_volume")
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