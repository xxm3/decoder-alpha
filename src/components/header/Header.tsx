import './Header.css';
import {
    IonButton,
    IonButtons,
    IonHeader,
    IonRouterLink,
    IonIcon,
    IonToolbar,
    IonTitle,
    IonInput,
    IonItem,
    IonSearchbar
} from "@ionic/react";
import React, {useEffect, useState, forwardRef, useRef, useImperativeHandle} from "react";
import {useHistory} from 'react-router';
import {attachProps} from '@ionic/react/dist/types/components/utils';
import {
    personCircle,
    search,
    helpCircle,
    star,
    create,
    ellipsisHorizontal,
    ellipsisVertical,
    menuOutline, closeOutline
} from 'ionicons/icons';

// @ts-ignore
const HeaderContainer = ({mintAddrToParent, showflag, onClick}) => {

    /**
     * States & Variables
     */
    let history = useHistory();
    const [walletAddress, setWalletAddress] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);

    /**
     * Use Effects
     */
    // resizing window
    useEffect(() => {
        window.addEventListener('resize', resizeWidth);
        return () => window.removeEventListener('resize', resizeWidth);
    }, []);

    // connecting SOL wallet
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
     * Functions
     */
    // resizing the window
    window.onresize = () => {
        resizeWidth();
    };

    function resizeWidth() {
        setWidth(window.innerWidth);
    }

    // for connecting to SOL wallet
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
                    setIsWalletConnected(true);
                }
            } else {
                alert('Get a Phantom Wallet 👻');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // connect to your SOL wallet
    const connectWallet = async () => {
        // @ts-ignore
        const {solana} = window;
        if (solana) {
            const response = await solana.connect();
            console.log('Connected with Public Key:', response.publicKey.toString());
            setWalletAddress(response.publicKey.toString());
        }
    };

    // does the search functionality
    function handleSearch(val: any) {
        // if (typeof (searchValue) !== "undefined" && searchValue !== '') {
        //     history.push(`/search/${searchValue}`);
        if (typeof (val) !== "undefined" && val !== '') {
            history.push(`/search/${val}`);
            window.location.reload();
        } else {
            history.push('/');
        }
    }

    // when typing into the search bar
    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            setSearchValue(e.target.value!);
            handleSearch(e.target.value);
        }
    }

    // clicked on search button, when on mobile
    const mobileSearchClicked = () => {
        setShowMobileSearch(!showMobileSearch);
    }

    /**
     * Renders
     */

    // @ts-ignore
    return (
        <React.Fragment>
            <IonHeader className="m-4 ">
                <IonToolbar className="bg-card rounded-lg">

                    {/* Big Screens */}
                    {( // width > 750 &&
                        <IonItem>
                            <IonRouterLink className="text-2xl" routerLink="/" hidden={width < 750 && showMobileSearch}>SOL
                                Decoder</IonRouterLink>

                            <span style={{width: '100px'}}> </span>

                            <div className="xs:flex items-center rounded-lg overflow-hidden px-2 py-1 ">

                                {/* search bar */}
                                <IonSearchbar className="xs-flex text-base text-gray-400 flex-grow outline-none px-2 "
                                              type="text"
                                              value={searchValue}
                                              onKeyPress={handleKeyDown}
                                              onIonChange={e => setSearchValue(e.detail.value!)}
                                              animated placeholder="Type to search" disabled={isLoading}
                                              style={{width: '450px'}}
                                              hidden={width < 750 && !showMobileSearch} />

                                {/* mobile search stuff */}
                                {width < 750 && (
                                <>
                                    {/*show search*/}
                                    <div className="xs:flex px-2 rounded-lg space-x-4 mx-auto bg-success-1"
                                         onClick={mobileSearchClicked} hidden={showMobileSearch}>
                                        <IonIcon slot="icon-only" icon={search} className=" " />
                                    </div>

                                    {/*hide search*/}
                                    <div className="xs:flex px-2 rounded-lg space-x-4 mx-auto bg-success-1"
                                        onClick={mobileSearchClicked}>
                                        <IonIcon slot="icon-only" icon={closeOutline} className=" " hidden={!showMobileSearch} />
                                    </div>
                                </>
                                )}

                                {/*wallet stuff*/}
                                {!isWalletConnected &&
                                    <span></span>
                                    // <IonButton color="success" className="float-right" onClick={() => connectWallet()}>
                                    //     Connect Wallet
                                    // </IonButton>
                                }
                                {isWalletConnected &&
                                    <span></span>
                                    // ${walletAddress}
                                }

                                {/* hamburger, to connect wallet on mobile */}

                                {/*
                                    TO.DO: don't implement - will be implemented in https://gitlab.com/nft-relay-group/frontend-app/-/issues/16
                                */}
                                {/*{width < 750 && (*/}
                                {/*    <div className="xs:flex items-center px-2 rounded-lg space-x-4 mx-auto bg-success-1">*/}
                                {/*        <IonIcon slot="icon-only" icon={menuOutline} className="rounded-b-3xl"/>*/}
                                {/*    </div>*/}
                                {/*})*/}

                            </div>
                        </IonItem>
                    )}

                </IonToolbar>
            </IonHeader>
        </React.Fragment>
    );
};

export default HeaderContainer;
