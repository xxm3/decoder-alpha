import React, { useEffect, useState } from 'react';
import { instance } from '../../axios';
import { AppComponentProps } from '../../components/Route';
import { environment } from '../../environments/environment';
import {
    IonLabel,
    IonContent,
    IonButton,
    IonToggle,
    IonSelect,
    IonSelectOption,
} from '@ionic/react';
import {
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
} from '@material-ui/core';
import './ServerModule.scss';
import BgImage from '../../images/logo-transparent.png';
import usePersistentState from '../../hooks/usePersistentState';


const ServerModule: React.FC<AppComponentProps> = () => {
    /**
     * States & Variables
     */
    const [isMobile, setIsMobile] = useState(false);
    const [checked, setChecked] = useState(false);
    const [hairColor, setHairColor] = useState<string>('brown');
    const [age, setAge] = React.useState('');

    const handleChange = (event: any) => {
        setAge(event.target.value as string);
    };

    /**
     * Use Effects
     */
    useEffect(() => {
        if (window.innerWidth < 525) {
            setIsMobile(true);
        }
    }, [window.innerWidth]);

    const ModuleItem = () => {
        return (
            <Grid item xs={12} md={6} xl={4}>
                <div className="server-module-bg ">
                    <div className="flex flex-row justify-between w-full mt-6">
                        <div className="module-icon-wrapper ml-3">
                            <img src={require('../../images/me.png')} />
                        </div>
                        <IonToggle
                            checked={checked}
                            onIonChange={(e) => setChecked(e.detail.checked)}
                        />
                    </div>
                    <div className="flex flex-col mt-4">
                        <IonLabel className="ml-3 text-xl">
                            Reactopn Roll
                        </IonLabel>
                        <IonLabel className="ml-3 text-sm opacity-60 mt-2">
                            Reactopn Roll detail
                        </IonLabel>
                    </div>
                </div>
            </Grid>
        );
    };

    return (
        <>
            <IonLabel className="text-xl font-semibold  flex">
                Server Mangament
            </IonLabel>
            <div className="flex flex-row justify-center w-full mt-6">
                <Grid container spacing={4}>
                    <ModuleItem />
                    <ModuleItem />
                    <ModuleItem />
                </Grid>
            </div>
            <IonLabel className="text-xl font-semibold flex mt-8">
                Logging Channel
            </IonLabel>
            <Grid  spacing={4}>
                <Select
                    value={age}
                    onChange={handleChange}
                    style={{
                        width: '50%',
                        height: 50,
                        border: `1px solid rgba(171, 171, 171, 0.876)`,
                        borderRadius: '8px',
                        paddingLeft: '10px',
                        // color:'red'
                    }}
                >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </Grid>
        </>
    );
};

export default ServerModule;
