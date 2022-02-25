import {
    IonHeader,
    IonRouterLink,
    IonIcon,
    IonToolbar,
    IonMenuButton,
} from "@ionic/react";
import {useEffect, useState} from "react";
import {useHistory, useParams} from 'react-router';
import {
    arrowBack, search,
} from 'ionicons/icons';
import { queryClient } from "../../queryClient";
import SearchBar from "../SearchBar";
import useConnectWallet from "../../hooks/useConnectWallet";
import WalletButton from "../WalletButton";
import {useUser} from "../../context/UserContext";


const HeaderContainer = () => {

    /**
     * States & Variables
     */
    const { id } = useParams<{ id ?: string;}>()
    let history = useHistory();
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const smallHeaderWidth = 1024; // what size browser needs to be, before header goes small mode

    const connectWallet = useConnectWallet();

    const [headerPlaceholder, setHeaderPlaceholder] = useState('');

    let user: any = useUser();
    if(window.location.href.indexOf('localhost') !== -1){
        user = true;
    }

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
            if(window.innerWidth > smallHeaderWidth){
                setShowMobileSearch(false);
            }
            smallPlaceholder();
        }
        // set the placeholder of the header search bar
        function smallPlaceholder(){
            if(window.innerWidth > 1000){
                setHeaderPlaceholder("Search Discord/tweets & view graphs");
            }else{
                setHeaderPlaceholder("Type to search");
            }
        }

        window.addEventListener("resize", resizeWidth);

        onLoad();
        resizeWidth();

        return () => {
            window.removeEventListener("resize", resizeWidth)
        };
    }, [connectWallet]);


    // does the search functionality
    function handleSearch(val: string) {
        val = val.trim();

        if(val.length === 0) return;
        const queryKey = ["messages", id];
        queryClient.resetQueries(queryKey);
        history.push(`/search/${encodeURIComponent(val)}`);
    }

    /**
     * Renders
     */

    return (
        <>

            {/*p-4*/}
            <IonHeader className="">
                <IonToolbar className="bg-card px-4 rounded-lg related verflow-y-auto relative">
                    <div className="justify-between space-x-8 flex items-center">

                        {!showMobileSearch && (
                            <div className="flex items-center space-x-5">
                                {/*hamburger sidebar*/}
                                <div hidden={!user}>
                                <IonMenuButton color="white" menu="sidebar" className="md:hidden" />
                                </div>

                                {/*site logo & home*/}
                                <IonRouterLink
                                    className="text-2xl"
                                    routerLink="/"
                                >
                                    SOL Decoder
                                </IonRouterLink>
                            </div>
                        )}

                        <div  hidden={!user}
                            className={`flex-grow flex items-center ${
                                showMobileSearch
                                    ? 'space-x-8'
                                    : 'lg:max-w-xl justify-end lg:justify-start'
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
                                        ? 'max-w-3xl px-3'
                                        : 'hidden lg:block'
                                }`}
                            >
                                <SearchBar
                                    onSubmit={handleSearch}
                                    initialValue={decodeURIComponent(id ?? '')}
                                    placeholder={headerPlaceholder}
                                    helpMsg='Does an exact match on a single word (ex. "catalina"), or does an exact match on multiple words (ex. "catalina whale").
                                        Results include graphs, and messages you can scroll through. Click on a message to view more'
                                    disableReset='true'
                                />
                            </div>
                            {!showMobileSearch && (
                                <IonIcon
                                    slot="icon-only"
                                    icon={search}
                                    className="lg:hidden cursor-pointer text-2xl hover:opacity-80"
                                    onClick={() => setShowMobileSearch(true)}
                                />
                            )}
                        </div>

                        <div className="hidden md:flex items-center" hidden={showMobileSearch || !user}>
                            {/* below repeated on Header.tsx and App.tsx */}

                            <IonRouterLink href="/schedule" className="pr-7 underline text-inherit">Today's Mints</IonRouterLink>

                            <WalletButton />
                        </div>

                    </div>
                </IonToolbar>
            </IonHeader>
        </>
    );
};

export default HeaderContainer;
