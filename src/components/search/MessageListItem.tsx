import React, { useMemo } from 'react';
import { Message } from '../../types/Message';
import moment from 'moment';
import { useParams } from 'react-router';
import './MessageListItem.css';
import ReactTooltip from 'react-tooltip';
import { getUrlExtension, mediaTypes, urlRegExp } from '../../util/getURLs';
import ReactMarkdown from "react-markdown";
import VisibilityIcon from '@material-ui/icons/Visibility';
import { css } from '@emotion/react';

type MessageListItemProps =
    | {
          message: Message;
          isFromMsgThread?:boolean;
          onClick?: (message: Message) => any;
      }


const getDateAgo = function (time: moment.MomentInput) {
    return moment(time).fromNow();
};

const MessageListItem = React.forwardRef<HTMLDivElement, MessageListItemProps>(
    (
        { onClick, isFromMsgThread,message: { message, time, source, author, id } = {} },
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
                },
            ).replaceAll(new RegExp(word, 'gi'), `**${word}**`)

           if (source !== 'Twitter') {
               formattedMessage = formattedMessage
                   .replaceAll(/<(@|!|@!)(\d{18})>/g, '`@User`')
                   .replaceAll(/<#(\d{18})>/g, '`#channel`')
                   .replaceAll(/<@&(\d{18})>/g, '`@Role`')
				   .replaceAll(/@(here|everyone)/g, str => `\`${str}\``)
           } else {
			   formattedMessage = formattedMessage
				   .replaceAll(/@([a-zA-Z0-9]*)/g, str => `\`${str}\``)
           }
            return {
                formattedMessage,
                mediaUrls: mediaUrls,
            };
        }, [message, word]);

        return (
            <div
                className={`relative w-full items-start  my-2 ${
                    onClick ? 'hover:bg-opacity-100 cursor-pointer' : ''
                } py-1 space-x-4 rounded-xl text-lg flex`}
                onClick={() =>
                    onClick &&
                    onClick({ id, source, author, time, message } as Message)
                }
                ref={ref}
            >

                {/*hide this on mobile*/}
                <img
                    className="image hidden sm:block"
                    alt={source === 'Twitter' ? 'Twitter' : 'Discord'}
                    src={
                        source === 'Twitter'
                            ? `https://unavatar.io/twitter/${
                                  (author as string)
                                      .split('(Twitter) ')
                                      .slice(-1)[0]
                              }`
                            : '/assets/discord.ico'
                    }
                />
                <div className="flex-grow">
                    <div
                        className={`flex font-semibold items-center space-x-2 text-base mb-1  justify-between`}
                    >
                        {/*source & author*/}
                        <p className='c-res-title-text'>
                            ({source} {
                                      source !== 'Twitter' ? '- Discord' : ''
                                  }) {author}
                        </p>
                        {/*time*/}
                        {(

                            <div
                                className="text-xs text-gray-400 c-res-time-text flex justify-between items-center" // underline cursor-pointer
                                data-tip={new Date(
                                    time as string
                                ).toLocaleString()}
                            >
                                <div className='whitespace-nowrap'>
                                    {getDateAgo(time)}
                                </div>
                                <div>
                                    {isFromMsgThread? <></> :
                                    <VisibilityIcon className='ml-2 text-blue-500' data-tip='Click to see chat history after this message' />}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* show the message and highlight matches */}
                    <div
                        className={'max-w-full word-wrap c-res-list-wrapper'}
                    >
                        {<ReactMarkdown
								components={{
									strong({ children, ...props  }){
										const strongWord = children[0]?.toString()
										return <b {...props} className={strongWord?.toString().toLowerCase() === word.toLowerCase() ? "searched_word" : ""}>{children}</b>
									},
									a({ href, ...props }){
										return <a href={href} onClick={e => e.stopPropagation()} {...props} className="text-blue-300 dark:text-blue-600" target="_blank" />
									},
									code({node, inline, className, children, ...props}) {
										const codeWord = children[0]?.toString()
										let isMention = false;
										if(codeWord?.startsWith("@") || codeWord?.startsWith("#")){
											isMention = true
										}
										return isMention && inline ? (
                                            <span
                                                {...props}
                                                className="text-white bg-[#5865f2] px-1"
                                            >
                                                {children}
                                            </span>
                                        ) : source !== 'Twitter' ? (
                                            <code
                                                className={className}
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        ) : (
                                            <span {...props} />
                                        );
									}
								}}

							>
								{formattedMessage}
							</ReactMarkdown>
                            }
                    </div>
                    <div className="media">
                        {mediaUrls.map((url) => {
                            switch (mediaTypes.get(getUrlExtension(url))) {
                                case 'img':
                                    return <img key={url} src={url} />;
                                case 'video':
                                    return <video key={url} src={url} />;
                            }
                        })}
                    </div>
                </div>

                {/*tooltip hovering over date*/}
                <ReactTooltip />
            </div>
        );
    }
);

export default MessageListItem;
