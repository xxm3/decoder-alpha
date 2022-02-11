import {
    IonHeader,
    IonRouterLink,
    IonIcon,
    IonToolbar,
    IonMenuButton,
} from "@ionic/react";
import {useEffect, useMemo, useState} from "react";
import {useHistory, useParams} from 'react-router';
import {
    arrowBack, search,
} from 'ionicons/icons';
import { queryClient } from "../../queryClient";
import SearchBar from "../SearchBar";
import useConnectWallet from "../../hooks/useConnectWallet";
import { useSelector } from 'react-redux'
import { RootState } from "../../redux/store";
import WalletButton from "../WalletButton";


const HeaderContainer = () => {

    /**
     * States & Variables
     */
    const { id } = useParams<{ id ?: string;}>()
    let history = useHistory();
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const smallHeaderWidth = 768; // what size browser needs to be, before header goes small mode

    const connectWallet = useConnectWallet()
    const walletAddress = useSelector((state : RootState) => state.wallet.walletAddress)

    const smallerWallet = useMemo(() =>
        walletAddress ? walletAddress.substring(0, 4) + '...' + walletAddress.substring(walletAddress.length - 4)
            : '', [walletAddress])

    // onload useEffect
    useEffect(() => {
        const onLoad = async () => {
            // connecting SOL wallet
            try {
                await connectWallet({onlyIfTrusted: true});
            } catch (error) {
                console.error(error);
            }
        };

        // resize window stuff
        function resizeWidth() {
            if(window.innerHeight > smallHeaderWidth){
                setShowMobileSearch(false)
            }
        }

        window.addEventListener("resize", resizeWidth);
        onLoad();
        return () => {
            window.removeEventListener("resize", resizeWidth)
        };
    }, [connectWallet]);


    // does the search functionality
    function handleSearch(val: string) {
        if(val.length === 0) return;
        const queryKey = ["messages", id];
        queryClient.resetQueries(queryKey);
        history.push(`/search/${encodeURIComponent(val)}`);
    }

    function todaysMintsLink(){
        history.push(`/schedule`);
    }

    /**
     * Renders
     */

    return (
        <>

            <IonHeader className="p-4">
                <IonToolbar className="bg-card px-4 rounded-lg related">
                    <div className="justify-between space-x-8 flex items-center relative">
                        {!showMobileSearch && (
                            <div className="flex items-center space-x-5">
                                <IonMenuButton color="white" menu="sidebar" className="md:hidden" />
                                <IonRouterLink
                                    className="text-2xl"
                                    routerLink="/"
                                >
                                    SOL Decoder
                                </IonRouterLink>
                            </div>
                        )}

                        <div
                            className={`flex-grow flex items-center ${
                                showMobileSearch
                                    ? 'space-x-8'
                                    : 'md:max-w-xl justify-end md:justify-start'
                            }`}
                        >
                            {showMobileSearch && (
                                <IonIcon
                                    slot="icon-only"
                                    icon={arrowBack}
                                    className="text-3xl cursor-pointer hover:opacity-80"
                                    onClick={() => setShowMobileSearch(false)}
                                />
                            )}
                            <div
                                className={`flex-grow ${
                                    showMobileSearch
                                        ? 'max-w-xl'
                                        : 'hidden md:block'
                                }`}
                            >
                                {/*TODO: need smaller placeholder ('type to search') when screen small */}
                                <SearchBar
                                    onSubmit={handleSearch}
                                    initialValue={decodeURIComponent(id ?? '')}
                                    placeholder="Search for graphs, Discord messages, and tweets"
                                />
                            </div>
                            {!showMobileSearch && (
                                <IonIcon
                                    slot="icon-only"
                                    icon={search}
                                    className="md:hidden cursor-pointer text-2xl hover:opacity-80"
                                    onClick={() => setShowMobileSearch(true)}
                                />
                            )}
                        </div>

                        <div className="hidden md:block float-right" hidden={showMobileSearch}>
                            {/* below repeated on Header.tsx and App.tsx */}

                            {/*TODO-parth: how can make onclick work? it brings me to schedule page then back */}
                            {/*<a href="" onClick={() => todaysMintsLink()}>Today's Mints</a>*/}
                            <a href="/schedule" className="pr-7 underline">Today's Mints</a>

                            {!walletAddress ? (
                                  <WalletButton />
                            ) : (
                                <>
                                    <span className="">
                                        {smallerWallet}
                                    </span>
                                </>
                            )}
                        </div>

                    </div>
                </IonToolbar>
            </IonHeader>
        </>
    );
};

export default HeaderContainer;
