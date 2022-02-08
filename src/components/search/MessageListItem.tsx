import React, { useMemo } from 'react';
import { Message } from '../../types/messages';
import moment from 'moment';
import { useParams } from 'react-router';
import './MessageListItem.css';
import ReactTooltip from 'react-tooltip';

type MessageListItemProps =
    | {
          message: Message;
          onClick?: (message: Message) => any;
          index?: never;
      }
    | {
          index: number;
          message?: never;
          onClick?: never;
      };

const getDateAgo = function (time: moment.MomentInput) {
    return moment(time).fromNow();
};

const MessageListItem = React.forwardRef<HTMLDivElement, MessageListItemProps>(
    (
        { onClick, message: { message, time, source, author, id } = {}, index },
        ref
    ) => {
        const { id: word } = useParams<{ id: string }>();

        const msgArr = useMemo(() => {
            if (!message)
                return [
                    'LOADING LOADING LOADING LOADING LOADING LOADING  LOADING LOADING LOADING LOADING LOADING LOADING',
                ];
            const indexesArr = [
                ...message
                    .toLowerCase()
                    .matchAll(new RegExp(word.toLowerCase(), 'gi')),
            ]
                .map((match) => [
                    match.index as number,
                    (match.index as number) + word.length,
                ])
                .flat(1);
            let lastIndex = 0;
            const msg: string[] = [];
            for (let index of indexesArr) {
                msg.push(message.slice(lastIndex, index));
                lastIndex = index;
            }
            msg.push(message.slice(lastIndex));
            return msg;
        }, [message, word]);

        const loading = useMemo(() => !message, [message]);
        return (
            <div
                className={`relative w-full items-start ${
                    loading
                        ? 'messageLoading py-2'
                        : 'text-gray-200 my-2'
                } ${
                    onClick ? 'hover:bg-opacity-100 cursor-pointer' : ''
                } py-1 space-x-4 rounded-xl text-lg flex`}
                onClick={() =>
                    onClick &&
                    onClick({ id, source, author, time, message } as Message)
                }
                ref={ref}
            >
                {loading ? (
                    <div className="image" />
                ) : (
                    <img
                        className="image"
                        alt={source === 'Twitter' ? 'Twitter' : 'Discord'}
                        src={
                            loading
                                ? undefined
                                : source === 'Twitter'
                                ? `https://unavatar.io/twitter/${
                                      (author as string)
                                          .split('(Twitter) ')
                                          .slice(-1)[0]
                                  }`
                                : '/assets/discord.ico'
                        }
                    />
                )}
                <div className="flex-grow">
                    <div
                        className={`flex font-semibold items-center space-x-2 text-base ${
                            loading ? 'mb-5' : 'mb-1'
                        }`}
                    >
                        <p>{loading ? 'LOADING LOADING' : `(${source} ${source !== "Twitter" ? "- Discord" : ""}) ${author}`}</p>
                        {!loading && (
                            <div className="text-xs text-gray-400" data-tip={new Date(time as string).toLocaleString()}>
                                {getDateAgo(time)}
                            </div>
                        )}
                    </div>

                    {/* show the message and highlight matches */}
                    <p className={loading ? 'inline box-decoration-clone' : 'max-w-full word-wrap'}>
                        {msgArr.map((w, i) => {
                            return w.toLowerCase() === word.toLowerCase() ? (
                                <b className="text-cb" key={w+i}>{w}</b>
                            ) : (
                                w
                            );
                        })}
                    </p>
                </div>

                {loading && (
                    <span
                        className="ripple"
                        style={{
                            animationDelay: `${(index || 0) * 100}ms`,
                        }}
                    />
                )}

                <ReactTooltip />
            </div>
        );
    }
);

export default MessageListItem;
