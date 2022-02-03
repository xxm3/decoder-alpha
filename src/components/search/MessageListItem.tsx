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

        const imageClassName =
            'rounded-full h-12 w-12 flex-shrink-0 bg-bg-primary';
        const loading = useMemo(() => !message, [message]);
        return (
            <div
                className={`relative max-w-2xl items-start ${
                    loading
                        ? 'bg-inherit text-bg-primary messageLoading'
                        : 'bg-bg-primary text-white my-4'
                } ${
                    onClick ? 'hover:bg-opacity-60 cursor-pointer' : ''
                } p-5 space-x-4 rounded-xl text-lg flex`}
                onClick={() =>
                    onClick &&
                    onClick({ id, source, author, time, message } as Message)
                }
                ref={ref}
            >
                {loading ? (
                    <div className={imageClassName} />
                ) : (
                    <img
                        className={imageClassName}
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
                <div>
                    <div
                        className={`flex font-semibold items-center space-x-2 text-base ${
                            loading ? 'mb-5' : 'mb-1'
                        }`}
                    >
                        <p>{loading ? 'LOADING LOADING' : `(${source} ${source !== "Twitter" ? "- Discord" : ""}) ${author}`}</p>
                        {!loading && (
                            <div className="text-xs text-gray-400" data-tip={time}>
                                {getDateAgo(time)}
                            </div>
                        )}
                    </div>

                    {/* show the message and highlight matches */}
                    <p className={loading ? 'inline box-decoration-clone' : ''}>
                        {msgArr.map((w, i) => {
                            return (
                                <span key={w + i}>
                                    {/* {w}{i < msgArr.length - 1 ? <b className="text-cb">{word}</b> : null} */}
                                    {w.toLowerCase() === word.toLowerCase() ? (
                                        <b className="text-cb">{w}</b>
                                    ) : (
                                        w
                                    )}
                                </span>
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
