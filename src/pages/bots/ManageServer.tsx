import React, { useEffect, useState } from 'react';
import { instance } from '../../axios';
import { AppComponentProps } from '../../components/Route';
import { environment } from '../../environments/environment';
import { IonLabel, IonContent, IonButton } from '@ionic/react';
import { Grid } from '@material-ui/core';
import './ManageServer.scss';
import BgImage from '../../images/logo-transparent.png';

const ManageServer: React.FC<AppComponentProps> = () => {
    /**
     * States & Variables
     */
    const [isMobile, setIsMobile] = useState(false);

    /**
     * Use Effects
     */
    useEffect(() => {
        if (window.innerWidth < 525) {
            setIsMobile(true);
        }
    }, [window.innerWidth]);

    const ServerProfile = () => {
        return (
            <Grid item xs={12} md={6} xl={4}>
                <div className="bg-image-wrapper"style={{backgroundImage: `url(${BgImage})`,}}>
                    <div className="server-profile-bg">
                        <div className='server-logo-wrapper'>
                            <img src={require('../../images/me.png')} className='server-profile-img' ></img>
                        </div>
                    </div>
                </div>
                <div className='flex flex-row justify-between w-full mt-4'>
                    <div className='flex flex-col justify-between'>
                        <span className='font-bold text-xl tracking-wider'>Server name</span>
                        <span className='mt-2 text-slate-500'>user role</span>
                    </div>
                    <div>
                        <IonButton className='h-14 w-24 text-lg' >Go</IonButton>
                    </div>
                </div>
            </Grid>
        );
    };

    return (
        <>
            <IonLabel className="text-5xl font-semibold justify-center flex">
                Select Server
            </IonLabel>
            <div className="flex flex-row justify-center w-full mt-8">
                <Grid container spacing={4} className="flex justify-self-center ">
                    <ServerProfile />
                    <ServerProfile />
                    <ServerProfile />
                </Grid>
            </div>
        </>
    );
};

export default ManageServer;
