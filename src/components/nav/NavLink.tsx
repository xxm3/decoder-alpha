
import { IonIcon, IonItem, IonRouterLink } from "@ionic/react";
import { useLocation } from "react-router";
import Style from "../Style";

interface Props {
	to : string;
	icon : string;
	title : string;
}

function NavLink({ to , icon , title,} : Props) {
  return (
      <IonRouterLink href={to}>
          <Style>
              {`
				ion-item:hover {
					--background: var(--ion-color-primary)
				}
				ion-icon {
				}
			`}
          </Style>
          <IonItem className="items-center space-x-3 my-6 rounded-none md:rounded lg:rounded-none">
              <IonIcon color="inherit" icon={icon} />
              <p className="block md:hidden lg:block">{title}</p>
          </IonItem>
      </IonRouterLink>
  );
}

export default NavLink