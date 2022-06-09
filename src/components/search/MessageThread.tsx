import { IonButton, IonContent, IonModal, useIonToast } from '@ionic/react';
import React, { useEffect, useRef , useState} from 'react';
import { Message } from '../../types/Message';
import MessageListItem from './MessageListItem';
import { QueryFunctionContext, useInfiniteQuery } from 'react-query';
import { instance } from '../../axios';
import { AxiosResponse } from 'axios';
import ReactTooltip from "react-tooltip";
import SearchSkeleton from "./SearchSkeleton"
import { css } from '@emotion/react';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from '@socket.io/component-emitter';


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
    async function fetchContext({ pageParam = defaultPageParam}: QueryFunctionContext<MessageThreadQueryKey, PageParam>) {
        try {
            const { data } = await instance.post<MessageThreadData>('/getPriorAndSubMessages', pageParam );
            // data.priorMsg = data.priorMsg.map(message => ({
            //     ...message,
            //     // @ts-expect-error
            //     time : message.createdAt ? message.createdAt : message.time_stamp
            // }))

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

    const mainMessageRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isModalOpen, setIsModalOpen] = useState(true)
    const [isMobile, setIsMobile] = useState(false);
    const [isFromSocket, setIsFromSocket] = useState<boolean>(false)
    const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false)
    const [present, dismiss] = useIonToast();
    let socket: Socket<DefaultEventsMap, DefaultEventsMap>; 


    const role = localStorage.getItem('role')

    useEffect(() => {
        if (window.innerWidth < 525) {
            setIsMobile(true)
        }else{
            setIsMobile(false)
        }
    }, [window.innerWidth])

    const viewLiveMessages = () => {
        console.log('defaultPageParam----',defaultPageParam)

        if(role === '3NFT'){
            // connectSocket();
            console.log('Connect Socket------')
        }else{
            present({
                message: `You are not able to view live messages because you don't have 3 NFT`,
                color: 'danger',
                duration: 5000,
                buttons: [{ text: 'X', handler: () => dismiss() }],
            })
        }

         

    }

    const initiateSocket = () => {
        console.log('********** initaliaze socket **********');
        socket = io('http://localhost:5027');

        socket.on('connect', () => {
            setIsSocketConnected(true);
            console.log('ID: ', socket.id);
        })

        socket.emit('getData', { defaultPageParam });

        socket.on('Data', (data) => {
            setIsFromSocket(true);
            console.log('Message Data: ',data);
        })
    }
     
     
    const connectSocket = () => {
        console.log("Socket connection-----------");
        initiateSocket();
    }

    const disconnectSocket = () => {
        console.log("Disconnect-----------");
        socket.disconnect();
        setIsSocketConnected(false);
        setIsFromSocket(false);
    }



    return (
        <>
            <IonModal isOpen = {isModalOpen} onDidDismiss={onClose as any}
                // onDidPresent={() => {
                //     if (mainMessageRef.current) {
                //         mainMessageRef.current.scrollIntoView({
                //             block: 'center',
                //             inline: 'center',
                //         });
                //     }
                // }}
            >
                <div ref={containerRef} className={`${isMobile ? 'p-2' : 'p-4'} c-res-messages messages h-full w-full mx-auto`} >
                    <div className={`${data.pages[0].length > 0 ? 'justify-between' : 'justify-end'} ${isMobile ? 'm-3' :'mb-3'} text-red-500 flex cursor-pointer items-center`}>
                        {data.pages[0].length > 0 ? <IonButton onClick={()=>viewLiveMessages()}>View Live Messages</IonButton> : '' }
                        <div onClick={()=> {setIsModalOpen(false); {isSocketConnected ? disconnectSocket() :'' } }}>
                            <HighlightOffIcon className='text-2xl'/>
                        </div>
                    </div>
                    
                    <div className={`overflow-y-scroll h-full w-full mx-auto ${isMobile ? 'p1' :'p-5'}`}>
                        { data.pages[0].length > 0 ? data.pages.map((page,index) =>{
                                return <div key={index}>
                                    {page.map((message, i) => {
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
