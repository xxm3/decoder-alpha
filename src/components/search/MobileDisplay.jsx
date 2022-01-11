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

interface DisplayProps {
    chartData: any;
    height: number;
    doughnutData:any;
    position: string;
    totalCountHeight: number;
    showPie: boolean;
}

defaults.color = '#FFFFFF';
const MobileDisplay = ({chartData, height, doughnutData, position, total, totalCountHeight, showPie}) => {
    const {messages, word} = useContext(MessageContext);

    // console.log({messages});

    // not sure why we have showPie & showDoughnut
    const [doughnutHeight, setDoughnutHeight] = React.useState(0);

    const [showBar, setShowBar] = React.useState(!showPie);
    const [showDoughnut, setShowDoughnut] = React.useState(showPie);

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
            <IonRow>

                {/* bar & line chart */}
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
                        }}/>
                    </div>

                </IonCol>}
            </IonRow>

            {/* pie chart */}
            {showDoughnut &&
                <IonRow>
                    <IonCol size="12">
                        <div className="p-2 h-fit text-white justify-center items-center shadow-lg rounded-l bg-cbg"
                             ref={ref} id="doughnut">
                            <IonRow>
                                <IonCol size="8" offset="2">
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
                                </IonCol>
                            </IonRow>
                        </div>
                    </IonCol>
                </IonRow>
            }

            <IonRow>

                {/* pie chart */}
                {showPie && <IonCol size="12">
                    <div className="flex items-center justify-center w-full pt-3">

                        <label htmlFor="toggleB" className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input type="checkbox" id="toggleB" className="sr-only" onClick={(e) => {
                                    setShowBar(!showBar);
                                    setShowDoughnut(!showDoughnut);
                                }}/>
                                <div className="block bg-cp w-14 h-8 rounded-full"></div>
                                <div className="dot absolute left-1 top-1 bg-black w-6 h-6 rounded-full transition"></div>
                            </div>
                            <div className="ml-3 text-white font-medium">
                                Toggle to <b className="text-cb">{showBar ? 'Doughnut' : 'Bar'}</b>
                            </div>
                        </label>

                    </div>
                </IonCol>}

                {/* list of messages */}
                <IonCol>
                    <div
                        className="overflow-y-scroll shadow-lg  bg-cbg rounded-l flex flex-col divide-y divide-gray-400"
                        style={{height: `${showPie ? doughnutHeight > 380 ? String(Number(doughnutHeight) - 100) : doughnutHeight : height}px`}}>
                        <div className="space-y-6 pb-10 p-4">
                            {messages.map((m, idx) => {
                                // console.log(`Passing ${JSON.stringify(m)}`);
                                return (<MessageListItem idx={idx + 1} key={m.id} message={m} word={word}/>)
                            })}
                        </div>
                    </div>
                </IonCol>

            </IonRow>
        </IonGrid>
    );
}
export default MobileDisplay;