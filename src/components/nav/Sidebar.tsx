import { IonList } from "@ionic/react"
import { calendarClearOutline, homeOutline, logoFirefox, search, statsChart } from "ionicons/icons"
import Style from "../Style";
import NavLink from "./NavLink"

function Sidebar() {
  return (
      <>
		<Style>
			{`
				ion-list {
					border-color: var(--ion-color-step-150)
				}
			`}
		</Style>
          <IonList
              lines="none"
              className={`px-2 h-full border-r md:max-w-max lg:max-w-none`}
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
                  // TODO
                  to="/mintstats"
              />
              <NavLink
                  title="Stacked Line Search"
                  icon={search}
                  // TODO
                  to="/stackedsearch"
              />
          </IonList>
      </>
  );
}

export default Sidebar
