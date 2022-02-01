import { IonCol, IonGrid, IonRow, IonToggle,IonItem } from "@ionic/react";
import { MessageContext } from "../../context/context";
import { useContext, useState } from 'react';
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
} from 'chart.js';

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
const Display = ({ chartDataDailyCount, width, height, total, chartDataPerSource }) => { // , totalCountHeight, width position, showPie // position='bottom' totalCountHeight={18}  width={width}

    /**
     * States & Variables
     */
    const cookies = new Cookies();
    const { messages, word } = useContext(MessageContext);
    const [showChart, setShowChart] = useState(String(cookies.get('showChart')) === 'false' ? false : true);
    // currently hiding the chart if multiple words searched on
    const [completelyHideChart, setCompletelyHideChart] = useState(word.indexOf(" ") !== -1 ? true : false);

    /**
     * Use Effects
     */

    /**
     * Functions
     */
    // show the chart or not
    function handleChartToggleClick(val) {
        if(val === true || val === 'true') {
            cookies.set('showChart', 'true');
            setShowChart(true);
        } else {
            cookies.set('showChart', 'false');
            setShowChart(false);
        }
    }

    function refreshSearch(){
        window.location.reload();
    }

    /**
     * Renders
     */
    return (
        <React.Fragment>

            <IonItem>
                <span className="font-bold">Searched on "{word}" ({total} results last 10 days)</span>
                <span style={{width: "100px"}}> </span>
                <span hidden={completelyHideChart === true}>
                    <span style={{marginBottom: "1px"}} className="">Toggle Chart</span>
                    <IonToggle color="dark" style={{marginTop: "1px"}}
                               checked={showChart}
                               onClick={ () => handleChartToggleClick(!showChart) } />
                </span>
                {/* <span style={{width: "20px"}}> </span> <a click={refreshSearch()} style={{"textDecoration": "underline"}}>Refresh</a>*/}
            </IonItem>
            <IonGrid className="noPaddingLeftRight">

                {/* bar & line chart */}
                {showChart && !completelyHideChart && (
                    <IonRow>
                        <IonCol size={ width < 640 ? "12" : "6" }>

                            <div className=" p-4 h-full text-white shadow-lg rounded-l bg-cbg">
                                <Chart type='bar' data={chartDataDailyCount} height={height} options={{
                                    plugins: {
                                        legend: {
                                            display: false
                                        },
                                        title: { display: true, text: '# of messages per day (from several Discords)'},
                                        scales: {
                                            yAxes: [{
                                                ticks: {
                                                    beginAtZero: true,
                                                    display: false,
                                                    color: 'white'
                                                },
                                            }],
                                            xAxes: [{
                                                ticks: {
                                                    display: false,
                                                    color: 'white'
                                                },
                                            }]
                                        },
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
                                        scales: {
                                            yAxes: [{
                                                ticks: {
                                                    beginAtZero: true,
                                                    display: false,
                                                    color: 'white'
                                                },
                                            }],
                                            xAxes: [{
                                                ticks: {
                                                    display: false,
                                                    color: 'white'
                                                },
                                            }]
                                        },
                                    },
                                    responsive: true,
                                    maintainAspectRatio: true,
                                }} />
                            </div>
                        </IonCol>

                    </IonRow>
                )}

                {/* list of messages */}
                {(<IonRow>
                    <IonCol size="12" className="noPaddingLeftRight">
                        <div className="overflow-y-scroll bg-inherit rounded-l flex flex-col divide-y divide-gray-400">
                            <div className="space-y-2">  {/*  pb-8 p-1 */}
                                {messages.map((m, idx) => {
                                    return (<MessageListItem idx={idx + 1} key={m.id} message={m} word={word} />)
                                })}
                            </div>
                        </div>
                    </IonCol>
                </IonRow>
                )}

            </IonGrid>
        </React.Fragment>
    );
}
export default Display;
