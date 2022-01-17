import './HeaderContainer.css';
import { IonButton, IonContent, IonHeader, IonRouterLink, IonTitle, IonToolbar, IonSearchbar, IonGrid, IonRow, IonCol } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router';
import { attachProps } from '@ionic/react/dist/types/components/utils';

// @ts-ignore
const HeaderContainer = ({ mintAddrToParent }) => {

    let history = useHistory();

    /**
     * State Variables
     */
    const [walletAddress, setWalletAddress] = useState(null);
    const [searchvalue, setInput] = useState('');
    /**
     * Actions
     */

    const checkIfWalletIsConnected = async () => {
        try {
            // @ts-ignore
            const { solana } = window;
            if (solana) {
                if (solana.isPhantom) {
                    console.log('Phantom wallet found!');
                    const response = await solana.connect({ onlyIfTrusted: true });
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
        const { solana } = window;

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

    function handleSearch() {
        console.log("handleSearch ----------------", searchvalue);
        if (typeof (searchvalue) !== "undefined" && searchvalue !== '') {
            history.push(`/search/${searchvalue}`);
            window.location.reload();
        }
        else {
            history.push('/');
        }
    }

    return (
        <React.Fragment>
            <IonHeader className="all">
                    {/* <IonToolbar>
                        <IonTitle class="flex"> */}
                            <IonGrid>
                                <IonRow>
                                    <IonCol>
                                        <IonRouterLink className="text-6xl" routerLink="/">SOL Decoder</IonRouterLink>
                                    </IonCol>
                                {/*- <IonRouterLink routerLink="/mint">Mint</IonRouterLink> -*/}
                                {/*<IonRouterLink routerLink="/game">Game</IonRouterLink>*/}
                                    <IonCol>
                                        <IonSearchbar className="xs-flex text-base text-gray-400 flex-grow outline-none px-2 "
                                            type="text" value={searchvalue} onIonChange={e => {
                                                setInput(e.target.value)
                                            }} animated placeholder="Type to search" />
                                    </IonCol>
                                    <IonCol>
                                        <IonButton className=" text-white bg-orange-500" value={searchvalue} onClick={() => handleSearch()}
                                            animate-bounce disabled={searchvalue === ''}>
                                            Search</IonButton>
                                    </IonCol>
                                    <IonCol>
                                        {/* Add the condition to show this only if we don't have a wallet address */}
                                        {!walletAddress && renderNotConnectedContainer()}
                                        {/* We just need to add the inverse here! */}
                                        {walletAddress && renderConnectedContainer()}
                                    </IonCol>       
                                </IonRow>
                            </IonGrid>
                        {/* </IonTitle>
                    </IonToolbar> */}
            </IonHeader>
        </React.Fragment>
    );
};

export default HeaderContainer;
