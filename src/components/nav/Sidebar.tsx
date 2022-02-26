import { IonCol, IonContent, IonGrid, IonList, IonRow } from "@ionic/react"
import { calendarClearOutline, homeOutline, logoFirefox } from "ionicons/icons"
import NavLink from "./NavLink"
import WalletButton from "../WalletButton"


function Sidebar() {
  return (
	<IonContent>
		<IonGrid className="ion-padding">
		<IonRow>
			<IonCol size="12">
				{/* below repeated on Header.tsx and App.tsx */}
	
				<WalletButton />
				
			</IonCol>
		</IonRow>
		<IonRow>
			<IonCol size="12">
				{/* below repeated on Header.tsx and App.tsx */}
				<IonList lines="none">
					<NavLink title="Home" icon={homeOutline} to="/"/>
					<NavLink title="Today's Mints" icon={calendarClearOutline} to="/schedule"/>
					<NavLink title="Fox Token" icon={logoFirefox} to="/"/>
				</IonList>
				
			</IonCol>
		</IonRow>
	</IonGrid>
	</IonContent>
  )
}

export default Sidebar