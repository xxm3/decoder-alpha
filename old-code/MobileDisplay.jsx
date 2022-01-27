import { IonCol, IonGrid, IonRow } from "@ionic/react";
import { MessageContext } from "../../context/context";
import { useContext } from 'react';
import MessageListItem from "./MessageListItem";
import React, { useEffect, useRef } from "react";
import { Chart } from 'react-chartjs-2';
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
import './MobileDisplay.css';

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

// interface DisplayProps {
//     chartData: any;
//     height: number;
//     doughnutData: any;
//     position: string;
//     totalCountHeight: number;
//     showPie: boolean;
// }

defaults.color = '#FFFFFF';
const MobileDisplay = ({ chartData, height, position, total, totalCountHeight, showPie }) => {
    const { messages, word } = useContext(MessageContext);

    const [doughnutHeight, setDoughnutHeight] = React.useState(0);

    const [showBar, setShowBar] = React.useState(!showPie);

    const ref = useRef();
    window.onresize = () => {
        updateSize();
    };

    function updateSize() {
        const stop = setTimeout(() => {
            if (ref.current) {
                setDoughnutHeight(ref?.current.offsetHeight);
                window.clearInterval(stop);
            }
        }, 100);
    }

    useEffect(() => {
        // console.log("Display");
        // console.log(defaults);

        updateSize();

    }, []);
    return (
        <IonGrid>

            {/* bar & line chart */}
            <IonRow>
                {showBar && <IonCol size="12">
                    <div className=" p-4 h-full text-white shadow-lg rounded-l bg-cbg">
                        <Chart type='bar' data={chartData} height={Number(height - totalCountHeight)} options={{
                            plugins: {
                                legend: {
                                    labels: {
                                        color: 'white',
                                    }
                                },
                                title: {
                                    color: 'red',
                                },
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

                </IonCol>}
            </IonRow>

            {/* list of messages */}
            <IonRow>
                <IonCol>
                    <div
                        className="overflow-y-scroll shadow-lg  bg-cbg rounded-l flex flex-col divide-y divide-gray-400"
                        style={{ height: `${showPie ? doughnutHeight > 380 ? String(Number(doughnutHeight) - 100) : doughnutHeight : height}px` }}>
                        <div className="space-y-6 pb-10 p-4">
                            {messages.map((m, idx) => {
                                return (<MessageListItem idx={idx + 1} key={m.id} message={m} word={word} />)
                            })}
                        </div>
                    </div>
                </IonCol>
            </IonRow>

        </IonGrid>
    );
}
export default MobileDisplay;