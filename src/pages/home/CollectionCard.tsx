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
  IonContent,
} from '@ionic/react';
import { readdir } from 'fs';
import { pin, wifi, wine, warning, walk } from 'ionicons/icons';
interface CollectionCardProps {
  name: any;
  description: any;
  image: any;
  website: any;
  twitter: any;
  discord: any;
  categories: any;
  splitName: any;
  link: any;
  timestamp: any;
  readableTimestamp: any;
}
const CollectionCard: React.FC<CollectionCardProps> = ({ name, description, image, twitter, discord, categories, splitName, link, timestamp, readableTimestamp  }) => {

  return (
    <IonCard className="bg-lime-700">
      <img src={image} />
      <IonCardHeader> 
        <IonCardSubtitle>Destination</IonCardSubtitle>
        <IonCardTitle>{name}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {description}
      </IonCardContent>
    </IonCard>
  );
};
export default CollectionCard;