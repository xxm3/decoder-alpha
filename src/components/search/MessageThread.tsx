import { IonButton, IonContent, IonModal, useIonToast } from '@ionic/react';
import React, { useEffect, useRef , useState} from 'react';
import { Message } from '../../types/Message';
import MessageListItem from './MessageListItem';
import { QueryFunctionContext, useInfiniteQuery } from 'react-query';
import { instance } from '../../axios';
import { AxiosResponse } from 'axios';
import ReactTooltip from "react-tooltip";
import SearchSkeleton from "./SearchSkeleton"
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from '@socket.io/component-emitter';
import Loader from '../Loader';


interface MessageThreadProps {
    message: Message;
    onClose: Function;
}

type MessageThreadQueryKey = readonly ['messageThread', string];
type PageParam =
    | { priorLimit: number; postLimit: number; messageId: string; message: any }
    | undefined;

interface MessageThreadData {
    priorMsg: Message[];
    subsequentMsg: Message[];
}

const MessageThread: React.FC<MessageThreadProps> = ({
    message,
    message: { id },
    onClose,
}) => {
    const defaultPageParam: PageParam = {
        messageId: message.id,
        message: message,
        priorLimit: 5,
        postLimit: 100,
        // #s REPEATED on MessageThread.tsx & priorAndSubsequent.js
    };

    const mainMessageRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(true)
    const [isMobile, setIsMobile] = useState(false);
    const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [present, dismiss] = useIonToast();
    const [socketVar,setSocketVar] = useState<any>()
    const [dataPages,setDatapages] = useState<any>([])
    const role = localStorage.getItem('role')
    let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

    async function fetchContext({ pageParam = defaultPageParam}: QueryFunctionContext<MessageThreadQueryKey, PageParam>) {
        try {
            const { data } = await instance.post<MessageThreadData>('/getPriorAndSubMessages', pageParam );
                data.subsequentMsg = data?.subsequentMsg?.map(message => ({
                    ...message,
                    // @ts-expect-error
                    time : message.time ? message.time : message.time_stamp
                }))

            if (pageParam === defaultPageParam)
                // return [...data.priorMsg, message, ...data.subsequentMsg];
                return [message, ...data.subsequentMsg];
            // return [...data.priorMsg, ...data.subsequentMsg];
            return [...data.subsequentMsg];

        } catch (e) {
            console.error('try/catch in MessageThread.tsx: ', e);
            const error = e as Error & { response?: AxiosResponse };

            // if (error && error.response) {
            //     throw new Error(String(error.response.data.body));
            // } else {
            //     throw new Error('Unable to connect. Please try again later');
            // }

            return [];
        }
    }


    const {
        data = { pages: [] },
        hasNextPage,
        fetchNextPage,
        fetchPreviousPage,
    } = useInfiniteQuery(['messageThread', message.id], fetchContext, {
        getNextPageParam: (lastPage): PageParam => {
            const lastMessageId =  lastPage?.slice(-1)[0]?.id;
            return lastMessageId
                ? {
                      messageId: lastMessageId,
                      message: null,
                      postLimit: 10,
                      priorLimit: 0,
                  }
                : undefined;
        },
        getPreviousPageParam: (firstPage) => {
            let firstMessageId
            if(firstPage[0]){
                firstMessageId = firstPage[0].id;
            }
            return firstMessageId
                ? {
                      messageId: firstMessageId,
                      postLimit: 0,
                      priorLimit: 10,
                  }
                : undefined;
        },
        initialData: {
            // @ts-expect-error
            pageParams: defaultPageParam,
            pages: [
                [
                    ...[...Array(10).keys()].map(() => undefined),
                    message,
                    ...[...Array(10).keys()].map(() => undefined),
                ],
            ],
        },
    });

    useEffect(() => {
        if (window.innerWidth < 525) {
            setIsMobile(true)
        }else{
            setIsMobile(false)
        }
    }, [window.innerWidth])

    // get Live messages

    const viewLiveMessages = () => {
        initiateSocket()
        if(role === '3NFT'){
            initiateSocket()
            console.log('Connect Socket------')
        }else{
            present({
                message: `You are not able to view live messages because you don't have 3 NFTs`,
                color: 'danger',
                duration: 5000,
                buttons: [{ text: 'X', handler: () => dismiss() }],
            })
        }
    }

    // Socket initial
    const initiateSocket = () => {
        setIsLoading(true)
        socket = io('http://localhost:5027');

        socket.on('connect', () => {
            setIsSocketConnected(true);
        })

        // socket.emit('getData', defaultPageParam);
        socket.emit('getData', {
            "message": {
                "author": "Bentley DeLorenzo",
                "message": "here whoever wants tat tool suite dm this guy, i have no interest or benefits from it do it at your own risk bonimba#5543",
                "objectID": "1337669002",
                "source": "Sierra",
                "time": "2022-01-27 17:11:23",
                "time_stamp": 1643303483,
                "_highlightResult": {
                    "message": {
                        "fullyHighlighted": false,
                        "matchLevel": "full",
                        "matchedWords": ["Sierra"],
                        "value": "here whoever wants tat tool suite dm this guy, i have no interest or benefits from it do it at your own risk bonimba#5543"
                    },
                    "source": {
                        "matchLevel": "none",
                        "matchedWords": [],
                        "value": "Sierra"
                    }
                }
            },
            "postLimit": 100,
            "priorLimit": 5
        });

        socket.on('Data', (data) => {
            setIsLoading(false)
            data.subsequentMsg = data?.subsequentMsg?.map((message: { time: any; updatedAt: any; }) => ({
                ...message,
                time : message.time ? message.time : message.updatedAt
            }))

            setDatapages([data.subsequentMsg])
        })
        setSocketVar(socket)

    }

    // Disconnect socket on close button
    const disconnectSocket = () => {
        socketVar.disconnect();
        setIsSocketConnected(false)
    }

    useEffect(() => {
        setDatapages(data.pages)
    }, [data])

    return (
        <>
            <IonModal isOpen = {isModalOpen} onDidDismiss={onClose as any} >
                <div ref={containerRef} className={`${isMobile ? 'p-2' : 'p-4'} c-res-messages messages h-full w-full mx-auto`} >
                    <div className={`${ dataPages && dataPages[0]?.length > 0 ? 'justify-end ' : 'justify-end'}  ${isMobile ? 'm-3' :'mb-3'} text-red-500 flex cursor-pointer items-center`}>
                        {/* {dataPages && dataPages[0]?.length > 0 ? <IonButton onClick={()=>viewLiveMessages()}>View Live Messages</IonButton> : '' } */}
                        <div onClick={()=>
                             {
                                 if(isSocketConnected){
                                    disconnectSocket()
                                 }
                                 setIsModalOpen(false)}
                            } >
                            <HighlightOffIcon className='text-2xl'/>
                        </div>
                    </div>
                    {isLoading ? <div className='flex justify-center'><Loader/></div> : ''}


                    <div className={`overflow-y-scroll h-full w-full mx-auto ${isMobile ? 'p1' :'p-5'}`}>
                        { dataPages && dataPages?.length > 0 ? dataPages.map((page:any,index:number) =>{
                                return <div key={index}>
                                            {page.map((message:any, i:number) => {
                                                return <div key={i}>
                                                            {message ? (
                                                                <div className="my-1.5" key={i}>
                                                                    <MessageListItem message={message} isFromMsgThread={true} key={message.id} ref={ message.id === id ? mainMessageRef : null } />
                                                                </div>
                                                            ) : (
                                                                <SearchSkeleton key={i}/>
                                                            )}
                                                        </div>
                                                })
                                            }
                                        </div>
                                })
                            .flat(1)
                        :
                        <div className='flex justify-center text-xl opacity-60'>No data available</div>
                        }
                    </div>
                </div>
                <ReactTooltip />
            </IonModal>
        </>
    );
};

export default MessageThread;
