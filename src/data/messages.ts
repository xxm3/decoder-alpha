export interface Message {
    message: string,
    id: number,
    time: string,
}

const messages: Message[] = [
    {
        message: 'try',
        id: 0,
        time: "2022-01-09T17:04:26.000Z",
    },
    {
        message: 'test',
        id: 1,
        time: "2022-01-09T17:04:26.000Z",
    },
    {
        message: "testing",
        id: 2,
        time: "2022-01-09T17:04:26.000Z",

    },
    {
        message: "trail",
        id: 3,
        time: "2022-01-09T17:04:26.000Z",
    }
];

export const getMessages = () => messages;

export const getMessage = (id: number) => messages.find(m => m.id === id);
  