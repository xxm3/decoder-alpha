import './HeaderContainer.css';
import {IonButton, IonContent, IonHeader, IonRouterLink, IonTitle, IonToolbar} from "@ionic/react";
import React, {useEffect, useState} from "react";

// @ts-ignore
const HeaderContainer = ({mintAddrToParent}) => {

    /**
     * State Variables
     */
    const [walletAddress, setWalletAddress] = useState(null);

    /**
     * Actions
     */
    const checkIfWalletIsConnected = async () => {
        try {
            // @ts-ignore
            const {solana} = window;

            if (solana) {
                if (solana.isPhantom) {
                    console.log('Phantom wallet found!');

                    const response = await solana.connect({onlyIfTrusted: true});

                    console.log(
                        'Connected with Public Key:',
                        response.publicKey.toString()
                    );

                    // send the wallet address to the parent
                    mintAddrToParent(walletAddress);

                    /*
                     * Set the user's publicKey in state to be used later!
                     */
                    setWalletAddress(response.publicKey.toString());
                }
            } else {
                alert('Solana object not found! Get a Phantom Wallet 👻');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const connectWallet = async () => {

        // @ts-ignore
        const {solana} = window;

        if (solana) {
            const response = await solana.connect();
            console.log('Connected with Public Key:', response.publicKey.toString());
            setWalletAddress(response.publicKey.toString());
        }
    };

    /**
     * UseEffects
     */
    useEffect(() => {
        const onLoad = async () => {
            await checkIfWalletIsConnected();
        };
        window.addEventListener('load', onLoad);
        return () => window.removeEventListener('load', onLoad);
    }, []);

    useEffect(() => {
        if (walletAddress) {

            // Call Solana program here.

            // Set state

        }
    }, [walletAddress]);

    /**
     * Renders
     */
    const renderNotConnectedContainer = () => (
        <IonButton onClick={connectWallet}>Connect to Wallet</IonButton>
    );

    const renderConnectedContainer = () => (
        <span>
            <span>${walletAddress}</span>
            {/*<IonButton onClick={() => mintAddrToParent(walletAddress)}>Click Child</IonButton>*/}
        </span>
    );


    return (
        <IonHeader>
            <IonToolbar>
                <IonTitle>
                    <IonRouterLink className="header" routerLink="/">SOL Decoder</IonRouterLink>

                    {/*- <IonRouterLink routerLink="/mint">Mint</IonRouterLink> -*/}
                    {/*<IonRouterLink routerLink="/game">Game</IonRouterLink>*/}

                    <span style={{"float": "right"}}>
                        {/* Add the condition to show this only if we don't have a wallet address */}
                        {!walletAddress && renderNotConnectedContainer()}
                        {/* We just need to add the inverse here! */}
                        {walletAddress && renderConnectedContainer()}
                </span>
                </IonTitle>
            </IonToolbar>
        </IonHeader>
    );

};

export default HeaderContainer;
