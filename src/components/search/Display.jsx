import {IonCol, IonGrid, IonRow} from "@ionic/react";
import {MessageContext} from "../../context/context";
import {useContext} from 'react';
import MessageListItem from "./MessageListItem";
import React, {useEffect, useRef} from "react";
import {Doughnut, Chart} from 'react-chartjs-2';
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

interface DisplayProps {
    chartData: any;
    height: number;
    doughnutData:any,
    position: string,
    total: number;
    totalCountHeight: number;
    showPie: boolean;
    width: number;
}

defaults.color = '#FFFFFF';
const Display = ({chartData, height, doughnutData, position, total, totalCountHeight, showPie, width}) => {

    // console.log(height);

    const {messages, word} = useContext(MessageContext);
    // console.log({messages});

    const [doughnutHeight, setDoughnutHeight] = React.useState(0);

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

    // get the height of the message list
    function getMessageListHeight() {
        return 620;
        // return height * 4;
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
                <IonCol size="12">
                    <div className=" p-4 h-full text-white shadow-lg rounded-l bg-cbg">
                        <Chart type='bar' data={chartData} height={height} options={{
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
                        }}/>
                    </div>
                </IonCol>
            </IonRow>

            {/* pie chart */}
            {showPie && (<IonRow>
                    <IonCol size-xl="4" size-lg="5" size-md="6" size-sm="7">
                        <div className="p-4 h-full shadow-lg rounded-l bg-cbg" ref={ref} id="doughnut">
                            <Doughnut data={doughnutData} options={{
                                plugins: {
                                    legend: {
                                        labels: {
                                            color: 'white',
                                        },
                                        position: `${position}`,
                                    },
                                    title: {
                                        color: 'red',
                                    },
                                    scales: {
                                        yAxes: [{
                                            ticks: {
                                                beginAtZero: true,
                                                color: 'white'
                                            },
                                        }],
                                        xAxes: [{
                                            ticks: {
                                                color: 'white'
                                            },
                                        }]
                                    },
                                },
                                responsive: true,
                                maintainAspectRatio: true,
                            }}/>
                        </div>
                    </IonCol>
                    <IonCol size-xl="8" size-lg="7" size-md="6" size-sm="5">
                        <div
                            className="overflow-y-scroll shadow-lg  bg-cbg rounded-l flex flex-col divide-y divide-gray-400"
                            style={{height: `${doughnutHeight}px`}}>
                            <div className="space-y-6 pb-10 p-4">
                                {messages.map((m, idx) => {
                                    return (<MessageListItem idx={idx + 1} key={m.id} message={m} word={word}/>)
                                })}
                            </div>
                        </div>
                    </IonCol>
                </IonRow>
            )}

            {/* list of messages */}
            {!showPie && (<IonRow>
                <IonCol size="12">
                    {/* shadow-lg */}
                    <div className="overflow-y-scroll bg-inherit rounded-l flex flex-col divide-y divide-gray-400"
                        style={{height: `${getMessageListHeight()}px`}}>
                        <div className="space-y-3 pb-10 p-2">
                            {messages.map((m, idx) => {
                                return (<MessageListItem idx={idx + 1} key={m.id} message={m} word={word}/>)
                            })}
                        </div>
                    </div>
                </IonCol>
            </IonRow>)}
        </IonGrid>
    );
}
export default Display;