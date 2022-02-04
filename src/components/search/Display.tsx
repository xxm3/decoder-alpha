import {IonCol, IonGrid, IonRow, IonToggle, IonItem} from "@ionic/react";
import {useEffect, useMemo, useState} from 'react';
import MessageListItem from "./MessageListItem";
import React from "react";
import {Chart} from 'react-chartjs-2';
import Cookies from 'universal-cookie';
import {constants} from "../feMiscFunctions";
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
import {Message} from "../../types/messages";
import MessageThread from "./MessageThread";
import {useParams} from "react-router";
import ReactTooltip from "react-tooltip";

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
const Display: React.FC<{
    chartDataDailyCount?: ChartData<"bar" | "line", number[]>;
    chartDataPerSource?: ChartData<"bar", number[]>;
    chartHeight: number;
    width: number;
    messages: (Message | undefined)[];
    totalCount: (number | undefined);
}> = ({
          chartDataDailyCount,
          chartDataPerSource,
          chartHeight,
          width,
          messages,
          totalCount
      }) => {

    /**
     * States & Variables
     */
    const cookies = useMemo(() => new Cookies(), [])
    const [showChart, setShowChart] = useState(String(cookies.get('showChart')) === 'false' ? false : true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
    const {id: word} = useParams<{ id: string; }>()

    const definedMessages = messages.filter(Boolean)

    /**
     * Use Effects
     */
    useEffect(() => {
        cookies.set("showChart", String(showChart));
    }, [showChart, cookies])

    /**
     * Functions
     */

    /**
     * Renders
     */
    return (
        <>
            {definedMessages.length > 0 &&
            <IonItem>
                <span className="font-bold">Searched on "{word}" ({totalCount} results last {constants().numDaysBackGraphs} days)</span>
                <span style={{width: "100px"}}> </span>
                <span>
                    <span style={{marginBottom: "10px"}}>Toggle Chart</span>
                    <IonToggle color="dark"
                               checked={showChart}
                               onClick={() => setShowChart(!showChart)}/>
                </span>
            </IonItem>}

            <IonGrid className="noPaddingLeftRight">

                {/*--{width}--{chartHeight}--*/}

                {/* bar & line chart */}
                {showChart && chartDataDailyCount && chartDataPerSource && definedMessages.length > 0 && (
                    <IonRow>
                        <IonCol size={width < 640 ? "12" : "6"}>

                            <div className=" p-4 h-full text-white shadow-lg rounded-l bg-cbg">
                                <Chart type='bar' data={chartDataDailyCount} height={chartHeight} options={{
                                    plugins: {
                                        legend: {
                                            display: false
                                        },
                                        title: {display: true, text: '# of messages per day (from several Discords)'},
                                    },
                                    responsive: true,
                                    maintainAspectRatio: true,
                                }}/>
                            </div>
                        </IonCol>

                        <IonCol size={width < 640 ? "12" : "6"}>

                            <div className=" p-4 h-full text-white shadow-lg rounded-l bg-cbg">
                                <Chart type='bar' data={chartDataPerSource} height={chartHeight} options={{
                                    plugins: {
                                        legend: {
                                            display: false
                                        },
                                        title: {display: true, text: '# of messages per Discord (last 100 messages)'},
                                    },
                                    responsive: true,
                                    maintainAspectRatio: true,
                                }}/>
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
                                        if (m.source === "Twitter") {
                                            const url = `https://twitter.com/${m.author}`;
                                            window.open(
                                                url, "_blank");
                                        } else setSelectedMessage(m)
                                    }} message={m}/> : <MessageListItem index={i} key={i}/>
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
