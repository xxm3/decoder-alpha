import { css } from "@emotion/react";
import {IonList} from "@ionic/react"
import {book, calendarClearOutline, homeOutline, logoFirefox, notifications, search, statsChart} from "ionicons/icons"
import NavLink from "./NavLink"

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
                    title="Fox WL Token Market"
                    icon="/assets/icons/FoxTokenLogo.svg"
                    to="/foxtoken"
                    isIconSvg={true}
                />
                <NavLink
                    title="Mint Stats"
                    icon={statsChart}
                    to="/mintstats"
                />
                <NavLink
                    title="Stacked Line Search"
                    icon={search}
                    to="/stackedsearch"
                />
                <NavLink
                    title="Alerts"
                    icon={notifications}
                    to="/alerts"
                />
                <NavLink
                    title="Docs"
                    icon={book}
                    to="#"
                    external={'https://docs.soldecoder.app/books/site-and-discord-overview/page/sol-decoder-overview'}
                />

            </IonList>
        </>
    );
}

export default Sidebar
