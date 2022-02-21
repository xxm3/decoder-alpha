import { Message } from "./Message";

export interface SearchResponse {
    error?: any;
    body?: any;
    messages: (Message | undefined)[];
    totalCount: number;
    word: string;
    ten_day_count: {
        count: number;
        date: string;
    }[];
    source : [string,number][]
}