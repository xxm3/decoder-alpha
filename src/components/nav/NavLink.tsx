
import { IonIcon, IonItem, IonRouterLink } from "@ionic/react";
import { useLocation } from "react-router";

interface Props {
	to : string;
	icon : string;
	title : string;
}

function NavLink({ to , icon , title,} : Props) {
  return (
      <IonRouterLink href={to}>
         <IonItem 
		 	className="items-center space-x-3 my-6"
		>
         	<IonIcon color="inherit" icon={icon} />
			 <p>{title}</p>
         </IonItem>
      </IonRouterLink>
  );
}

export default NavLink