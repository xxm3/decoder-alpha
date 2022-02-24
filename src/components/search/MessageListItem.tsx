import React, { useMemo } from 'react';
import { Message } from '../../types/Message';
import moment from 'moment';
import { useParams } from 'react-router';
import './MessageListItem.css';
import ReactTooltip from 'react-tooltip';
import { getUrlExtension, mediaTypes, urlRegExp } from '../../util/getURLs';
import ReactMarkdown from "react-markdown";

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

        const { formattedMessage, mediaUrls } = useMemo(() => {
            if (!message) return { formattedMessage : "", mediaUrls: [] };
            const mediaUrls: string[] = [];

            let formattedMessage = message.replaceAll(
                urlRegExp,
                (url) => {
                    if (mediaTypes.has(getUrlExtension(url)) && !mediaUrls.includes(url)) {
						mediaUrls.push(url);
						return '';
                    } else return ` <${url.trim()}>`;
                }
            ).replaceAll(new RegExp(word, 'gi'), `**${word}**`);

           
            return {
                formattedMessage,
                mediaUrls: mediaUrls,
            };
        }, [message, word]);

        const loading = useMemo(() => !message, [message]);

        return (
            <div
                className={`relative w-full items-start ${
                    loading ? 'messageLoading py-2' : 'text-gray-200 my-2'
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
                        <p>
                            {loading
                                ? 'LOADING'
                                : `(${source} ${
                                      source !== 'Twitter' ? '- Discord' : ''
                                  }) ${author}`}
                        </p>
                        {!loading && (
                            <div
                                className="text-xs text-gray-400"
                                data-tip={new Date(
                                    time as string
                                ).toLocaleString()}
                            >
                                {getDateAgo(time)}
                            </div>
                        )}
                    </div>

                    {/* show the message and highlight matches */}
                    <p
                        className={
                            loading
                                ? 'inline box-decoration-clone'
                                : 'max-w-full word-wrap'
                        }
                    >
                        {!loading
                            ? <ReactMarkdown components={{
								strong({ children, ...props  }){
									const strongWord = children[0]?.toString()
									return <b {...props} className={strongWord?.toString().toLowerCase() === word.toLowerCase() ? "text-cb" : ""}>{children}</b>
								},
								a({ href, ...props }){
									return <a href={href} onClick={e => e.stopPropagation()} {...props} className="text-blue-300" target="_blank" />
								}
							}}>
								{formattedMessage}
							</ReactMarkdown>
                            : 'LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING'}
                    </p>
                    <div className="media">
                        {mediaUrls.map((url) => {
                            switch (mediaTypes.get(getUrlExtension(url))) {
                                case 'img':
                                    return <img src={url} />;
                                case 'video':
                                    return <video src={url} />;
                            }
                        })}
                    </div>
                </div>

                {loading && (
                    <span
                        className="ripple"
                        style={{
                            animationDelay: `${(index || 0) * 100}ms`,
                        }}
                    />
                )}

                {/*tooltip hovering over date*/}
                <ReactTooltip />
            </div>
        );
    }
);

export default MessageListItem;
