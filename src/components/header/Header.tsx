import './HeaderContainer.css';
import { IonButton, IonButtons, IonHeader, IonRouterLink, IonIcon, IonToolbar, IonTitle, IonInput, IonItem, IonSearchbar} from "@ionic/react";
import React, { useEffect, useState,forwardRef, useRef, useImperativeHandle } from "react";
import { useHistory } from 'react-router';
import { attachProps } from '@ionic/react/dist/types/components/utils';
import {
    personCircle,
    search,
    helpCircle,
    star,
    create,
    ellipsisHorizontal,
    ellipsisVertical,
    menuOutline
} from 'ionicons/icons';

// @ts-ignore
const HeaderContainer = ({ mintAddrToParent, showflag, onClick }) => {

    //region States & Variables
    let history = useHistory();
    const [walletAddress, setWalletAddress] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchvalue, setInput] = useState('');
    const [searchText, setSearchText] = useState('');
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);
    //endregion

    window.onresize = () => {
        resizeWidth();
    };

    function resizeWidth() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', resizeWidth);
        return () => window.removeEventListener('resize', resizeWidth);
    }, []);

    // region Functions
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
                        <h3>SOL Decoder</h3>

                        {/* TODO: could be some variable width or something, IF want to keep this in here... */}
                        <span style={{width: '400px' }}></span>

                        {/*<IonInput color="success"  minlength={3} value={searchvalue} placeholder="Search" onIonChange={e => setInput(e.detail.value!)}></IonInput>*/}
                        {/*<IonButton color="success" className="rounded-lg">*/}
                        {/*    <IonIcon slot="icon-only" icon={search} className="rounded-b-3xl"/>*/}
                        {/*</IonButton>*/}

                        {/* big screens */}
                        {width > 750 && (
                        <div className="xs:flex items-center rounded-lg overflow-hidden px-2 py-1 ">
                            <IonSearchbar className="xs-flex text-base text-gray-400 flex-grow outline-none px-2 "
                                          type="text" value={searchText} onIonChange={e => {
                                setSearchText(e.detail.value!)
                            }} animated placeholder="Type to search" disabled={isLoading}  style={{width: '600px' }} />
                                                                    {/* TODO: probably don't want this to be 600px ... maybe a min and max width? */}

                            <div className="xs:flex px-2 rounded-lg space-x-4 mx-auto ">
                                {/*TODO: needs a green background on this button */}
                                <IonIcon slot="icon-only" icon={search} className="rounded-b-3xl"/>
                                {/*<IonButton className=" text-white text-base rounded-lg" onClick={() => onClick}*/}
                                {/*           animate-bounce disabled={searchText === ''}>*/}
                                {/*    Search*/}
                                {/*</IonButton>*/}
                            </div>

                            {/*TODO: need this to float right */}
                            {!isWalletConnected &&
                                <IonButton color="success" className="float-right">
                                    Connect Wallet
                                </IonButton>
                            }
                        </div>
                        )}

                        {/* small screens */}
                        {width < 750 && (
                        <div className="float-right">
                            <div className="xs:flex items-center px-2 rounded-lg space-x-4 mx-auto ">
                                <IonIcon slot="icon-only" icon={search} className="rounded-b-3xl"/>
                                {/*<IonButton className=" text-white text-base rounded-lg" onClick={() => onClick}*/}
                                {/*           animate-bounce disabled={searchText === ''}>*/}
                                {/*    Search*/}
                                {/*</IonButton>*/}
                            </div>

                            <div className="xs:flex items-center px-2 rounded-lg space-x-4 mx-auto ">
                                <IonIcon slot="icon-only" icon={menuOutline} className="rounded-b-3xl"/>
                            </div>
                        </div>
                        )}

                    </IonItem>

                </IonToolbar>
            </IonHeader>

        </React.Fragment>
    );
};

export default HeaderContainer;
