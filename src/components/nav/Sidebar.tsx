import { css } from "@emotion/react";
import {IonList} from "@ionic/react"
import {
    bookOutline,
    calendarClearOutline,
    homeOutline,
    logoTwitter,
    notificationsOutline,
    searchOutline,
    statsChartOutline
} from "ionicons/icons"
import NavLink from "./NavLink"
import WalletButton from '../WalletButton';

function Sidebar() {
    return (
        <>
            <IonList
                lines="none"
                className={`px-2 h-full border-r md:max-w-max lg:max-w-none`}
				css={css`
				  border-color: var(--ion-color-step-150);
			  `}
            >
                <NavLink
                    title="Home"
                    icon={homeOutline}
                    to="/"
                />
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

                <div
                    className="xl:hidden lg:hidden md:hidden"
                >
                    <WalletButton />
                </div>

            </IonList>
        </>
    );
}

export default Sidebar
