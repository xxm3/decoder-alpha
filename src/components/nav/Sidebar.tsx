import { css } from "@emotion/react";
import { IonList } from "@ionic/react"
import { calendarClearOutline, homeOutline, logoFirefox, search, statsChart } from "ionicons/icons"
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
              <NavLink title="Home" icon={homeOutline} to="/" />
              <NavLink
                  title="Today's Mints"
                  icon={calendarClearOutline}
                  to="/schedule"
              />
              <NavLink
                  title="WL Token Market"
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
          </IonList>
      </>
  );
}

export default Sidebar
