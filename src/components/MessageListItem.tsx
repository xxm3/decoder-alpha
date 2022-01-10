import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Message} from '../data/messages';

interface MessageListItemProps {
    idx: any,
    message: Message;
    word: string,
}

const MessageListItem: React.FC<MessageListItemProps> = ({message, idx, word}) => {
    const [msgArr, setMsgArr] = useState<string[]>();
    useEffect(() => {
        console.log(`MessageListItem ${JSON.stringify(message)} rendered`);
        const msg = message;
        setMsgArr(msg.message.split(word));
    }, []);
    // let msg=message.message;
    // let msgArr2=msg.toLowerCase().split(word);
    // let stringBefore;
    // let stringAfter;
    // stringBefore =msgArr2.shift();
    // stringBefore= stringBefore.substring(stringBefore.length-100);
    // stringAfter =" "+msgArr2?.join(word).substring(0,(100-stringBefore.length));
    return (
        <div className="relative bg-white p-3 rounded-xl">
            {/* <Link to={`/message/${message.id}`} > */}
            <p className="text-lg  font-bold text-gray-800">
                <span className="text-gray-500">{`${message.time}: `}</span>
                {msgArr?.map((w, idx) => {
                    return <span key={idx}>{w}{idx < msgArr.length - 1 ?
                        <b className="text-cb">{word}</b> : null}</span>
                })
                }
                {/* {stringBefore}<b className="text-cb">{word}</b>{stringAfter.length>1? stringAfter+"....":stringAfter}
             */}

            </p>
            {/* <span className="absolute bg-green-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">{idx}</span> */}
            <div className="absolute top-0 right-0 flex space-x-2 p-4">
            </div>
            {/* </Link> */}
        </div>


        // <div className={`flex items-center gap-4 p-4 ${idx%2?'bg-cbmd hover:bg-cb':'bg-cbgld hover:bg-cb'}`}>
        //     <div className="flex flex-col">
        //     <a href={`/message/${message.id}`}>
        //       <strong className="text-white text-sm font-medium">{message.message.substring(0,100)}</strong>
        //     </a>
        //     </div>
        // </div>


        //     <IonItem routerLink={`/message/${message.id}`} detail={false}>
        //   {/* <div slot="start" className="dot dot-unread"></div>
        //   <IonLabel className="ion-text-wrap">
        //     <h2>
        //       {message.fromName}
        //       <span className="date">
        //         <IonNote>{message.date}</IonNote>
        //       </span>
        //     </h2>
        //     <h3>{message.subject}</h3>
        //     <p>
        //       Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        //     </p>
        //   </IonLabel> */}
        // </IonItem>
    );
};

export default MessageListItem;
