import './HeaderContainer.css';
import { IonButton, IonContent, IonHeader, IonRouterLink, IonTitle, IonToolbar, IonSearchbar, IonGrid, IonRow, IonCol, IonItem, IonLabel } from "@ionic/react";
import React, { useEffect, useState,forwardRef, useRef, useImperativeHandle } from "react";
import { useHistory } from 'react-router';
import { attachProps } from '@ionic/react/dist/types/components/utils';

// @ts-ignore
const HeaderContainer = ({ mintAddrToParent, showflag, onClick }) => {

    let history = useHistory();

    /**
     * State Variables
     */
    const [walletAddress, setWalletAddress] = useState(null);
    const [searchvalue, setInput] = useState('');
    /**s
     * Actions
     */

    const checkIfWalletIsConnected = async () => {
        try {
            // @ts-ignore
            const { solana } = window;
            if (solana) {
                if (solana.isPhantom) {
                    // console.log('Phantom wallet found!');
                    const response = await solana.connect({ onlyIfTrusted: true });

                    const walletAddress = response.publicKey.toString();
                    // console.log( 'Connected with Public Key:', walletAddress);

                    // send the wallet address to the parent
                    mintAddrToParent(walletAddress);

                    /*
                     * Set the user's publicKey in state to be used later!
                     */
                    setWalletAddress(walletAddress);
                }
            } else {
                console.error('Solana object not found! Get a Phantom Wallet');
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
            // console.log('Connected with Public Key:', response.publicKey.toString());
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
        <IonButton color="sucess" onClick={connectWallet} className={"text-white bg-orange-500 absolute inset-y-0 right-0 w-32 text-xs"}>Select Wallet</IonButton>
    );

    const renderConnectedContainer = () => (
        <span>
            {/*<span>{walletAddress}</span>*/}
            {/*<IonButton onClick={() => mintAddrToParent(walletAddress)}>Click Child</IonButton>*/}
        </span>
    );

    function handleSearch() {
        // console.log("handleSearch ----------------", searchvalue);
        if (typeof (searchvalue) !== "undefined" && searchvalue !== '') {
            history.push(`/search/${searchvalue}`);
            window.location.reload();
        }
        else {
            history.push('/');
        }
    }

    // @ts-ignore
    return (
        <React.Fragment>
            <IonHeader className="all">
                    {/* <IonToolbar>
                        <IonTitle class="flex"> */}
                            <IonGrid>
                                <IonRow>
                                    <IonCol >
                                        {/* <IonRouterLink className="text-6xl text-blue-600" routerLink="/">SOL Decoder</IonRouterLink> */}
                                        <IonLabel className="text-6xl text-blue-600">
                                            <IonRouterLink className="text-6xl text-blue-600" routerLink="/">SOL Decoder</IonRouterLink>
                                        </IonLabel>
                                    </IonCol>
                                {/*- <IonRouterLink routerLink="/mint">Mint</IonRouterLink> -*/}
                                {/*<IonRouterLink routerLink="/game">Game</IonRouterLink>*/}
                                    <IonCol >
                                    {
                                        showflag && (
                                            <form className="ion-padding" onSubmit={() => handleSearch()}>
                                                <IonRow className="xs::flex items-center rounded-lg overflow-hidden px-2 py-1 justify-center">
                                                    <IonCol>
                                                        <IonSearchbar className="xs-flex text-base text-gray-400 flex-grow outline-none px-2 "
                                                            type="text" value={searchvalue} onIonChange={e => {
                                                                // @ts-ignore
                                                            setInput(e.target.value)
                                                            }} animated placeholder="Type to search" />
                                                    </IonCol>
                                                    <IonCol>
                                                        <IonButton color="sucess" className="text-white bg-orange-500" value={searchvalue} onClick={() => handleSearch()}
                                                            animate-bounce disabled={searchvalue === ''}>
                                                            Search</IonButton>
                                                    </IonCol>
                                                </IonRow>
                                            </form>)
                                    }
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
