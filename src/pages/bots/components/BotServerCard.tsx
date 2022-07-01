import { IonButton, IonCard, IonGrid,  IonText } from '@ionic/react';
import { IonRow, IonCol } from '@ionic/react';
import { useEffect,useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import discordImage from '../../../images/discord.png';
import twitterImage from '../../../images/twitter.png';
type props = {  serverData: any; };

const BotServerCard: React.FC<props> = (props) => {

    let { serverData } = props;
    let history = useHistory();
    const { serverId } = useParams<any>();
    const path:any = useLocation();
    const [initiateButton, setInitiateButton] = useState<boolean>(false)

    useEffect(() => {
        let pathSlice = path.pathname.slice(1, 15)
        if(pathSlice === 'seamlessdetail'){
            setInitiateButton(false)
        }else{
            setInitiateButton(true)
        }
    }, [path])

    return (
        <IonCard className='ion-no-margin'>
            <div className="cardImage relative">

                {/* image */}
                <img src={serverData?.image} className={serverData?.image ? 'cardMainImage' : 'cardNoImage'}  alt='' />

                <div className="cardOverlay-content py-1 px-4">

                    <div className='text-lg font-bold'>{serverData?.name}</div>

                    <div className="socialMediaIcon">
                        {/*discord*/}
                        <img hidden={!serverData?.discord_link} src={discordImage} style={{ height: '18px' }} className='cursor-pointer' onClick={(event)=>{
                            event.stopPropagation();
                            if(serverData?.discord_link){ window.open(serverData?.discord_link) }}} />

                        {/*twitter*/}
                        <img hidden={!serverData?.twitter_link} src={twitterImage} style={{ height: '18px' }} className='cursor-pointer' onClick={(event)=>{
                            event.stopPropagation();
                            if(serverData?.twitter_link){ window.open(serverData?.twitter_link) }}} />
                    </div>
                </div>
            </div>
            <IonGrid className="py-4 px-4">
                <IonRow hidden={!serverData?.twitter_followers}>
                    <IonCol size="8">
                        <IonText className='text-white'>Twitter Followers</IonText>
                    </IonCol>
                    <IonCol size="4" className="ion-text-end">
                        <IonText className="greenText">{serverData?.twitter_followers || 0 } </IonText>
                    </IonCol>
                </IonRow>

                <IonRow hidden={!serverData?.twitter_interactions}>
                    <IonCol size="8">
                        <IonText className='text-white'>Twitter Interaction</IonText>
                    </IonCol>
                    <IonCol size="4" className="ion-text-end">
                        <IonText className="BlueText">{serverData?.twitter_interactions || 0}</IonText>
                    </IonCol>
                </IonRow>
                <div className="content-extra-space"></div>

                <IonRow hidden={!serverData?.discord_members}>
                    <IonCol size="8">
                        <IonText className='text-white'>Discord Members</IonText>
                    </IonCol>
                    <IonCol size="4" className="ion-text-end">
                        <IonText className="greenText">{serverData?.discord_members || 0}</IonText>
                    </IonCol>
                </IonRow>

                <IonRow hidden={!serverData?.discord_online}>
                    <IonCol size="8">
                        <IonText className='text-white'>Online</IonText>
                    </IonCol>
                    <IonCol size="4" className="ion-text-end">
                        <IonText className="BlueText">{serverData?.discord_online || 0}</IonText>
                    </IonCol>
                </IonRow>
                {initiateButton &&
                    <IonRow>
                        <IonCol size="12">
                            <IonButton className="cardButton w-full" onClick={(event) => {
                                event.stopPropagation()
                                history.push({pathname:`/seamlessdetail/${serverId}`,state:serverData})} }>
                                Initiate Seamless
                            </IonButton>
                        </IonCol>
                    </IonRow>
                 }
            </IonGrid>
        </IonCard>
    );
};

export default BotServerCard;
