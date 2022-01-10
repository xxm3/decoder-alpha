import {IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRouterLink} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import './Mint.css';
import HeaderContainer from "../../components/header/HeaderContainer";
// import CandyMachine from "../../CandyMachine";

// declare const window: any;
declare global {
    interface Window {
        solana:any;
    }
}

const Mint = () => {

    /**
     * State Variables
     */
    const [walletAddress, setWalletAddress] = useState('');

    /**
     * Actions
     */
    // to receive the mint address from the header container
    const mintAddrToParent = (walletAddress: any) => {
        setWalletAddress(walletAddress);
    }
    const checkIfWalletIsConnected = async () => {
        try {
            // const { solana } = window;
            let solana = window.solana; // ok now

            if (solana) {
                if (solana.isPhantom) {
                    console.log('Phantom wallet found!');
                    const response = await solana.connect({ onlyIfTrusted: true });
                    console.log(
                        'Connected with Public Key:',
                        response.publicKey.toString()
                    );

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

    /**
     * Renders
     */
    // const renderNotConnectedContainer = () => (
    //     <button
    //         className="cta-button connect-wallet-button"
    //         onClick={connectWallet}
    //     >
    //         Connect to Wallet
    //     </button>
    // );

    /**
     * Page itself
     */
    return (
        <IonPage>
            <HeaderContainer mintAddrToParent={mintAddrToParent} />

            <IonContent className="ion-padding" fullscreen>

                Mint on!
                <br/>
                {walletAddress}

                <div className="App">
                    <div className="container">
                        <div className="header-container">
                            <p className="header">🍭 Candy Drop</p>
                            <p className="sub-text">NFT drop machine with fair mint</p>
                        </div>

                        {/* Check for walletAddress and then pass in walletAddress */}
                        {/*{walletAddress && <CandyMachine walletAddress={window.solana} />}*/}
                    </div>
                </div>

            </IonContent>

        </IonPage>
    );
};

export default Mint;
