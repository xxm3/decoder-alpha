import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonIcon,
  IonButton,
  IonLabel,
} from '@ionic/react';
import { readdir } from 'fs';
import { pin, wifi, wine, warning, walk } from 'ionicons/icons';
interface CardProps {
  url: any;
  source: any;
  timestamp: any;
  readableTimestamp: any;
}

const Card: React.FC<CardProps> = ({ url, source, timestamp, readableTimestamp }) => {
  return (
    <>
      <IonCard>
        <IonItem href={url} className="ion-activated">
          <IonIcon icon={wifi} slot="start" />
          <IonLabel>{url}</IonLabel>
        </IonItem>

        <IonItem className="ion-activated">
          <IonIcon icon={wine} slot="start" />
          <IonLabel>{source}</IonLabel>
        </IonItem>

        <IonItem className="ion-activated">
          <IonIcon icon={warning} slot="start" />
          <IonLabel>{timestamp}</IonLabel>
        </IonItem>

        <IonItem>
          <IonIcon icon={walk} slot="start" />
          <IonLabel>{readableTimestamp}</IonLabel>
        </IonItem>
      </IonCard>
    </>
  );
};
export default Card;