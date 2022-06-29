import { IonCard, IonGrid,  IonText } from '@ionic/react';
import { IonRow, IonCol } from '@ionic/react';
import discordImage from '../../../images/discord.png';
import twitterImage from '../../../images/twitter.png';
type props = {  serverData: any; };

const BotServerCard: React.FC<props> = (props) => {

    let { serverData } = props;

    return (
        <IonCard className='ion-no-margin'>
            <div className="cardImage relative">
                {/* image */}
                <img src={serverData?.state?.icon} className={serverData?.state?.icon ? 'cardMainImage' : 'cardNoImage'}  alt='' />
                <div className="cardOverlay-content py-1 px-4">
                    <div className='text-md'>{serverData?.state?.name}</div>
                    <div className="socialMediaIcon">
                        {/*discord*/}
                        <img hidden={!discordImage} src={discordImage} style={{ height: '18px' }} className='cursor-pointer' onClick={(event)=>{
                            event.stopPropagation();
                            if(serverData.state.discord_link){ window.open(serverData.state.discord_link) }}} />

                        {/*twitter*/}
                        <img hidden={!twitterImage} src={twitterImage} style={{ height: '18px' }} className='cursor-pointer' onClick={(event)=>{
                            event.stopPropagation();
                            if(serverData.state.twitter_link){ window.open(serverData.state.twitter_link) }}} />
                    </div>
                </div>
            </div>
            <IonGrid className="py-4 px-4">
                <IonRow hidden={!serverData?.state?.twitter_followers}>
                    <IonCol size="8">
                        <IonText className='text-white'>Twitter Followers</IonText>
                    </IonCol>
                    <IonCol size="4" className="ion-text-end">
                        <IonText className="greenText">{serverData?.state?.twitter_followers || 0 } </IonText>
                    </IonCol>
                </IonRow>

                <IonRow hidden={!serverData?.state?.twitter_interactions}>
                    <IonCol size="8">
                        <IonText className='text-white'>Twitter Interaction</IonText>
                    </IonCol>
                    <IonCol size="4" className="ion-text-end">
                        <IonText className="BlueText">{serverData?.state?.twitter_interactions || 0}</IonText>
                    </IonCol>
                </IonRow>
                <div className="content-extra-space"></div>

                <IonRow hidden={!serverData?.state?.discord_members}>
                    <IonCol size="8">
                        <IonText className='text-white'>Discord Members</IonText>
                    </IonCol>
                    <IonCol size="4" className="ion-text-end">
                        <IonText className="greenText">{serverData?.state?.discord_members || 0}</IonText>
                    </IonCol>
                </IonRow>

                <IonRow hidden={!serverData?.state?.discord_online}>
                    <IonCol size="8">
                        <IonText className='text-white'>Online</IonText>
                    </IonCol>
                    <IonCol size="4" className="ion-text-end">
                        <IonText className="BlueText">{serverData?.state?.discord_online || 0}</IonText>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonCard>
    );
};

export default BotServerCard;
