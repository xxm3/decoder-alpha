import {Message} from "../types/messages";

// repeated on constants.js & feMiscFunctions.js
// const numDaysBackGraphs = 10;
export function constants(){
    return {
        numDaysBackGraphs: 5
    }
}

export interface SearchResponse {
    messages: (Message | undefined)[];
    totalCount: number;
    word: string;
    ten_day_count: {
        count: number;
        date: `${number}-${number}-${number}`;
    }[];
    source : [string,number][]
}


// don't care for years
export function removeYrDate(passedDate: Date){
    let d = passedDate.toDateString().split(' ').slice(1).join(' ');
    return d.replace("2022", "");
}

// generates label code for our charts (mostly / only with the months0
export function generateLabelsDailyCount(fetchedData: SearchResponse){
    let date = new Date();

    let dates = [];
    let labels = [];
    labels.push(date.toISOString().split('T')[0]);
    dates.push(date);
    for (let i = 0; i < constants().numDaysBackGraphs - 1; i++) {
        let nextDay: Date = new Date(dates[i]);
        nextDay.setDate(dates[i].getDate() - 1);
        dates.push(nextDay);
        labels.push(nextDay.toISOString().split('T')[0]);
    }

    // at night-time it is the next day in UTC, so all data today shows as 0. This comment repeated in 3 places, where we fix this
    // BAND AID FIX
    // if(fetchedData.ten_day_count.length === 9){
    //     // console.log('minimizing labels');
    //     labels.splice(9, 1);
    // }

    labels = labels.reverse();

    // TODO-aman: temporary fix for graph after 7pm -- removing everything from this day when its after 7pm, as graphs messed up otherwise
    // labels.splice(9, 1);

    return labels;
}
export function dispLabelsDailyCount(fetchedData: SearchResponse){
    let date = new Date();

    let dates = [];
    let labels = [];
    labels.push(removeYrDate(date));
    dates.push(date);
    for (let i = 0; i < constants().numDaysBackGraphs - 1; i++) {
        let nextDay: Date = new Date(dates[i]);
        nextDay.setDate(dates[i].getDate() - 1);
        dates.push(nextDay);
        labels.push(removeYrDate(nextDay));
    }

    // at night-time it is the next day in UTC, so all data today shows as 0. This comment repeated in 3 places, where we fix this
    // BAND AID FIX
    // if(fetchedData.ten_day_count.length === 9){
    //     // console.log('minimizing labels');
    //     labels.splice(9, 1);
    // }

    labels = labels.reverse();
    return labels;
}


// put backend data into JSON for chart
export function getDailyCountData(fetchedData: SearchResponse){

    // daily count of message per day
    let datasetForChartDailyCount = Array.from({ length: constants().numDaysBackGraphs }, () => 0);
    for (let i = 0; i < fetchedData.ten_day_count.length; i++) {
        let labels = [];
        labels = generateLabelsDailyCount(fetchedData);
        let idx = labels.findIndex((val) => val === fetchedData.ten_day_count[i].date);
        datasetForChartDailyCount[idx] = fetchedData.ten_day_count[i].count; // + 1
    }

    // at night-time it is the next day in UTC, so all data today shows as 0. This comment repeated in 3 places, where we fix this
    // BAND AID FIX
    // if(fetchedData.ten_day_count.length === 9) {
    //     // console.log('minimizing data');
    //     datasetForChartDailyCount.splice(9, 1);
    // }

    return datasetForChartDailyCount;
}


