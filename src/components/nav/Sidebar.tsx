import { IonList } from "@ionic/react"
import { calendarClearOutline, homeOutline, logoFirefox } from "ionicons/icons"
import NavLink from "./NavLink"

function Sidebar() {
  return (
      <IonList lines="none" className="px-2">
          <NavLink title="Home" icon={homeOutline} to="/" />
          <NavLink
              title="Today's Mints"
              icon={calendarClearOutline}
              to="/schedule"
          />
          <NavLink title="Fox Token" icon={logoFirefox} to="/" />
      </IonList>
  );
}

export default Sidebar