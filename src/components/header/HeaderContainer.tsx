import './HeaderContainer.css';
import { IonButton, IonContent, IonHeader, IonRouterLink, IonTitle, IonToolbar } from "@ionic/react";
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
        // console.log("asdfsdfadsdfsdf----------------", searchvalue);
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
                <IonToolbar>
                    <IonTitle>
                        <IonRouterLink className="header" routerLink="/">SOL Decoder</IonRouterLink>

                        {/*- <IonRouterLink routerLink="/mint">Mint</IonRouterLink> -*/}
                        {/*<IonRouterLink routerLink="/game">Game</IonRouterLink>*/}

                        <span className="wallet" style={{ "float": "right" }}>
                            {/* Add the condition to show this only if we don't have a wallet address */}
                            {!walletAddress && renderNotConnectedContainer()}
                            {/* We just need to add the inverse here! */}
                            {walletAddress && renderConnectedContainer()}
                        </span>
                    </IonTitle>

                    <div className="search">
                        <div className="flex items-center justify-center">
                            <div className="flex border-2 rounded">
                                <input type="text" className="px-4 py-2 w-80" placeholder="Search..." value={searchvalue} onInput={e => setInput(e.target.value)} />
                                <button className="flex items-center justify-center px-4 border-l" onClick={() => handleSearch()}>
                                    <svg className="w-6 h-6 text-gray-600" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </IonToolbar>
            </IonHeader>
        </React.Fragment>
    );
};

export default HeaderContainer;
