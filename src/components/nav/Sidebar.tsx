import { css } from "@emotion/react";
import {IonButton, IonIcon, IonList, IonMenuToggle, IonContent } from "@ionic/react"
import {
    bookOutline,
    calendarClearOutline,
    close,
    homeOutline,
    logoTwitter,
    notificationsOutline,
    searchOutline,
    statsChartOutline,
    skullOutline
} from "ionicons/icons"
import NavLink from "./NavLink"
import WalletButton from '../WalletButton';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { auth } from "../../firebase";
import { VERSION_CODE } from '../../environments/environment'
import { useState,useEffect } from "react";

function Sidebar() {
	const isDemo = useSelector<RootState>(state => state.demo.demo);
    const [isMobile,setIsMobile] = useState(false)

    useEffect(() => {
        if (window.innerWidth < 525){
            setIsMobile(true)
        }
    }, [window.innerWidth])

    return (
        <>
        <IonContent>
            <div className={`px-2 ${isMobile ? '' :'h-full'}`}>
            <IonList
                lines="none"
                className={`px-2 h-full ${isMobile ? '' : 'border-r'} md:max-w-max lg:max-w-none`}
                css={css`
                    border-color: var(--ion-color-step-150);
                `}
            >
                {isDemo && (
                   <IonMenuToggle menu="sidebar">
                   	 <IonButton
	                        color="primary"
							fill="outline"
	                        hidden={!isDemo}
	                        className="relative sm:hidden flex  space-x-1 hover:opacity-90 items-center"
	                        onClick={(e) => {
	                            auth.signOut();
	                        }}
							size="default"
							css={css`
								--vertical-padding: 20px;
								--padding-bottom: var(--vertical-padding);
								--padding-top: var(--vertical-padding);
							`}
	                    >
	                        <p className="text-white">demo</p>
	                        <IonIcon className="text-white" icon={close} />
	                    </IonButton>
                   </IonMenuToggle>
                )}
                <NavLink title="Home" icon={homeOutline} to="/" />
                <NavLink
                    title="Today's Mints"
                    icon={calendarClearOutline}
                    to="/schedule"
                />
                <NavLink
                    title="Fox Token Market"
                    icon="/assets/icons/FoxTokenLogo.svg"
                    to="/foxtoken"
                    isIconSvg={true}
                />
                <NavLink
                    title="Mint Stats"
                    icon={statsChartOutline}
                    to="/mintstats"
                />
                <NavLink
                    title="Stacked Line Search"
                    icon={searchOutline}
                    to="/stackedsearch"
                />
                <NavLink
                    title="Alerts"
                    icon={notificationsOutline}
                    to="/alerts"
                />
                {/* bot page hide for now do not remove */}
                <NavLink
                    title="Bots"
                    icon={skullOutline}
                    to="/bots"
                />
                <NavLink
                    title="Docs"
                    icon={bookOutline}
                    to="#"
                    external={'https://docs.soldecoder.app'}
                />
                <NavLink
                    title="Twitter"
                    icon={logoTwitter}
                    to="#"
                    external={'https://twitter.com/SOL_Decoder'}
                />

                <div className="xl:hidden lg:hidden md:hidden">
                    <WalletButton />
                </div>
               <div className="text-center mt-4 text-white-500">Version <b>{VERSION_CODE}</b></div> 
                
            </IonList>
            </div>
            </IonContent>
        </>
    );
}

export default Sidebar
