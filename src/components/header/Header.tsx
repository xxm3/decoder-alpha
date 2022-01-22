import './HeaderContainer.css';
import { IonButton, IonButtons, IonHeader, IonRouterLink, IonIcon, IonToolbar, IonTitle, IonInput, IonItem, IonSearchbar} from "@ionic/react";
import React, { useEffect, useState,forwardRef, useRef, useImperativeHandle } from "react";
import { useHistory } from 'react-router';
import { attachProps } from '@ionic/react/dist/types/components/utils';
import { personCircle, search, helpCircle, star, create, ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons';
// @ts-ignore
const HeaderContainer = ({ mintAddrToParent, showflag, onClick }) => {
    //region States & Variables
    let history = useHistory();
    const [walletAddress, setWalletAddress] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchvalue, setInput] = useState('');
    const [searchText, setSearchText] = useState('');
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    //endregion
    //region Functions
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
    //endregion
    //region Renders
    const renderNotConnectedContainer = () => (
        <IonButton onClick={connectWallet} className={"text-white bg-orange-500 absolute inset-y-0 right-0 w-32 text-xs"}>Select Wallet</IonButton>
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
    //endregion
    // @ts-ignore
    return (
        <React.Fragment>
            <IonHeader className="all">
                <IonToolbar color="Dark">
                    <IonItem>
                        <IonInput color="success" minlength={3} value={searchvalue} placeholder="Search" onIonChange={e => setInput(e.detail.value!)}></IonInput>
                        <IonButton color="success" className="rounded-lg">
                            <IonIcon slot="icon-only" icon={search} className="rounded-b-3xl"/>
                        </IonButton>
                    </IonItem>
                    {isWalletConnected && <IonButtons slot="primary">
                        <IonButton color="success">
                            Connect Wallet
                        </IonButton>
                    </IonButtons>}
                    <IonTitle>SOL Decoder</IonTitle>
                </IonToolbar>
            </IonHeader>
        </React.Fragment>
    );
};

export default HeaderContainer;
