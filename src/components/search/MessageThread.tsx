import { IonContent, IonModal } from '@ionic/react';
import React, { useRef , useState} from 'react';
import { Message } from '../../types/Message';
import MessageListItem from './MessageListItem';
import { QueryFunctionContext, useInfiniteQuery } from 'react-query';
import { instance } from '../../axios';
import { AxiosResponse } from 'axios';
import ReactTooltip from "react-tooltip";
import SearchSkeleton from "./SearchSkeleton"
import { css } from '@emotion/react';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

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
    // TODO? bugged demo...
    const defaultPageParam: PageParam = {
        messageId: message.id,
        message: message,
        priorLimit: 5,
        postLimit: 100,
        // #s REPEATED on MessageThread.tsx & priorAndSubsequent.js
    };

    async function fetchContext({
        pageParam = defaultPageParam,
    }: QueryFunctionContext<MessageThreadQueryKey, PageParam>) {
        try {
            const { data } = await instance.post<MessageThreadData>(
                '/getPriorAndSubMessages',
                pageParam
            );
            // data.priorMsg = data.priorMsg.map(message => ({
            //     ...message,
            //     // @ts-expect-error
            //     time : message.createdAt ? message.createdAt : message.time_stamp
            // }))
            
                data.subsequentMsg = data?.subsequentMsg?.map(message => ({
                    ...message,
                    // @ts-expect-error
                    time : message ? message.createdAt : message.time_stamp
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
                      message: null, // TODO...
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
    return (
        <>
            <IonModal
                isOpen = {isModalOpen}
                onDidDismiss={onClose as any}
                // onDidPresent={() => {
                //     if (mainMessageRef.current) {
                //         mainMessageRef.current.scrollIntoView({
                //             block: 'center',
                //             inline: 'center',
                //         });
                //     }
                // }}
            >
                <div
                    ref={containerRef}
                    className="p-5 c-res-messages messages h-full w-full mx-auto"
                >
                    <div onClick={()=> setIsModalOpen(false)}  className=' justify-end text-red-500  flex m-3'  >
                        <HighlightOffIcon className='text-2xl'/>
                    </div>
                    <div className='overflow-y-scroll h-full w-full mx-auto p-5'>

                        {/*<div hidden={data}>*/}
                        {/*    Down!*/}
                        {/*</div>*/}

                        {data.pages
                            .map((page) =>
                                page.map((message, i) =>
                                    message ? (
                                        <div className="my-1.5" key={i}>
                                            <MessageListItem
                                                message={message}
                                                isFromMsgThread={true}
                                                key={message.id}
                                                ref={
                                                    message.id === id
                                                        ? mainMessageRef
                                                        : null
                                                }
                                            />
                                        </div>
                                    ) : (
                                        <SearchSkeleton key={i}/>
                                    )
                                )
                            )
                            .flat(1)
                        }
                    </div>
                </div>

                <ReactTooltip />
            </IonModal>
        </>
    );
};

export default MessageThread;
