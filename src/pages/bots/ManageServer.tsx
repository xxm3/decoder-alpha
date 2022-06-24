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
import Addserver from './components/Addserver';
import { Button } from '../../components/wallet-modal/componet/Button';

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
    const [noServers, setNoServers] = useState<boolean>(false)

    /**
     * Use Effects
     */
    useEffect(() => {
        if (window.innerWidth < 525) {
            setIsMobile(true);

        }
    }, [window.innerWidth]);

    useEffect(() => {
        // set on Login.tsx ... comes from /getToken
        let serverList: any = localStorage.getItem('servers');
        // console.log('serverList', JSON.parse(serverList));
        // console.log(serverList.length);

        if (JSON.parse(serverList).length > 0) {
            setServers(JSON.parse(serverList));
            setNoServers(false);
        }else {
            setNoServers(true);
        }
    }, []);

    // when they click "Go"
    let storeGuild = (server: Server) => {

        setIsLoading(true);

        instance
            .post( `/guilds/${server.id}`, {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            .then(({ data }) => {
                history.push({
                    pathname: `/servermodule/${server.id}`,
                });
            })
            .catch((error: any) => {
                console.log('error', error);

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
    };

    return (
        <>
            {/* Loading */}
            <Backdrop style={{ color: '#fff', zIndex: 1000, }} open={isLoading} >
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* header */}
            <div className='flex justify-between'>
                <IonLabel className="text-4xl font-semibold mb-3">
                    Select a Server
                </IonLabel>
                <IonButton onClick={()=>{
                    history.push('/view-guild')
                }}>
                    View Discords that have our bots
                </IonButton>
            </div>

            {/* only show if they have servers they are owner / admin */}
            {noServers ?

                <div className='text-xl text-red-500'> {/* text-center */}
                    Unable to find any servers you are the owner or admin of.
                    <br/>
                    If you are one, then logout in the sidebar and try logging in again.
                    <br/>
                    Or if you are the admin of a server, then you will need to get the owner to login here, and allow you to manage the server within this site.
                </div> :

            <>

            {/* bot invite section */}
            <div className="my-3 relative bg-yellow-300/25 p-5 rounded-xl">
                <div className="text-md">
                    <div className='mb-2 flex items-center w-full justify-between'>
                        <div className='flex items-center'>
                            <span className=" bg-yellow-500 w-7 h-7 flex items-center justify-center font-bold rounded-full mr-2">!</span>
                            <span className='text-yellow-500 text-lg font-bold'>Bot Invite</span>
                        </div>
                    </div>

                    <p>Your server will need to first have our Discord Bot invited to it. Click one of the below links, then in the "Add to Server" on the bottom, select your server. Then click "Continue", then "Authorize"</p>
                    <ul className='list-disc ml-8 mt-3'>
                        <li> If using just the "Daily Mints" bots, <a className="underline cursor-pointer" href="https://discord.com/api/oauth2/authorize?client_id=927008889092857898&permissions=2048&redirect_uri=https%3A%2F%2Fsoldecoder.app%2Fmanageserver&response_type=code&scope=identify%20guilds%20guilds.members.read%20bot">click here</a> to add the Discord Bot to your server </li>

                        <li> Or if using the "Fox Token" bots (where users can type /token),  <a className="underline cursor-pointer" href="https://discord.com/oauth2/authorize?client_id=927008889092857898&permissions=2048&redirect_uri=https%3A%2F%2Fsoldecoder.app%2Fmanageserver&response_type=code&scope=identify%20guilds%20applications.commands%20bot%20guilds.members.read">click here</a> to add the Discord Bot to your server </li>

                        {/* identify, guilds, guilds.members.read, bot, application.commands --- manage roles, send messages,  */}
                        <li>If you are a new mint and are using the Whitelist bots (where we will give users whitelist roles if they are in a DAO and win a giveaway), <a className="underline cursor-pointer" href="https://discord.com/api/oauth2/authorize?client_id=927008889092857898&permissions=268437504&redirect_uri=https%3A%2F%2Fsoldecoder.app%2Fmanageserver&response_type=code&scope=applications.commands%20guilds%20guilds.members.read%20bot%20identify">click here</a> to add the Discord Bot to your server</li>
                    </ul>
                </div>
            </div>

            {/* list of servers */}
            <div className="flex flex-row justify-center w-full mt-8">
                <Grid container spacing={4} className="flex justify-self-center items-center mx-auto" >
                    {servers ? servers.map((server: Server, index: number) => {
                        if (server.owner) {
                            return (
                                <Grid item lg={3} key={index} className="mx-auto">
                                    <div className=' rounded-xl c-card-bg overflow-hidden mx-auto'>
                                        <div className="bg-image-wrapper" style={{backgroundImage: server.icon ? `url(https://cdn.discordapp.com/icons/${server.id}/${server.icon}.webp)` : '',}}>
                                            <div className="server-profile-bg">
                                                <div className="rounded-full">
                                                    <img src={server.icon ? `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.webp` : ''} alt="" className="server-profile-img rounded-full"></img>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-between items-center w-full mt-4 px-4 ">
                                            <div className="whitespace-normal mb-4  " style={{ maxWidth:'82%'}}>
                                                <span className="text-md tracking-wider  text-white">
                                                    {server.name}
                                                </span>
                                            </div>
                                            <div className="p-3 py-1 ml-2 text-md rounded-lg add-button cursor-pointer text-white mb-4"  onClick={() => { storeGuild(server);  }}>
                                                ADD
                                            </div>
                                        </div>
                                    </div>

                                </Grid>
                            );
                        }
                    }) : ''}

                    </Grid>
                </div>

            </>
            }

            {/* introduction! */}
            <div className="flex flex-row justify-center w-full mt-4">
                <div className="py-3">

                    <div className='text-1xl font-semibold my-3'>Introduction</div>
                    <ul className='list-disc ml-8 leading-9'>
                        <li>This page allows you to setup some of the SOL Decoder bots on your own Discord server</li>
                        <li>Pricing: Hold 3 NFTs (which unlocks all of our existing 3 NFT benefits - <a href="https://docs.soldecoder.app/books/intro/page/discord-overview" target="_blank" className="underline cursor-pointer">read more here</a>) - and you can unlock one of our bot packages. Hold 4 NFTs to unlock a second bot package, and get most future bot packages for free</li>
                        <li>If you are an upcoming mint, you can use our bots for free until you mint, in return for some of your whitelist. Open a ticket in the SOL Decoder Discord to learn more</li>
                        {/*<li>Hold and you get lifetime access, and get free upgrades to existing packages such as: (1) Mints package:  get daily summaries of NFTs coming out in a few weeks, when they they get a bump in their twitter / discord numbers, and (2) Fox token package: getting alerts for Fox Token price/listings data (ie. alerted when any fox token with a name & greater 1 sol price & greater 10 listings is out)</li>*/}
                    </ul>

                    <div className='text-1xl font-semibold my-3'>Package Overview</div>
                    <ul className='list-disc ml-8 leading-9'>
                        <li><b>Bot package #1 - Mints package</b> - Your server can have our "daily-mints" feed and "1h-mint-info" and soon "tomorrows-mints"</li>
                        <li><b>Bot package #2 - Fox token package</b> - Your server can have our "Fox Token" feed, and users can use our bot's slash commands of /token_name and /token (which shows Fox Token Market info from a token address or name) and /wallet_tokens (Get Fox Token Market info for all tokens in an address)</li>
                    </ul>

                    <div className='text-1xl font-semibold my-3'>Upcoming packages</div>
                    <ul className='list-disc ml-8 leading-9'>
                        <li><b>"Magic Eden" package:</b> (1) use the command "/me_floor bohemia" and you'll get the price info of Bohemia, (2) get alerted whenever a sale for your NFT occurs, and (3) use the command "/tps" to see a live count of Solana's Transactions Per Second
                            {/*and (2) you can customize a single alert for your server, to get alerted when any NFT above a certain price goes up X % within Y minutes*/}
                        </li>
                        <li>"Security" package - details to be announced</li>
                    </ul>


                </div>
            </div>
        </>
    );
};

// @ts-ignore
export default ManageServer;
