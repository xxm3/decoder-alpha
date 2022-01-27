import {useEffect, useState} from 'react';
import {Message} from '../../data/messages';
// import {Moment} from 'moment';
import moment from 'moment'

interface MessageListItemProps {
    idx: any,
    message: Message;
    word: string,
}

const MessageListItem: React.FC<MessageListItemProps> = ({message, idx, word}) => {

    const [msgArr, setMsgArr] = useState<string[]>();
    useEffect(() => {
        // console.log(`MessageListItem ${JSON.stringify(message)} rendered`);

        setMsgArr(message.message.split(word));
    }, []);

    const getDateAgo = function (time: any){
        return moment(time).fromNow();
    }

    // let msg=message.message;
    // let msgArr2=msg.toLowerCase().split(word);
    // let stringBefore;
    // let stringAfter;
    // stringBefore =msgArr2.shift();
    // stringBefore= stringBefore.substring(stringBefore.length-100);
    // stringAfter =" "+msgArr2?.join(word).substring(0,(100-stringBefore.length));

    return (
        <div className="relative bg-bg-primary p-2 rounded-xl"> {/* bg-slate-200 */}
                {/* <Link to={`/message/${message.id}`} > */}

            <p className="text-lg text-white">
                <span className="text-gray-500 font-bold">{`${getDateAgo(message.time)}: `}</span>
                <br/>

                {/* show the message and highlight matches */}
                {msgArr?.map((w, idx) => {
                    return <span key={idx}>
                                {w}{idx < msgArr.length - 1 ? <b className="text-cb">{word}</b> : null}
                            </span>
                    })
                }

                {/* {stringBefore}<b className="text-cb">{word}</b>{stringAfter.length>1? stringAfter+"....":stringAfter} */}
            </p>

            {/* <span className="absolute bg-green-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">{idx}</span> */}
            {/*<div className="absolute top-0 right-0 flex space-x-2 p-4"></div>*/}

            {/* </Link> */}
        </div>

    );
};

export default MessageListItem;
