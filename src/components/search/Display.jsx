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

// interface DisplayProps {
//     chartData: any;
//     height: number;
//     doughnutData: any,
//     position: string,
//     total: number;
//     totalCountHeight: number;
//     showPie: boolean;
//     showchart: number;
//     width: number;
// }

defaults.color = '#FFFFFF';

const Display = ({ chartData, height, doughnutData, position, total, totalCountHeight, showPie, width }) => {
    const cookies = new Cookies();
    const { messages, word } = useContext(MessageContext);
    // console.log({messages});
    const [doughnutHeight, setDoughnutHeight] = React.useState(0);
    const [showchart, onChart] = React.useState(true);
    const history = useHistory();
    const ref = useRef();
    const refScrollUp = useRef();
    const [scrollPosition, setSrollPosition] = useState(0);
    const [showButton, setShowButton] = useState(true);
    // TODO: Cookie Fix
    // console.log(cookies.get('showChart'));
    // console.log(String(cookies.get('showChart')));
    // if (String(cookies.get('showChart')) == 'undefined'){
    //     cookies.set('showChart', String(showchart));
    // } else if(String(cookies.get('showChart') == 'true')){
    //     onChart(true);
    // } else if(String(cookies.get('showChart') == 'false')){
    //     onChart(true);
    // }
    useEffect(() => {
        window.addEventListener("scroll", () => {
            console.log(window.pageYOffset)
          if (window.pageYOffset > 700) {
            setShowButton(true);
          } else {
            setShowButton(false);
          }
        });
    }, []);
    useEffect(() => {
        // console.log("Display");
        // console.log(defaults);
        updateSize();
    }, []);

    const scrollToTop = () => {
        window.addEventListener("scroll", () => {
            if (window.pageYOffset > 700) {
              setShowButton(true);
            } else {
              setShowButton(false);
            }
          });
        window.scrollTo({
          top: 0,
          behavior: 'smooth' // for smoothly scrolling
        });
    };
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
    function handleClick() {
        onChart(!showchart);
    }
    return (
        <React.Fragment>
            <div>
                {/* <IonButton onClick={() => redirectClick()}>Home</IonButton> */}
                        {/* <IonLabel>Checked: {JSON.stringify(checked)}</IonLabel> */}
                    <IonItem>
                        <IonToggle color="dark" checked={showchart} onIonChange={() => {
                            handleClick();
                            onChart(!showchart);
                            // TODO: Cookie Fix
                            // if(showchart) {
                            //     console.log(String(showchart));
                            //     cookies.set('showChart', 'true');
                            // } else {
                            //     cookies.set('showChart', 'false');
                            // }
                            }} defaultChecked={true}/>
                    </IonItem>
            </div>
                <IonGrid >
                    {/* bar & line chart */}
                    {showchart && (
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
                                    }} />
                                </div>
                            </IonCol>
                        </IonRow>)}
                    {/* pie chart */}
                    {showPie && (
                        <IonRow>
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
                                    }} />
                                </div>
                            </IonCol>
                            <IonCol size-xl="8" size-lg="7" size-md="6" size-sm="5">
                                <div
                                    className="overflow-y-scroll shadow-lg  bg-cbg rounded-l flex flex-col divide-y divide-gray-400"
                                    style={{ height: `${doughnutHeight}px` }}>
                                    <div className="space-y-6 pb-10 p-4">
                                        {messages.map((m, idx) => {
                                            return (<MessageListItem idx={idx + 1} key={m.id} message={m} word={word} />)
                                        })}
                                    </div>
                                </div>
                            </IonCol>)
                        </IonRow>)}

                    {/* list of messages */}
                    {!showPie && (<IonRow>
                        <IonCol size="12">
                            {/* shadow-lg */}
                            <div className="overflow-y-scroll bg-inherit rounded-l flex flex-col divide-y divide-gray-400">
                                <div className="space-y-3 pb-10 p-2">
                                    {messages.map((m, idx) => {
                                        return (<MessageListItem idx={idx + 1} key={m.id} message={m} word={word} />)
                                    })}
                                </div>
                            </div>
                        </IonCol>
                    </IonRow>)}
                    {/* {showButton && (
                        <IonButton onClick={scrollToTop} className="back-to-top">
                        up
                        </IonButton>
                    )}
                    <button class="bg-blue-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={scrollToTop}>
                        Button
                    </button> */}
                  
                </IonGrid>
        </React.Fragment>
    );
}
export default Display;