import React, { useEffect, useState } from 'react';
import { instance } from '../../axios';
import { AppComponentProps } from '../../components/Route';
import { environment } from '../../environments/environment';
import { IonLabel, IonContent, IonButton, useIonToast } from '@ionic/react';
import { Backdrop, CircularProgress, Grid } from '@material-ui/core';
import './ManageServer.scss';
import BgImage from '../../images/logo-transparent.png';
import { useHistory, useLocation } from 'react-router';
import Loader from '../../components/Loader';

interface Server {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: string;
    features: [];
}

const ManageServer: React.FC<AppComponentProps> = () => {
    let history = useHistory();
    /**
     * States & Variables
     */
    const [isMobile, setIsMobile] = useState(false);
    const [servers, setServers] = useState<Server[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [present, dismiss] = useIonToast();

    /**
     * Use Effects
     */
    useEffect(() => {
        if(!localStorage.getItem('role')){
            history.push('/')
            return
        }

        if (window.innerWidth < 525) {
            setIsMobile(true);
        }
    }, [window.innerWidth]);

    useEffect(() => {
        let serverList: any = localStorage.getItem('servers');
        console.log('serverList', JSON.parse(serverList));
        if (serverList) {
            setServers(JSON.parse(serverList));
        }
    }, []);

    let storeGuild = (server: Server) => {
        setIsLoading(true);
        instance
            .post(
                `/guilds/${server.id}`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            .then(({ data }) => {
                history.push({
                    pathname: '/servermodule',
                    state: { server: server },
                });
            })
            .catch((error:any) => {
                console.log('error', error);
                    let msg = '';
                    if (error && error.response) {
                        msg = String(error.response.data.body);
                    } else {
                        msg = 'Unable to connect. Please try again later';
                    }
                    present({
                        message: msg,
                        color: 'danger',
                        duration: 5000,
                        buttons: [{ text: 'X', handler: () => dismiss() }],
                    });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <>
            <Backdrop
                style={{
                    color: '#fff',
                    zIndex: 1000,
                }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {/*  */}
            <IonLabel className="text-5xl font-semibold justify-center flex">
                Select Server
            </IonLabel>
            <div className="flex flex-row justify-center w-full mt-8">
                <Grid
                    container
                    spacing={4}
                    className="flex justify-self-center "
                >
                    {servers.map((server: Server, index: number) => {
                        if (server.owner) {
                            return (
                                <Grid item xs={12} md={6} xl={4} key={index}>
                                    <div
                                        className="bg-image-wrapper"
                                        style={{
                                            backgroundImage: server.icon
                                                ? `url(https://cdn.discordapp.com/icons/${server.id}/${server.icon}.webp)`
                                                : '',
                                        }}
                                    >
                                        <div className="server-profile-bg">
                                            <div className="server-logo-wrapper">
                                                <img
                                                    src={
                                                        server.icon
                                                            ? `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.webp`
                                                            : ''
                                                    }
                                                    alt=""
                                                    className="server-profile-img"
                                                ></img>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row justify-between w-full mt-4">
                                        <div className="flex flex-col justify-between">
                                            <span className="font-bold text-xl tracking-wider">
                                                {server.name}
                                            </span>
                                            <span className="mt-2 text-slate-500">
                                                user role
                                            </span>
                                        </div>
                                        <div>
                                            <IonButton
                                                className="h-14 w-24 text-lg"
                                                onClick={() => {
                                                    storeGuild(server);
                                                }}
                                            >
                                                Go
                                            </IonButton>
                                        </div>
                                    </div>
                                </Grid>
                            );
                        }
                    })}
                </Grid>
            </div>
        </>
    );
};

export default ManageServer;
