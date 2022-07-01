import React, { useEffect, useState } from 'react';
import { instance } from '../../axios';
import { AppComponentProps } from '../../components/Route';
import { IonLabel, IonContent, IonButton, useIonToast } from '@ionic/react';
import { Backdrop, CircularProgress, Grid } from '@material-ui/core';
import './ManageServer.scss';
import Loader from '../../components/Loader';
import Addserver from './components/Addserver';
import { useHistory } from 'react-router';

interface Server {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    admin: boolean;
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
    const [noServers, setNoServers] = useState<boolean>(false);

    /**
     * Use Effects
     */
    useEffect(() => {
        if (window.innerWidth < 525) {
            setIsMobile(true);
        }
    }, [window.innerWidth]);

    useEffect(() => {
        let serverList: any = localStorage.getItem('servers');
        serverList = JSON.parse(serverList);

        let adminOwnerServers = [];
        for (let i in serverList) {
            if (serverList[i].admin || serverList[i].owner) {
                adminOwnerServers.push(serverList[i]);
            }
        }

        if (adminOwnerServers.length > 0) {
            setServers(adminOwnerServers);
            setNoServers(false);
        } else {
            setNoServers(true);
        }
    }, []);

    // when they click "Go"
    let storeGuild = (server: Server) => {
        setIsLoading(true);

        instance
            .post(
                `/guilds/${server.id}`,
                {},
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then(({ data }) => {
                if(data){
                    if(data.noBot){
                        history.push({ pathname: `/servermodule/${server.id}`,search:'noBot' });
                    }
                    history.push({ pathname: `/servermodule/${server.id}` });
                }
                // history.push({ pathname: `/servermodule/${server.id}`,state:data });
            })
            .catch((error: any) => {
                console.log('error', error);
                let msg = '';
                console.log(error.response);
                if (error && error.response) {
                    msg = String(error.response.data.message ? error.response.data.message : error.response.data.body);
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
            <Backdrop style={{ color: '#fff', zIndex: 1000 }} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* header */}
            <div className="flex justify-between">
                <IonLabel className="text-4xl font-semibold mb-3">
                    {' '}
                    Select a Server{' '}
                </IonLabel>
                <IonButton
                    onClick={() => {
                        history.push('/view-guild');
                    }}
                >
                    {' '}
                    View Discords that have our bots{' '}
                </IonButton>
            </div>

            {/* only show if they have servers they are owner / admin */}
            {noServers ? (
                <div className="text-xl text-red-500">
                    {' '}
                    {/* text-center */}
                    Unable to find any servers you are the owner or admin of.
                    <br />
                    If you are one, then logout in the sidebar and try logging
                    in again.
                </div>
            ) : (
                <>
                    {/* bot invite section */}
                    <div className="my-3 relative bg-yellow-300/25 p-5 rounded-xl">
                        <div className="text-md">
                            <div className="mb-2 flex items-center w-full justify-between">
                                <div className="flex items-center">
                                    <span className=" bg-yellow-500 w-7 h-7 flex items-center justify-center font-bold rounded-full mr-2">
                                        !
                                    </span>
                                    <span className="text-yellow-500 text-lg font-bold">
                                        Bot Invite
                                    </span>
                                </div>
                            </div>

                            <p>
                                If you are an existing DAO that just wants to
                                receive whitelists via Seamless, then click
                                'ADD' on your server below to fill out your
                                profile.
                                <br />
                                <br />
                                If you are paying for our Bots, or are a new
                                mint, your server will need to first have our
                                Discord Bot invited to it. Click one of the
                                below links, then in the "Add to Server" on the
                                bottom, select your server. Then click
                                "Continue", then "Authorize"
                            </p>
                            <ul className="list-disc ml-8 mt-3">
                                {/*<li> If using just the "Daily Mints" bots, <a className="underline cursor-pointer" href="https://discord.com/api/oauth2/authorize?client_id=927008889092857898&permissions=2048&redirect_uri=https%3A%2F%2Fsoldecoder.app%2Fmanageserver&response_type=code&scope=identify%20guilds%20guilds.members.read%20bot">click here</a> to add the Discord Bot to your server </li>*/}
                                <li>
                                    {' '}
                                    If using the "Daily Mints", "Fox Token", or
                                    "Magic Eden" package,{' '}
                                    <a
                                        className="font-bold underline cursor-pointer"
                                        href="https://discord.com/oauth2/authorize?client_id=927008889092857898&permissions=2048&redirect_uri=https%3A%2F%2Fsoldecoder.app%2Fmanageserver&response_type=code&scope=identify%20guilds%20applications.commands%20bot%20guilds.members.read"
                                    >
                                        then click here
                                    </a>{' '}
                                    to add the Discord Bot to your server{' '}
                                </li>
                                {/* identify, guilds, guilds.members.read, bot, application.commands --- manage roles, send messages,  */}
                                <li>
                                    If you are a new mint and are using Seamless
                                    (our whitelist bot where we will give users
                                    whitelist roles if they are in a DAO and win
                                    a fcfs/giveaway),{' '}
                                    <a
                                        className="underline cursor-pointer font-bold"
                                        href="https://discord.com/api/oauth2/authorize?client_id=927008889092857898&permissions=268437504&redirect_uri=https%3A%2F%2Fsoldecoder.app%2Fmanageserver&response_type=code&scope=applications.commands%20guilds%20guilds.members.read%20bot%20identify"
                                    >
                                        then click here
                                    </a>{' '}
                                    to add the Discord Bot to your server. This
                                    bot also supports all of the packages from
                                    the first link
                                </li>
                            </ul>
                            <p className="mt-3">
                                After the bot is invited, click "Add" on one of
                                your servers below
                            </p>
                        </div>
                    </div>

                    {/* list of servers */}
                    <div className="flex flex-row justify-center w-full mt-8">
                        <Grid
                            container
                            spacing={4}
                            className="flex justify-self-center items-center mx-auto"
                        >
                            {servers
                                ? servers.map(
                                      (server: Server, index: number) => {
                                          if (server.owner || server.admin) {
                                              return (
                                                  <Grid
                                                      item
                                                      lg={3}
                                                      key={index}
                                                      className="mx-auto"
                                                  >
                                                      <div className=" rounded-xl c-card-bg overflow-hidden mx-auto">
                                                          <div
                                                              className="bg-image-wrapper"
                                                              style={{
                                                                  backgroundImage:
                                                                      server.icon
                                                                          ? `url(https://cdn.discordapp.com/icons/${server.id}/${server.icon}.webp)`
                                                                          : '',
                                                              }}
                                                          >
                                                              <div className="server-profile-bg">
                                                                  <div className="rounded-full">
                                                                      <img
                                                                          src={
                                                                              server.icon
                                                                                  ? `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.webp`
                                                                                  : ''
                                                                          }
                                                                          alt=""
                                                                          className="server-profile-img rounded-full"
                                                                      ></img>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          <div className="flex flex-row justify-between items-center w-full mt-4 px-4 ">
                                                              <div
                                                                  className="whitespace-normal mb-4  "
                                                                  style={{
                                                                      maxWidth:
                                                                          '82%',
                                                                  }}
                                                              >
                                                                  <span className="text-md tracking-wider  text-white">
                                                                      {' '}
                                                                      {
                                                                          server.name
                                                                      }{' '}
                                                                  </span>
                                                              </div>
                                                              <div
                                                                  className="p-3 py-1 ml-2 text-md rounded-lg add-button cursor-pointer text-white mb-4"
                                                                  onClick={() => {
                                                                      storeGuild(
                                                                          server
                                                                      );
                                                                  }}
                                                              >
                                                                  {' '}
                                                                  ADD{' '}
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </Grid>
                                              );
                                          }
                                      }
                                  )
                                : ''}
                        </Grid>
                    </div>
                </>
            )}

            {/* introduction! */}
            <div className="flex flex-row justify-center w-full mt-4 rounded-xl">
                <div className="py-3 server-module-bg pl-3">
                    <div className="text-1xl font-semibold my-3">
                        Introduction
                    </div>
                    <ul className="list-disc ml-8 leading-9">
                        <li>
                            This page allows you to setup some of the SOL
                            Decoder bots on your own Discord server
                        </li>
                        <li>
                            Pricing: Free for some bots (Seamless & Assassin
                            bot). For others, hold 3 NFTs (which unlocks all of
                            our existing 3 NFT benefits for yourself -{' '}
                            <a
                                href="https://docs.soldecoder.app/books/intro/page/discord-overview"
                                target="_blank"
                                className="underline cursor-pointer"
                            >
                                read more here
                            </a>
                            ) - and you can unlock one of our bot packages. Hold
                            4 NFTs to unlock the rest of the bot packages
                        </li>
                        <li>
                            If you are an upcoming mint, you can use our bots
                            for free until you mint, in return for some of your
                            whitelist. Open a ticket in the SOL Decoder Discord
                            to learn more
                        </li>
                        {/*<li>Hold and you get lifetime access, and get free upgrades to existing packages such as: (1) Mints package:  get daily summaries of NFTs coming out in a few weeks, when they they get a bump in their twitter / discord numbers, and (2) Fox token package: getting alerts for Fox Token price/listings data (ie. alerted when any fox token with a name & greater 1 sol price & greater 10 listings is out)</li>*/}
                    </ul>

                    <div className="text-1xl font-semibold my-3">
                        Package Overview
                    </div>
                    <ul className="list-disc ml-8 leading-9">
                        <li>
                            <b>#1 - Mints package</b> - Your server can have our
                            "daily-mints" feed and "1h-mint-info" and soon
                            "tomorrows-mints". Read more about these in our
                            Discord in our #faq channel.
                        </li>
                        <li>
                            <b>#2 - Fox token package</b> - Your server can have
                            our "Fox Token" feed, and users can use our bot's
                            slash commands of /token_name and /token (which
                            shows Fox Token Market info from a token address or
                            name) and /wallet_tokens (Get Fox Token Market info
                            for all tokens in an address)
                        </li>
                        <li>
                            <b>#3 - Magic Eden package</b> - (1) use the command
                            "/fp any_magiceden_nft" and you'll get the price /
                            listings / volume of that NFT, and (2) use the
                            command "/tps" to see a live count of Solana's
                            Transactions Per Second
                        </li>
                        {/*(2) get alerted whenever a sale for your NFT occurs,*/}
                        <li>
                            <b>
                                (Free for now - Future) #4 - "Assassin" bot -
                                Kick bots/spammers from your server (that
                                impersonate your team, or have Bot in their
                                name), and automatically delete non-approved
                                links posted to any channel
                            </b>
                        </li>
                        <li>
                            <b>
                                (Free for now) #5 - "Seamless" package - Allow
                                verified DAO members to whitelist in less than
                                10 seconds, with 0 work on your mods
                            </b>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

// @ts-ignore
export default ManageServer;
