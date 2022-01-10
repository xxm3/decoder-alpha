import {useState, useContext} from 'react';
import {MessageContext} from '../context/context';
import {Message} from '../data/messages';
import {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    useIonViewWillEnter,
} from '@ionic/react';
import {useParams} from 'react-router';
import './ViewMessage.css';

function ViewMessage() {
    const {messages, word} = useContext(MessageContext);
    const [message, setMessage] = useState<Message>();
    const [msgArr, setMsgArr] = useState<string[]>();
    const params = useParams<{ id: string }>();

    useIonViewWillEnter(() => {
        console.clear();
        console.log(messages);
        const msg = messages.find(m => m.id === parseInt(params.id));
        setMessage(msg);
        setMsgArr(msg.message.split(word).filter(v => v !== ''));
        console.log(msg);
        console.log(msgArr);
    });

    return (
        <IonPage id="view-message-page">
            <IonHeader translucent>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton text="Back" defaultHref="/home"></IonBackButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                {message ? (
                    <>

                        <div className="ion-padding font-sans">
                            <h1>Message</h1>
                            <p>{msgArr?.map((w, idx) => {
                                return <span key={idx}>{w}{idx < msgArr.length - 1 ?
                                    <b className="text-cb">{word}</b> : null}</span>
                            })
                            }
                            </p>
                        </div>
                    </>
                ) : (
                    <div>Message not found</div>
                )}
            </IonContent>
        </IonPage>
    );
}

export default ViewMessage;
