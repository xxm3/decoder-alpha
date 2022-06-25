import React, { useEffect, useState } from 'react';
import { instance } from '../../axios';
import { AppComponentProps } from '../../components/Route';
import { IonItem, IonButton, IonLabel, useIonToast } from '@ionic/react';
import { Backdrop, CircularProgress, Grid, Switch, } from '@material-ui/core';
import { Tooltip } from "react-tippy";
import './ServerModule.scss';
import { useHistory, useLocation, useParams } from 'react-router';
import Loader from '../../components/Loader';
import Help from '../../components/Help';
import InitiateWhitelist from './InitiateWhitelist';
import { Server } from '../../types/Server';
import { css } from '@emotion/react';

import Addserver from './components/Addserver';

interface LocationParams {
    pathname: string;
    state: { server: Server };
    search: string;
    hash: string;
}

const ServerModule: React.FC<AppComponentProps> = () => {
    /**
     * States & Variables
     */
    const useQuery = () => new URLSearchParams(useLocation().search);
    const query = useQuery();
    const devMode = query.get('devMode') || window.location.href.indexOf('localhost') !== -1;

    let history = useHistory();
    const location: LocationParams = useLocation();
    const [isMobile, setIsMobile] = useState(false);
    const [checked, setChecked] = useState<{ mintInfoModule: boolean; tokenModule: boolean; }>({ mintInfoModule: false, tokenModule: false, });
    const [isLoading, setIsLoading] = useState(false);
    const [showInstruction, setShowInstruction] = useState<boolean>(false)
    const [mintMoreInfoShow, setMintMoreInfoShow] = useState<boolean>(false)
    const [foxTokenMoreInfoShow, setFoxTokenMoreInfoShow] = useState<boolean>(false)
    const [dropdownValue, setDropdownValue] = useState({
        dailyMintsWebhookChannel: 'default',
        oneHourMintInfoWebhookChannel: 'default',
        analyticsWebhookChannel: 'default',
    });
    const [channel, setChannel] = useState<any>(null);
    const [backdrop, setBackdrop] = useState(false);
    const [present, dismiss] = useIonToast();
    const [role, setRole] = useState<any>(null);
    const [authorizedModule, setAuthorizedModule] = useState<any>();
    // const [server, setServer] = useState<Server | null>(null);
    const { serverId } = useParams<{serverId : string}>();
    const [addServerFlag, setAddServerFlag] = useState(false)

    /**
     * Use Effects
     */
     useEffect(() => {
        if(!localStorage.getItem('role')){
            history.push('/manageserver')
            return
        }else{
            setRole(localStorage.getItem('role'))
        }

        if (window.innerWidth < 525) {
            setIsMobile(true);
        }

        // if (performance.navigation.type == 1) {
        //     history.push('/manageserver')
        // }

    }, [window.innerWidth]);

    // get guilds
    useEffect(() => {

        if (serverId) {
            setIsLoading(true);
            instance
                .get(`/guilds/${serverId}`)
                .then((response) => {
                    let data = response.data.data;
                    if(role ==='3NFT' || role ==='4NFT'){
                        setChecked({
                            ...checked,
                            mintInfoModule: data.mintInfoModule,
                            tokenModule: data.tokenModule,
                        });
                    }

                    setDropdownValue({
                        ...dropdownValue,
                        dailyMintsWebhookChannel: data.dailyMintsWebhookChannel || 'default',
                        oneHourMintInfoWebhookChannel: data.oneHourMintInfoWebhookChannel || 'default',
                        analyticsWebhookChannel: data.analyticsWebhookChannel || 'default',
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
    }, [location]);

    useEffect(() => {
        if(role ==='3NFT'){
            setAuthorizedModule(1)
        }else if (role ==='4NFT'){
            setAuthorizedModule(10)
        }else{
            setAuthorizedModule(0)
        }

    }, [role])




    // update guilds modules
    let enableModule = (obj: { module: string; enabled: boolean }) => {
        if (serverId) {
            setBackdrop(true);
            instance
                .post(`/guilds/${serverId}/modules`, obj, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(({ data }) => {
                    if(data.success){
                        setChecked({ ...checked, [obj.module]: obj.enabled });
                    }else{
                        let msg = '';
                        if (data?.message) {
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
                    if (error?.response) {
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

    // ie. selecting a channel
    let updateWebHooks = (obj: { webhook: string; channel: string }) => {
        if (serverId) {
            setBackdrop(true);
            instance
                .post(`/guilds/${serverId}/webhooks`, obj, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(({ data }) => {
                    setDropdownValue({
                        ...dropdownValue,
                        [obj.webhook]: obj.channel,
                    });

                    // show success
                    present({
                        message: 'Selection saved. Messages will be sent to the channel in the future',
                        color: 'success',
                        duration: 5000,
                        buttons: [{ text: 'X', handler: () => dismiss() }],
                    });

                })
                .catch((error:any) => {

                    let msg = '';
                    if (error?.response) {
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
        return channel?.sort((a: { name: string; },b: { name: any; })=>a.name.localeCompare(b.name)).map((obj: any, index: number) => {
            return (
                <option value={obj.id} key={index}>
                    {obj.name}
                </option>
            );
        });
    };

    let showDisableBtnMesage = (message:string) => {
        present({
            message: message,
            color: 'danger',
            duration: 5000,
            buttons: [{ text: 'X', handler: () => dismiss() }],
        });
    }

    let disableButton = (btnType: any) => {
        if (role === 'No Roles') {
            showDisableBtnMesage('Sorry you do not have the right number of NFTs')
            return true
        } else if (role === '3NFT') {
            if (checked.mintInfoModule || checked.tokenModule) {
                if (btnType === 'mintInfoModule' && checked.mintInfoModule) {
                    return false;
                } else if (btnType === 'tokenModule' && checked.tokenModule) {
                    return false;
                } else {
                    showDisableBtnMesage('You are Authorized to edit only 1 module')
                    return true
                }
            } else {
                return false;
            }
        } else if (role === '4NFT') {
            return false;
        } else {
            showDisableBtnMesage('Sorry you do not have the right number of NFTs')
            return true
        }
    }

    const sendTestWebhook = (moduleName: string) => {
        if (!serverId) return;
        instance.post(`/guilds/${serverId}/${moduleName}`, {}, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(() => present({
            message: 'Message sent successfully',
            color: 'success',
            duration: 3000,
            buttons: [{ text: 'X', handler: () => dismiss() }],
        })).catch(() => present({
            message: 'An error occurred',
            color: 'danger',
            duration: 3000,
            buttons: [{ text: 'X', handler: () => dismiss() }],
        }));
    }


    if (isLoading) {
        return (
            <div className="pt-10 flex justify-center items-center">
                <Loader />
            </div>
        );
    }

    if(addServerFlag && serverId){
        return (
            <Addserver addServerFlag={addServerFlag} setAddServerFlag={setAddServerFlag} serverId={serverId} />
        )
    }

    return (
        <>
            <Backdrop style={{ color: '#fff', zIndex: 1000, }} open={backdrop} >
                <CircularProgress color="inherit" />
            </Backdrop>

            <div className={isMobile ? 'flex-col items-center flex ':'flex justify-between flex-row items-center'}>
                <IonLabel className="md:text-4xl text-2xl font-semibold">
                    Configure Bot Packages
                </IonLabel>
            </div>
            <div className={`text-base flex ${isMobile ? 'mt-2' :''}`}>

                {/* if they can't add any packages */}
                {authorizedModule === 0 ?
                <>
                    <span className="text-red-500">You don't have enough NFTs to add packages. Please purchase the appropriate amount and have your role verified in Discord. If you feel this is an error, then log out (bottom left) and log in again. If you want to give one of your admins (that have the NFTs) to manage the bots in your server, then click the 'Add Admin' button here </span>

                </> :

                    // else show how many packages they can add
                    <span className="text-green-500">You are authorized to add {authorizedModule} package(s)</span>}
            </div>

            {/* ability for owner to add someone else */}
            <div className="float-right pb-5">
                <Addserver addServerFlag={addServerFlag} setAddServerFlag={setAddServerFlag} />
            </div>

            <div className="flex flex-row justify-center w-full mt-9">
                <div className="server-module-bg p-4 px-6 w-full">
                    <div className='w-full flex items-center justify-between mb-3'>
                        <div className='text-xl font-semibold '>Instructions</div>
                        <img style={{color : 'red'}} src={showInstruction ?  require(`../../images/up-icon.png`) : require(`../../images/chevron-down-icon.png`)}  className='w-4 cursor-pointer' onClick={()=>setShowInstruction((e)=>!e)} />
                    </div>
                    {/* <div className='text-xl font-semibold mb-3'>Instructions</div> */}
                    {
                        showInstruction ?
                            <div>

                                <b>General Instructions</b>
                                <ul className='list-disc ml-5 leading-9'>
                                    <li>Make a new private channel in your Discord. If doing the "Mints" package, name the channel "daily-mints" or whatever you want. Optionally make "1h-mint-info" if you want that as well. Or if you are doing the "Fox token" package, make a channel for the fox token names, and another channel for where users can enter their own bot commands</li>
                                    <li>Add the bot to the above channels (by going to the channel settings within Discord)</li>
                                    <li>Refresh this page</li>
                                    <li>Enable the "Mints" package (or "Fox token" package)</li>
                                    <li>It should ask you about the channels - pick your new channels. Click the test button. If it doesn't work, make sure the SOL Decoder bot is in that channel, and has permission to "Send Messages" (done within the channel settings in Discord)
                                    </li>
                                    <li>Wait for the channels to be populated with data before showing it to the public (8am EST is when daily-mints is populated, varying times for other channels)</li>
                                    <li>If doing the "Fox token" package, you need to first tell us before you can start using the bot commands (/token, /token_name, /wallet_tokens) in your server. You also need to add permission for any user in that channel to "Use Application Commands"</li>
                                </ul>

                                <b>Discord channel permissions</b>
                                <ul className='list-disc ml-5 leading-9'>
                                    <li>Go to your new channel(s) in Discord - click "edit channel" in the sidebar</li>
                                    <li>Click permissions</li>
                                    <li>Click "Add Members or Roles"</li>
                                    <li>Search for "SOL Decoder Bot"</li>
                                    <li>Scroll down to "Advanced Permissions", make sure the bot is selected on the left</li>
                                    <li>On the right, check the following:</li>
                                    <li>- Send Messages</li>
                                    <li>- Embed Links</li>
                                    <li>- Attach Files</li>
                                    <li>Make sure the bot shows as "Online" in the sidebar</li>
                                    <li>Click the "Send a test message" and make sure it works</li>

                                    <img width="350px" src="https://cdn.discordapp.com/attachments/983706216733765642/984217168889667654/Screen_Shot_2022-06-08_at_6.07.31_PM.png" />
                                </ul>
                            </div>
                            : ''
                    }

                </div>
            </div>

            <div className="flex flex-row justify-center w-full mt-6">
                {/*mt-6*/}
                <div className='flex flex-col lg:flex-row gap-6 w-full'>

                    {/*mintInfoModule  */}

                    <div className='basis-1/2'>
                        <div className="server-module-bg overflow-hidden">
                            <div className="flex flex-row justify-center w-full">
                                <div className='card-bg-blur flex justify-center items-center w-full'>
                                    <div className="module-icon-wrapper w-full">
                                        <img src={require('../../images/me.png')} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col mt-4 p-2 w-full">
                                <div className='flex justify-between items-center w-full'>
                                    <IonLabel className="ml-3 text-xl font-semibold">
                                        "Mints" package
                                    </IonLabel>
                                    <Switch checked={checked.mintInfoModule}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            if (disableButton('mintInfoModule')) {
                                                return
                                            }
                                            enableModule({ module: 'mintInfoModule', enabled: e.target.checked, });
                                        }}
                                    />
                                </div>

                                {/* Hide show channel list of mint module */}
                                {checked.mintInfoModule && (
                                    <>
                                        <div className="flex flex-row justify-center w-full">
                                            <div className="server-module-bg p-2 mt-2">
                                                <div className="text-lg font-semibold">
                                                    "Daily Mints" Channel
                                                </div>
                                                <div className="flex flex-row justify-between my-2">
                                                    <select value={dropdownValue.dailyMintsWebhookChannel} className="server-channel-dropdown"
                                                        onChange={(event: any) => {
                                                            updateWebHooks({
                                                                webhook: 'dailyMintsWebhookChannel',
                                                                channel: event.target.value,
                                                            });
                                                        }} >
                                                        <option value="default">
                                                            Please Select the Daily Mints Channel
                                                        </option>
                                                        {getOption()}
                                                    </select>
                                                </div>
                                                <div className='italic text-sm'>(Automated posts about today's mints, along with Twitter/Discord stats)</div>
                                                { dropdownValue.dailyMintsWebhookChannel === 'default' ? '' : <IonButton className={`mt-2 ${isMobile ? 'flex self-center' :''}`} onClick={() => sendTestWebhook('sendDailyMints')}>Send a test message</IonButton>}
                                                {/*
                                                Choose a channel above, then click the button below to make sure it worked
                                                <br /> */}

                                                {/* <IonButton onClick={() => sendTestWebhook('sendDailyMints')}>Send a test message</IonButton> */}
                                                <div className="text-lg font-semibold mt-6">
                                                    "One Hour Mint Info" Channel
                                                </div>
                                                <div className="flex flex-row justify-between my-2">
                                                    <select value={ dropdownValue.oneHourMintInfoWebhookChannel } className="server-channel-dropdown"
                                                        onChange={(event: any) => {
                                                            updateWebHooks({
                                                                webhook: 'oneHourMintInfoWebhookChannel',
                                                                channel: event.target.value,
                                                            });
                                                        }}
                                                    >
                                                        <option value="default">
                                                            Please Select the One Hour Mint Info Channel
                                                        </option>
                                                        {getOption()}
                                                    </select>
                                                </div>
                                                <div className='italic text-sm'>
                                                    (An hour before one of the top 7 daily mints comes out, this will show the mint info, recent searches from the Discords we parse, and last two official tweets from their team)
                                                </div>
                                                {dropdownValue.oneHourMintInfoWebhookChannel === 'default' ? '' : <IonButton className={`mt-2 ${isMobile ? 'flex self-center' :''}`} onClick={() => sendTestWebhook('sendOneHourMints')}>Send a test message</IonButton>}

                                                {/* Choose a channel above, then click the button below to make sure it worked
                                                <br /> */}
                                                {/* <IonButton onClick={() => sendTestWebhook('sendOneHourMints')}>Send a test message</IonButton> */}
                                            </div>
                                        </div>
                                    </>
                                )}


                                <div className="text-sm  mt-2 p-2 border-t-2">
                                    <div className='w-full flex items-center justify-between'>
                                        <div className='text-base my-2 '>
                                            More information
                                        </div>
                                        <img src={mintMoreInfoShow ?  require(`../../images/up-icon.png`) : require(`../../images/chevron-down-icon.png`)} className='w-4 cursor-pointer' onClick={()=> setMintMoreInfoShow((e)=>!e)} />
                                    </div>
                                    {mintMoreInfoShow ? <ul className='list-disc ml-5 leading-7'>
                                        <li>Your server can have the "daily-mints" and "1h-mint-info" feed, and soon "tomorrows-mints". Enable this to learn more about each</li>
                                        <li>Hold and you get lifetime access, and get free upgrades to existing packages such as getting daily summaries of NFTs coming out in a few weeks, when they they get a bump in their twitter / discord numbers</li>
                                    </ul> : '' }

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* tokenModule */}
                    <div className='basis-1/2'>
                        <div className="server-module-bg overflow-hidden">
                            <div className="flex flex-row justify-between w-full">
                                <div className='card-bg-blur-fox flex justify-center items-center w-full'>
                                    <div className="module-icon-wrapper w-full">
                                        <img src={require('../../images/fox.png')} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col mt-4 p-2">
                                <div className='flex justify-between items-center w-full'>
                                    <IonLabel className="ml-3 text-xl">
                                        "Fox Token" package
                                    </IonLabel>
                                    <Switch
                                        checked={checked.tokenModule}
                                        onChange={( e: React.ChangeEvent<HTMLInputElement> ) => {
                                            if (disableButton('tokenModule')) {
                                                return
                                            }
                                            enableModule({
                                                module: 'tokenModule',
                                                enabled: e.target.checked,
                                            });
                                        }}
                                    // disabled={disableButton('tokenModule')}
                                    />
                                </div>

                                {/* Hide show channels list of fox token module */}
                                {checked.tokenModule && (
                                    <>
                                        <div className="flex w-full">
                                            <div className="server-module-bg p-2 mt-2 w-full">
                                                {/* <div className="text-xl font-semibold flex mt-8 mb-8">
                                                    "Fox Token" package
                                                </div> */}

                                                <div className="text-lg font-semibold">
                                                    "Fox Token" channel
                                                </div>
                                                <div className="flex flex-row justify-between my-2 ">
                                                    <select value={ dropdownValue.analyticsWebhookChannel } className="server-channel-dropdown"
                                                        onChange={(event: any) => {
                                                            updateWebHooks({
                                                                webhook: 'analyticsWebhookChannel',
                                                                channel: event.target.value,
                                                            });
                                                        }}
                                                    >
                                                        <option value="default">
                                                            Please Select the Fox Token channel
                                                        </option>
                                                        {getOption()}
                                                    </select>
                                                </div>

                                                <div className='italic text-sm'>
                                                    (Shows when names are added to WL tokens in Fox Token market, along with charts) {' '}
                                                </div>
                                                {dropdownValue.analyticsWebhookChannel === 'default' ? '' : <IonButton className={`mt-2 ${isMobile ? 'flex self-center' :''}`} onClick={() => sendTestWebhook('sendAnalytics')}>Send a test message</IonButton>}


                                                {/* Choose a channel above, then click the button below to make sure it worked
                                                <br />
                                                <IonButton onClick={() => sendTestWebhook('sendAnalytics')}>Send a test message</IonButton> */}
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="text-sm mt-2 p-2 border-t-2">
                                    <div className='w-full flex items-center justify-between'>
                                        <div className='text-base my-2 '> More information </div>
                                        <img src={foxTokenMoreInfoShow ?  require(`../../images/up-icon.png`) : require(`../../images/chevron-down-icon.png`) } className='w-4 cursor-pointer' onClick={()=> setFoxTokenMoreInfoShow((e)=>!e)} />
                                    </div>
                                    { foxTokenMoreInfoShow ?
                                        (<ul className='list-disc ml-5 leading-7'>
                                            <li>Your server can have our "analytics" feed (where we show when tokens get new names from the Fox Token team), and users can use our bot's slash commands of /token_name and /token and /wallet_tokens </li>
                                            <li>Hold and you get lifetime access, and get free upgrades to existing packages such as getting alerts for Fox Token price/listings data (ie. alerted when any fox token with a name & greater than 1 sol price & greater than 10 listings is out) </li>
                                            <li>Please contact us after enabling this, so we can enable the bot commands (/token, /token_name, /wallet_tokens) in your server</li>
                                        </ul>): ''
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

			<div className="mt-10 mb-5 w-full flex justify-center" hidden={!devMode}>
            	<IonButton className="text-base" css={css`
					--padding-top: 25px;
					--padding-bottom: 25px;
					--padding-end: 20px;
					--padding-start: 20px;
				`} onClick={() => history.push(`/initiatewhitelist/${serverId}`)}>
	                Initiate Whitelist
	            </IonButton>
            </div>

        </>
    );
};

export default ServerModule;
