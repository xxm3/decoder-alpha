import { IonList } from "@ionic/react"
import { calendarClearOutline, homeOutline, logoFirefox } from "ionicons/icons"
import Style from "../Style";
import NavLink from "./NavLink"

interface Props {
	collapsible ?: boolean;
}
function Sidebar({ collapsible }: Props) {
  return (
      <>
          <Style>
              {`
				  	ion-list {
						  border-color: var(--ion-color-step-150);
					}
			`}
          </Style>
          <IonList
              lines="none"
              className={`px-2 border-r ${
                  collapsible
                      ? 'hidden md:block min-w-max lg:flex-grow lg:max-w-xs'
                      : ''
              }`}
          >
              <NavLink title="Home" icon={homeOutline} to="/" />
              <NavLink
                  title="Today's Mints"
                  icon={calendarClearOutline}
                  to="/schedule"
              />
              <NavLink title="Fox Token" icon={logoFirefox} to="/" />
          </IonList>
      </>
  );
}

export default Sidebar