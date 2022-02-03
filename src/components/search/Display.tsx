import { IonCol, IonGrid, IonRow, IonToggle,IonItem } from "@ionic/react";
import { useEffect, useMemo, useState } from 'react';
import MessageListItem from "./MessageListItem";
import React from "react";
import { Chart } from 'react-chartjs-2';
import Cookies from 'universal-cookie';
import './Display.css';
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    ArcElement,
    registerables,
    defaults,
    ChartData,
} from 'chart.js';
import { Message } from "../../types/messages";
import MessageThread from "./MessageThread";
import { useParams } from "react-router";

// NOTE: any changes made here must be made in both Chart.jsx & MobileChart.jsx!

ChartJS.register(...registerables);
ChartJS.register(
    ArcElement,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip
);

defaults.color = '#FFFFFF';
const Display : React.FC<{
    chartDataDailyCount ?: ChartData<"bar" | "line", number[]>;
    chartDataPerSource ?: ChartData<"bar", number[]>;
    chartHeight : number;
    messages : (Message | undefined)[];
    width : number;

}> = ({ chartDataDailyCount, chartHeight : height, messages,chartDataPerSource, width  }) => {

    const cookies = useMemo(() => new Cookies(), [])
    const [showChart, setShowChart] = useState(String(cookies.get('showChart')) === 'true' ? true : false);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
    // show the chart or not
    const { id : word} = useParams<{ id : string;}>()

    useEffect(() => {
        cookies.set("showChart", String(showChart));
    }, [showChart, cookies])

    const definedMessages = messages.filter(Boolean)
    return (
        <>

           {definedMessages.length > 0 && <IonItem>

                <span>Searched on "{word}" ({messages.length} results last 10 days)</span>
                <span style={{width: "100px"}}> </span>
                <span>
                    <span style={{marginBottom: "10px"}}>Toggle Chart</span>
                    <IonToggle color="dark"
                               checked={showChart}
                               onClick={ () => setShowChart(!showChart) } />
                </span>
            </IonItem>}
            <IonGrid className="noPaddingLeftRight">

                {/* bar & line chart */}
                {showChart && chartDataDailyCount && chartDataPerSource && definedMessages.length > 0 &&(
                    <IonRow>
                    <IonCol size={ width < 640 ? "12" : "6" }>

                        <div className=" p-4 h-full text-white shadow-lg rounded-l bg-cbg">
                            <Chart type='bar' data={chartDataDailyCount} height={height} options={{
                                plugins: {
                                    legend: {
                                        display: false
                                    },
                                    title: { display: true, text: '# of messages per day (from several Discords)'},
                                    // @ ts-expect-error
                                    // scales: {
                                    //     yAxes: [{
                                    //         ticks: {
                                    //             beginAtZero: true,
                                    //             display: false,
                                    //             color: 'white'
                                    //         },
                                    //     }],
                                    //     xAxes: [{
                                    //         ticks: {
                                    //             display: false,
                                    //             color: 'white'
                                    //         },
                                    //     }]
                                    // },
                                },
                                responsive: true,
                                maintainAspectRatio: true,
                            }} />
                        </div>
                    </IonCol>

                    <IonCol size={ width < 640 ? "12" : "6" }>

                        <div className=" p-4 h-full text-white shadow-lg rounded-l bg-cbg">
                            <Chart type='bar' data={chartDataPerSource} height={height} options={{
                                plugins: {
                                    legend: {
                                        display: false
                                    },
                                    title: { display: true, text: '# of messages per Discord (last 100 messages)'},
                                    // @ ts-expect-error
                                    // scales: {
                                    //     yAxes: [{
                                    //         ticks: {
                                    //             beginAtZero: true,
                                    //             display: false,
                                    //             color: 'white'
                                    //         },
                                    //     }],
                                    //     xAxes: [{
                                    //         ticks: {
                                    //             display: false,
                                    //             color: 'white'
                                    //         },
                                    //     }]
                                    // },
                                },
                                responsive: true,
                                maintainAspectRatio: true,
                            }} />
                        </div>
                    </IonCol>

                </IonRow>
                )}

                {/* list of messages */}
                <IonRow>
                    <IonCol size="12">
                        <div className="overflow-y-scroll bg-inherit rounded-l flex flex-col divide-y divide-gray-400">
                            <div className="pb-10 p-2">
                                {messages.map((m, i) => {
                                    return m ? <MessageListItem key={m.id} onClick={() => {
                                        if(m.source === "Twitter"){
                                            const url = `https://twitter.com/${m.author}`;
                                            window.open(
                                                url, "_blank");
                                        }
                                        else setSelectedMessage(m)
                                    }} message={m} /> : <MessageListItem index={i} key={i} />
                                })}
                            </div>
                        </div>
                    </IonCol>
                </IonRow>
               {selectedMessage && <MessageThread onClose={() => setSelectedMessage(null)} message={selectedMessage}/>}

            </IonGrid>

        </>
    );
}
export default Display;
