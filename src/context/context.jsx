import React, {createContext} from 'react';

const intialState = [
    {
        message: 'new try',
        id: 0,
        time: new Date(),
    },
    {
        message: 'new test',
        id: 1,
        time: new Date(),
    },
];


export const MessageContext = createContext(intialState);

export const Provider = ({children}) => {
    const [messages, setMessages] = React.useState(intialState);
    const [word, setWord] = React.useState('');
    return (
        <MessageContext.Provider value={{
            word,
            setWord,
            messages,
            setMessages
        }}
        >
            {children}
        </MessageContext.Provider>
    );
};