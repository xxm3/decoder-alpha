import { IonCheckbox, IonCol, IonGrid, IonRow,IonLabel,IonToggle,IonItem } from "@ionic/react";
import { MessageContext } from "../../context/context";
import { useContext, useState } from 'react';
import MessageListItem from "./MessageListItem";
import React, { useEffect, useRef } from "react";
import { Doughnut, Chart } from 'react-chartjs-2';
import { IonButton } from '@ionic/react';
import { useHistory, useNavigate } from 'react-router-dom';
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

// NOTE: any changes made here must be made in both Display.jsx & MobileDisplay.jsx!

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

const Display = ({ chartData, height, position, total, totalCountHeight, showPie, width }) => {

    const cookies = new Cookies();
    const { messages, word } = useContext(MessageContext);
    const [showChart, setShowChart] = useState(String(cookies.get('showChart')) === 'true' ? true : false);

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

    return (
        <React.Fragment>

            <IonItem>
                Toggle Chart
                <IonToggle color="dark"
                           checked={showChart}
                           onClick={ () => handleChartToggleClick(!showChart) } />
            </IonItem>
            <IonGrid>

                {/* bar & line chart */}
                {showChart && (
                    <IonRow>
                        <IonCol size="12">
                            <div className=" p-4 h-full text-white shadow-lg rounded-l bg-cbg">
                                <Chart type='bar' data={chartData} height={height} options={{
                                    plugins: {
                                        legend: {
                                            labels: { color: 'white', }
                                        },
                                        title: { color: 'red',},
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
                    <IonCol size="12">
                        <div className="overflow-y-scroll bg-inherit rounded-l flex flex-col divide-y divide-gray-400">
                            <div className="space-y-3 pb-10 p-2">
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