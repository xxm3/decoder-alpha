import {Message} from "../types/messages";
import moment from "moment";

export function constants(){
    return {
        // repeated on constants.js & feMiscFunctions.js
        numDaysBackGraphs: 5
    }
}

export interface SearchResponse {
    messages: (Message | undefined)[];
    totalCount: number;
    word: string;
    ten_day_count: {
        count: number;
        date: string;
    }[];
    source : [string,number][]
}

// pass in data from backend (which is properly formatted), and return back labels for the charts
export function dispLabelsDailyCount(indivRawFetchedData: any, convertMmmDd: boolean){
    let labels: any = [];

    for(let obj in indivRawFetchedData){
        let date = indivRawFetchedData[obj].date;

        // only certain functions that call this, need it in this format
        if(convertMmmDd){
            date = moment(date).format("MMM D");
        }

        labels.push(date);
    }

    return labels.reverse();
}

// put backend data into JSON for chart
export function getDailyCountData(fetchedData: Pick<SearchResponse, "ten_day_count"> & { [key: string] : any}){
    // daily count of message per day
    let datasetForChartDailyCount = Array.from({ length: constants().numDaysBackGraphs }, () => 0);
    for (let i = 0; i < fetchedData.ten_day_count.length; i++) {

        // rawFetchedData.ten_day_count -> [{count: 5, date: '2022-xx-xx'}, {}
        let labels = dispLabelsDailyCount(fetchedData.ten_day_count, false);

        let idx = labels.findIndex((val: any) => val === fetchedData.ten_day_count[i].date);
        datasetForChartDailyCount[idx] = fetchedData.ten_day_count[i].count; // + 1
    }

    return datasetForChartDailyCount;
}


