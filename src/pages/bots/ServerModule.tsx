import React, { useEffect, useState } from 'react';
import { instance } from '../../axios';
import { AppComponentProps } from '../../components/Route';
import {  IonLabel,  useIonToast } from '@ionic/react';
import { Backdrop,CircularProgress,Grid, Switch, } from '@material-ui/core';
import './ServerModule.scss';
import { useHistory, useLocation } from 'react-router';
import Loader from '../../components/Loader';

interface LocationParams {
    pathname: string;
    state: { server: Server };
    search: string;
    hash: string;
}
interface Server {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: string;
    features: [];
}

const ServerModule: React.FC<AppComponentProps> = () => {
    /**
     * States & Variables
     */
     let history = useHistory();
    const location: LocationParams = useLocation();
    const [isMobile, setIsMobile] = useState(false);
    const [checked, setChecked] = useState<{
        mintInfoModule: boolean;
        tokenModule: boolean;
    }>({
        mintInfoModule: false,
        tokenModule: false,
    });
    const [age, setAge] = React.useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [server, setServer] = useState<Server | null>(null);

    const [dropdownValue, setDropdownValue] = useState({
        dailyMintsWebhookChannel: '',
        oneHourMintInfoWebhookChannel: '',
        analyticsWebhookChannel: '',
    });
    const [channel, setChannel] = useState<any>(null);
    const [backdrop, setBackdrop] = useState(false);
    const [present, dismiss] = useIonToast();

    const [role, setRole] = useState<any>(null)

    /**
     * Use Effects
     */
    useEffect(() => {
        if(!localStorage.getItem('role')){
            history.push('/')
            return
        }else{
            setRole(localStorage.getItem('role'))
        }
        if (window.innerWidth < 525) {
            setIsMobile(true);
        }
    }, [window.innerWidth]);


    // get guilds
    useEffect(() => {
        if (location) {
            if (location?.state?.server) {
                setIsLoading(true);
                let serverObj = location.state.server;
                setServer(serverObj);
                instance
                    .get(`/guilds/${serverObj.id}`)
                    .then((response) => {
                        let data = response.data.data;
                        setChecked({
                            ...checked,
                            mintInfoModule: data.mintInfoModule,
                            tokenModule: data.tokenModule,
                        });

                        setDropdownValue({
                            ...dropdownValue,
                            dailyMintsWebhookChannel:
                                data.dailyMintsWebhookChannel,
                            oneHourMintInfoWebhookChannel:
                                data.oneHourMintInfoWebhookChannel,
                            analyticsWebhookChannel:
                                data.analyticsWebhookChannel,
                        });
                        setChannel(data.textChannels);
                    })
                    .catch((error: any) => {
                        let msg = '';
                        if (error && error.response) {
                            msg = String(error.response.data.message);
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
            }
        }
    }, [location]);



    // update guilds modules
    let enableModule = (obj: { module: string; enabled: boolean }) => {
        if (server) {
            setBackdrop(true);
            instance
                .post(`/guilds/${server.id}/modules`, obj, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(({ data }) => {
                    if(data.success){
                        setChecked({ ...checked, [obj.module]: obj.enabled });
                    }else{
                        let msg = '';
                        if (data && data.message) {
                            msg = String(data.message);
                        } else {
                            msg = 'Unable to connect. Please try again later';
                        }
                        present({
                            message: msg,
                            color: 'danger',
                            duration: 5000,
                            buttons: [{ text: 'X', handler: () => dismiss() }],
                        });
                    }
                })
                .catch((error:any) => {

                    let msg = '';
                    if (error && error.response) {
                        msg = String(error.response.data.message);
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
                    setBackdrop(false);
                });
        }
    };

    let updateWebHooks = (obj: { webhook: string; channel: string }) => {
        if (server) {
            setBackdrop(true);
            instance
                .post(`/guilds/${server.id}/webhooks`, obj, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(({ data }) => {
                    setDropdownValue({
                        ...dropdownValue,
                        [obj.webhook]: obj.channel,
                    });
                })
                .catch((error:any) => {

                    let msg = '';
                    if (error && error.response) {
                        msg = String(error.response.data.message);
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
                    setBackdrop(false);
                });
        }
    };

    let getOption = () => {
        return channel?.map((obj: any, index: number) => {
            return (
                <option value={obj.id} key={index}>
                    {obj.name}
                </option>
            );
        });
    };

    let disableButton = (btnType:any) =>{
        if(role==='No Roles'){
            return true
        }else if(role==='3NFT'){
            if(checked.mintInfoModule || checked.tokenModule){
                if(btnType === 'mintInfoModule' &&checked.mintInfoModule){
                    return false
                }else if(btnType === 'tokenModule' &&checked.tokenModule){
                    return false
                }else{
                    return true
                }
            }else{
                return false
            }
        }else if(role==='4NFT'){
            return false
        }else{
            return true
        }
    }

    if (isLoading) {
        return (
            <div className="pt-10 flex justify-center items-center">
                <Loader />
            </div>
        );
    }
    return (
        <>
            <Backdrop
                style={{color: '#fff', zIndex: 1000, }}
                open={backdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <IonLabel className="text-xl font-semibold flex">
                Configure Bot Packages
            </IonLabel>

            <div className="flex flex-row justify-center w-full mt-6">
                <Grid container spacing={4}>
                    {/*mintInfoModule  */}
                    <Grid item xs={12} md={6} xl={4}>
                        <div className="server-module-bg ">
                            <div className="flex flex-row justify-between w-full mt-6">
                                <div className="module-icon-wrapper ml-3">
                                    <img src={require('../../images/me.png')} />
                                </div>
                                <Switch checked={checked.mintInfoModule} onChange={( e: React.ChangeEvent<HTMLInputElement> ) => {
                                        enableModule({ module: 'mintInfoModule', enabled: e.target.checked, });
                                    }}
                                  disabled={disableButton('mintInfoModule')}
                                />
                            </div>
                            <div className="flex flex-col mt-4">
                                <IonLabel className="ml-3 text-xl">
                                    "Mints" package
                                    {/*TODO: if disabled... need to tell why... */}
                                </IonLabel>
                                <IonLabel className="ml-3 text-sm opacity-60 mt-2">
                                    <ul>
                                        <li>- Your server can have the "daily-mints" and "1h-mint-info" feed, and soon "tomorrows-mints". Enable this to learn more about each</li>
                                        <li>- Hold and you get lifetime access, and get free upgrades to existing packages such as getting daily summaries of NFTs coming out in a few weeks, when they they get a bump in their twitter / discord numbers</li>
                                    </ul>

                                </IonLabel>
                            </div>
                        </div>
                    </Grid>

                    {/* tokenModule */}
                    <Grid item xs={12} md={6} xl={4}>
                        <div className="server-module-bg ">
                            <div className="flex flex-row justify-between w-full mt-6">
                                <div className="module-icon-wrapper ml-3">
                                    <img src={require('../../images/me.png')} />
                                </div>
                                <Switch
                                    checked={checked.tokenModule}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                        enableModule({
                                            module: 'tokenModule',
                                            enabled: e.target.checked,
                                        });
                                    }}
                                    disabled={disableButton('tokenModule')}
                                />
                            </div>
                            <div className="flex flex-col mt-4">
                                <IonLabel className="ml-3 text-xl">
                                    "Fox Token" package
                                    {/*TODO: if disabled... need to tell why... */}
                                </IonLabel>
                                <IonLabel className="ml-3 text-sm opacity-60 mt-2">
                                    <ul>
                                        <li>- Your server can have our "analytics" feed (where we show when tokens get new names from the Fox Token team), and users can use our bot's slash commands of /token_name and /token and /wallet_tokens </li>
                                        <li>- Hold and you get lifetime access, and get free upgrades to existing packages such as getting alerts for Fox Token price/listings data (ie. alerted when any fox token with a name & greater than 1 sol price & greater than 10 listings is out)
                                        </li>
                                        <li>- Note: after enabling this, you will need to tell us before you can start using the bot commands (/token, /token_name, /wallet_tokens) in your server</li>
                                    </ul>
                                </IonLabel>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>

            {/*  */}
            {checked.mintInfoModule && (
                <>
                    <IonLabel className="text-xl font-semibold flex mt-8 mb-8">
                        "Mints" package
                    </IonLabel>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6} xl={6}>
                            <IonLabel className="text-base">
                                "Daily Mints" Channel (Automated posts about today's mints, along with Twitter/Discord stats)
                            </IonLabel>
                            <div className="flex flex-row justify-between ">
                                <select value={ dropdownValue.dailyMintsWebhookChannel }
                                    className="server-channel-dropdown"
                                    onChange={(event: any) => {
                                        updateWebHooks({
                                            webhook: 'dailyMintsWebhookChannel',
                                            channel: event.target.value,
                                        });
                                    }} >
                                    <option value="">
                                        Please Select the Daily Mints Channel
                                    </option>
                                    {getOption()}
                                </select>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6} xl={6}>
                            <IonLabel className="text-base">
                                "One Hour Mint Info" Channel (An hour before one of the daily mints comes out, this will show the mint info, recent searches from the Discords we parse, and last two official tweets from their team)
                            </IonLabel>
                            <div className="flex flex-row justify-between">
                                <select
                                    value={
                                        dropdownValue.oneHourMintInfoWebhookChannel
                                    }
                                    className="server-channel-dropdown"
                                    onChange={(event: any) => {
                                        updateWebHooks({
                                            webhook:
                                                'oneHourMintInfoWebhookChannel',
                                            channel: event.target.value,
                                        });
                                    }}
                                >
                                    <option value="">
                                        Please Select the One Hour Mint Info Channel
                                    </option>
                                    {getOption()}
                                </select>
                            </div>
                        </Grid>
                    </Grid>
                </>
            )}
            {/*  */}

            {checked.tokenModule && (
                <>
                    <IonLabel className="text-xl font-semibold flex mt-8 mb-8">
                        "Fox Token" channel (Shows when names are added to WL tokens in Fox Token market, along with charts)
                    </IonLabel>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6} xl={6}>
                            <IonLabel className="text-base">
                                Analytics Channel {' '}
                            </IonLabel>
                            <div className="flex flex-row justify-between ">
                                <select
                                    value={
                                        dropdownValue.analyticsWebhookChannel
                                    }
                                    className="server-channel-dropdown"
                                    onChange={(event: any) => {
                                        updateWebHooks({
                                            webhook: 'analyticsWebhookChannel',
                                            channel: event.target.value,
                                        });
                                    }}
                                >
                                    <option value="">
                                        Please Select the Fox Token channel
                                    </option>
                                    {getOption()}
                                </select>
                            </div>
                        </Grid>
                    </Grid>
                </>
            )}

            <div className="m-3 relative bg-gray-100 p-4 rounded-xl">
                <p className="text-lg text-gray-700 font-medium">
                    <b>General Instructions</b>
                    <ul>
                        <li>- Make a new private channel - name it "daily-mints" or whatever you want. Optionally make "1h-mint-info" if you want that as well. Or if doing the Fox token package, make a channel for the fox token names, and another channel for where users can put the bot commands</li>
                        <li>- Add the bot to the above channels</li>
                        <li>- Refresh this page</li>
                        <li>- Enable the "Mints" package (or "Fox token" package)</li>
                        <li>- It should ask you about the channels - pick your new channels</li>
                        <li>-  Wait for it to be populated with data before showing it to the public (8am est for daily-mints, varying times for other channels)</li>
                    </ul>
                </p>
            </div>

        </>
    );
};

export default ServerModule;
