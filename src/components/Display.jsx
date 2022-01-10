import { IonCol, IonGrid, IonRow } from "@ionic/react";
import { MessageContext } from "../context/context";
import {useContext} from 'react';
import MessageListItem from "./MessageListItem";
import React, { useEffect, useRef } from "react";
import { Doughnut , Chart} from 'react-chartjs-2';
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

// @ts-ignore
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

defaults.color='#FFFFFF';
const Display = ({chartData, height,doughnutData,position, total, totalCountHeight, showPie, width}) =>{
    const {messages, word} = useContext(MessageContext);
    console.log({messages});
    const [doughnutHeight, setDoughnutHeight] = React.useState(0);
    const ref = useRef();
    window.onresize = () => {
        updateSize();
    };
    function updateSize(){
        const stop= setTimeout(() =>{
            if(ref.current){
                setDoughnutHeight(ref?.current.offsetHeight);
                window.clearInterval(stop);
            }
        },100);
    }
    useEffect(() => {
        console.log("Display");
        console.log(defaults);


        updateSize();

    }, []);
    return (
        <IonGrid >
            <IonRow>
                <IonCol size="12">
                {/* <div className="relative bg-cbg p-6 rounded-xl">
                    <p className="text-lg text-white">Total count of <b className="text-cb">{word}</b> is <b className="text-cb">{total}</b> </p>
                    <span className="absolute bg-green-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">{total}</span>
                    <div className="absolute top-0 right-0 flex space-x-2 p-4">
                    </div>
                </div> */}
                </IonCol>
            
            <IonCol size="12" >
                <div className=" p-4 h-full text-white shadow-lg rounded-l bg-cbg">
                    <Chart type='bar' data={chartData} height={height} options={{
                        plugins: {
                            legend:{
                                labels: {
                                    color: 'white',
                                }
                            },
                            title: {
                              color:'red',
                            },
                            scales: {
                                yAxes: [{
                                   ticks: {
                                      beginAtZero: true,
                                      display:false,
                                      color: 'white'
                                   },
                                }],
                                xAxes: [{
                                   ticks: {
                                    display:false,
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
            
                {showPie && (<IonRow>
                    <IonCol size-xl="4" size-lg="5" size-md="6" size-sm="7" >
                <div className="p-4 h-full shadow-lg rounded-l bg-cbg" ref = {ref} id="doughnut">
                        <Doughnut data={doughnutData} options={{
                        plugins: {
                            legend:{
                                labels: {
                                    color: 'white',
                                },
                                position: `${position}`,
                            },
                            title: {
                              color:'red',
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
                <IonCol size-xl="8" size-lg="7" size-md="6" size-sm="5" >
                    <div className="overflow-y-scroll shadow-lg  bg-cbg rounded-l flex flex-col divide-y divide-gray-400"  style ={{height:`${doughnutHeight}px`}}>
                    <div className="space-y-6 pb-10 p-4">
                        {messages.map((m,idx) => { return (<MessageListItem idx={idx+1} key={m.id} message={m} word={word}/>)})}
                    </div>
                    </div>
              </IonCol>
            </IonRow>
              )}
              {!showPie && (<IonRow>
                <IonCol size="12" >
                    <div className="overflow-y-scroll shadow-lg  bg-cbg rounded-l flex flex-col divide-y divide-gray-400"  style ={{height:`${height*4}px`}}>
                    <div className="space-y-6 pb-10 p-4">
                        {messages.map((m,idx) => {return (<MessageListItem idx={idx+1} key={m.id} message={m} word={word}/>)})}
                    </div>
                    </div>
              </IonCol>
            </IonRow>)}
        </IonGrid>
    );
}
export default Display;