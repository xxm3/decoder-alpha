import {IonCol, IonRow} from "@ionic/react";
import {Doughnut} from "react-chartjs-2";
import React from "react";


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
                    }} />
                </IonCol>
            </IonRow>
        </div>
    </IonCol>
</IonRow>
}





{/* pie chart */}
{showPie &&
<IonCol size="12">
    <div className="flex items-center justify-center w-full pt-3">

        <label htmlFor="toggleB" className="flex items-center cursor-pointer">
            <div className="relative">
                <input type="checkbox" id="toggleB" className="sr-only" onClick={(e) => {
                    setShowBar(!showBar);
                    setShowDoughnut(!showDoughnut);
                }} />
                <div className="block bg-cp w-14 h-8 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-black w-6 h-6 rounded-full transition"></div>
            </div>
            <div className="ml-3 text-white font-medium">
                Toggle to <b className="text-cb">{showBar ? 'Doughnut' : 'Bar'}</b>
            </div>
        </label>

    </div>
</IonCol>}




