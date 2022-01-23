


// interface DisplayProps {
//     chartData: any;
//     height: number;
//     doughnutData: any,
//     position: string,
//     total: number;
//     totalCountHeight: number;
//     showPie: boolean;
//     showChart: number;
//     width: number;
// }


// const [doughnutHeight, setDoughnutHeight] = React.useState(0);
// const history = useHistory();
import {useEffect, useRef, useState} from "react";
const ref = useRef();
// const refScrollUp = useRef();
const [scrollPosition, setSrollPosition] = useState(0);
const [showButton, setShowButton] = useState(true);





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







{/* pie chart */}

{/*{showPie && (*/}
{/*    <IonRow>*/}
{/*        <IonCol size-xl="4" size-lg="5" size-md="6" size-sm="7">*/}
{/*            <div className="p-4 h-full shadow-lg rounded-l bg-cbg" ref={ref} id="doughnut">*/}
{/*                <Doughnut data={doughnutData} options={{*/}
{/*                    plugins: {*/}
{/*                        legend: {*/}
{/*                            labels: {*/}
{/*                                color: 'white',*/}
{/*                            },*/}
{/*                            position: `${position}`,*/}
{/*                        },*/}
{/*                        title: {*/}
{/*                            color: 'red',*/}
{/*                        },*/}
{/*                        scales: {*/}
{/*                            yAxes: [{*/}
{/*                                ticks: {*/}
{/*                                    beginAtZero: true,*/}
{/*                                    color: 'white'*/}
{/*                                },*/}
{/*                            }],*/}
{/*                            xAxes: [{*/}
{/*                                ticks: {*/}
{/*                                    color: 'white'*/}
{/*                                },*/}
{/*                            }]*/}
{/*                        },*/}
{/*                    },*/}
{/*                    responsive: true,*/}
{/*                    maintainAspectRatio: true,*/}
{/*                }} />*/}
{/*            </div>*/}
{/*        </IonCol>*/}
{/*        <IonCol size-xl="8" size-lg="7" size-md="6" size-sm="5">*/}
{/*            <div*/}
{/*                className="overflow-y-scroll shadow-lg  bg-cbg rounded-l flex flex-col divide-y divide-gray-400"*/}
{/*                style={{ height: `${doughnutHeight}px` }}>*/}
{/*                <div className="space-y-6 pb-10 p-4">*/}
{/*                    {messages.map((m, idx) => {*/}
{/*                        return (<MessageListItem idx={idx + 1} key={m.id} message={m} word={word} />)*/}
{/*                    })}*/}
{/*                </div>*/}
{/*            </div>*/}
{/*        </IonCol>)*/}
{/*    </IonRow>)}*/}




// plus scroll to top and resize...




// window.onresize = () => {
//     updateSize();
// };

// function updateSize() {
//     const stop = setTimeout(() => {
//         if (ref.current) {
//             // setDoughnutHeight(ref?.current.offsetHeight);
//             window.clearInterval(stop);
//         }
//     }, 100);
// }

// useEffect(() => {
//     updateSize();
// }, []);







{/* {showButton && (
                    <IonButton onClick={scrollToTop} className="back-to-top">
                    up
                    </IonButton>
                )}
                <button class="bg-blue-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={scrollToTop}>
                    Button
                </button> */}









