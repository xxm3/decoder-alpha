import { IonToggle } from "@ionic/react";
import {useEffect, useMemo, useState} from 'react';
import MessageListItem from "./MessageListItem";
import React from "react";
import {Chart} from 'react-chartjs-2';
import Cookies from 'universal-cookie';
import {constants} from "../../util/constants";
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
    ChartData,
} from 'chart.js';
import {Message} from "../../types/Message";
import MessageThread from "./MessageThread";
import {useParams} from "react-router";
import Loader from "../Loader";
import { css } from "@emotion/react";

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

const DisplayGraph:React.FC<{
    chartDataDailyCount?: any;
    chartDataPerSource?: any;
    chartHeight: number;
    isLoadingChart?: boolean;
    totalCount?: number;
}> = ({
    chartDataDailyCount,
    chartDataPerSource,
    chartHeight,
    isLoadingChart,
    totalCount
}) => {

    const cookies = useMemo(() => new Cookies(), []);
    const [showChart, setShowChart] = useState(String(cookies.get('showChart')) === 'false' ? false : true);
    const {id: word} = useParams<{ id: string; }>();

    const completelyHideChart = false; // useMemo(() => word.indexOf(" ") !== -1 ? true : false, [word]);

    /**
     * Use Effects
     */
     useEffect(() => {
        cookies.set("showChart", String(showChart));
    }, [showChart, cookies])

    /**
     * Renders
     */
  return (
    <div>
        <div className="gap-4 mb-4 grid grid-cols-12">

            {/*search header*/}
            {totalCount && (
                <> 
                    <p className={`font-bold ${completelyHideChart ? "col-span-12" : window.innerWidth <= 360 ? "col-span-12 text-center" : "col-span-6"} sm:text-center`}>
                        Searched on "{decodeURIComponent(word)}" ({totalCount} results last 10 days)
                    </p>

                    <div className= {window.innerWidth <= 360 ?  "flex items-center justify-center col-span-12" : "flex items-center justify-center col-span-6"}  hidden={completelyHideChart}>
                        <p>Toggle Chart</p>
                        <IonToggle
							css={css`
								
								--background-checked : var(--ion-color-step-250);
								--handle-background-checked: var(--ion-color-primary-tint);
							`}
                            checked={showChart}
                            onClick={() => setShowChart(!showChart)}
                        />
                
                    </div>
                </>
            )}
        </div>
        {/* bar & line chart */}
        {/* starting with loading */}
        {isLoadingChart ?
            <div className="pt-10 flex justify-center items-center"><Loader /></div> :
        showChart &&
        (Object.keys(chartDataDailyCount).length) &&
        chartDataDailyCount &&
        chartDataPerSource &&
        !completelyHideChart &&
        (
            <div className="gap-4 grid grid-cols-12" >
                <div className="chart chart-col6">
                    <Chart
                        type="bar"
                        data={chartDataDailyCount}
                        height={chartHeight}
                        options={{
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                title: {
                                    display: true,
                                    text: '# of messages per day (from several Discords)',
                                },
                            },
                            scales: {
                                y: {
                                    suggestedMin: 0,
                                }
                            },
                            responsive: true,
                            maintainAspectRatio: true,
                        }}
                        key={chartHeight}
                    />
                </div>

                <div className="chart chart-col6">
                    <Chart
                        type="bar"
                        data={chartDataPerSource}
                        height={chartHeight}
                        options={{
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                title: {
                                    display: true,
                                    text: '# of messages per Discord',
                                },
                            },
                            responsive: true,
                            maintainAspectRatio: true,
                        }}
                        key={chartHeight}
                    />
                </div>
            </div>
        )}
    </div>
  )
}

export default DisplayGraph
