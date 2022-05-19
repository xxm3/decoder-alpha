import { ChartData } from 'chart.js';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { useIonToast } from "@ionic/react";
import { Chart } from 'react-chartjs-2';
import "./MintChart.scss"
import { instance } from '../../axios';
import { environment } from '../../environments/environment';


function MintChart({selectedEvent}: any) {
    /**
     * States & Variables
     */
    const [present, dismiss] = useIonToast();
    const defaultGraph: ChartData <any, string> = {
        labels: [],
        datasets: [],
    };
    // resize window
    const [width, setWidth] = useState(window.innerWidth);
    const [mintLineData, setmintLineData] = useState(defaultGraph);
    const chartsRef = useRef<HTMLDivElement | null>(null);
   
    // for setting height of chart, depending on what width browser is
    const tableHeight = useMemo(() => {
        if (width > 1536) return 125;
        if (width > 1280) return 140;
        if (width > 1024) return 130;
        if (width > 768) return 160;
        if (width > 640) return 180;
        return 200;
    }, [width]);

    // viewing the chart for a calendar
    const viewChart = () => {
        setmintLineData(defaultGraph);

        instance
            .get( environment.backendApi + '/mintInfo?mintId=' + selectedEvent?.id )
            .then((res) => {
               

                const labels = res.data.data.map((el: { date: Date }) => {
                    return moment(el.date,'DD MM YYYY').format('l');
                });

                const discordAllData = res.data.data.map((el: { discord_all: any }) => {
                    return parseInt(el.discord_all);
                });
                const tweetInteractionsData = res.data.data.map((el: { tweetInteractions: any }) =>
                        parseInt(el.tweetInteractions)
                );

                const discordOnlineData = res.data.data.map((el: { discord_online: any }) =>
                        parseInt(el.discord_online)
                );


                if (discordAllData.length === 0 && tweetInteractionsData.length === 0 && discordOnlineData.length ===0) {
                    present({
                        message: 'Unable to get Twitter & Discord data on this!',
                        color: 'danger',
                        duration: 8000,
                    });
                }

                let datasetsAry = [
                    {
                        type: 'line' as const,
                        yAxisID: 'y0',
                        label: 'Discord All',
                        borderColor: '#14F195',
                        data:discordAllData,
                        fill: {
                            target: 'origin',
                            above: '#14F19505',
                        },
                    },
                    {
                        type: 'line' as const,
                        yAxisID: 'y0',
                        label: 'Discord Online',
                        borderColor: '#9052F8' ,
                        data:discordOnlineData,
                        fill: {
                            target: 'origin',
                            above: '#9052F805',
                        },
                    },
                    {
                        type: 'line' as const,
                        yAxisID: 'y0',
                        label: 'Tweet Interactions',
                        borderColor:'#0052FF',
                        data:tweetInteractionsData,
                        fill: {
                            target: 'origin',
                            above: '#0052FF05',
                        },
                    },
                    
                ];
                setmintLineData({
                    labels: labels,
                    datasets: datasetsAry,
                });
            })
            .catch((err) => {
                console.error( 'error when getting event history data: ' + err );
                present({
                    message: 'Error - unable to load chart data. Please refresh and try again',
                    color: 'danger',
                    duration: 8000,
                    buttons: [{ text: 'hide', handler: () => dismiss() }],
                });
            });

    };

    useEffect(() => {
        viewChart();
    }, []);

    useEffect(() => {
        function resizeWidth() {
            setWidth(window.innerWidth);
        }
        window.addEventListener('resize', resizeWidth);
        return () => window.removeEventListener('resize', resizeWidth);
    }, []);

    return (
        <>
            <div className="calendarCharts px-5 default-chart-theme " css={css` background-color: var(--ion-color-step-50); `} ref={chartsRef} >
                <div className="chart">
                    <Chart type="line" data={mintLineData} height={tableHeight}
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            plugins: {
                                legend: { display: false},
                                tooltip: { mode: 'index', intersect: false, },
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        precision: 0
                                    },
                                  },
                              },
                            elements: {
                                point: {
                                    radius: 0,
                                },
                            },
                        }}
                    />

                   
                </div>
            </div>
        </>
    );
}

export default MintChart;
