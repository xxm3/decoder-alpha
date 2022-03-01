import { IonList } from "@ionic/react"
import { calendarClearOutline, homeOutline, logoFirefox } from "ionicons/icons"
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
              <NavLink title="Fox Token" icon={logoFirefox} to="/foxtoken" />
          </IonList>
      </>
  );
}

export default Sidebar