import { ChartData } from 'chart.js';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { useIonToast } from "@ionic/react";
import { Chart } from 'react-chartjs-2';
import "./MintChart.scss"
import { instance } from '../../axios';
import useFoxTokenChartCookies from '../../components/useFoxTokenChartCookies';
import { environment } from '../../environments/environment';


function MintChart({ token, name, floorPrice, totalTokenListings, selectedEvent}: any) {
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
    const [foxLineData, setFoxLineData] = useState(defaultGraph);
    const chartsRef = useRef<HTMLDivElement | null>(null);
    const [tableData, setTableData] = useState<any>([]);
    const { chartDateSelected, lineColorSelected, shadedAreaColorSelected } = useFoxTokenChartCookies();
   
    // for setting height of chart, depending on what width browser is
    const tableHeight = useMemo(() => {
        if (width > 1536) return 100;
        if (width > 1280) return 105;
        if (width > 1024) return 120;
        if (width > 768) return 160;
        if (width > 640) return 180;
        return 200;
    }, [width]);

    // console.log('selectedEvent-----------',selectedEvent)
    // viewing the chart for a token
    const viewChart = () => {
        setFoxLineData(defaultGraph);

        instance
            .get( environment.backendApi + '//mintInfo?mintId=' + selectedEvent?.id )
            .then((res) => {
                console.log('res---------',res.data.data)
                const labels = res.data.data.map((el: { date: Date }) => {
                    // user can set this in the chart
                  
                        return moment(el.date,'DD MM YYYY').format('l');
                    
                });
                console.log('labels',labels)

                const discordAllData = res.data.data.map((el: { discord_all: any }) => {
                    return parseFloat(el.discord_all);
                });
                console.log('discordAllData',discordAllData)

                const tweetInteractionsData = res.data.data.map((el: { tweetInteractions: any }) =>
                        parseInt(el.tweetInteractions)
                );

                console.log('tweetInteractionsData',tweetInteractionsData)
                const discordOnlineData = res.data.data.map((el: { discord_online: any }) =>
                        parseInt(el.discord_online)
                );

                console.log('discordOnlineData',discordOnlineData)

                if (discordAllData.length === 0 && tweetInteractionsData.length === 0 && discordOnlineData.length ===0) {
                    present({
                        message: 'Unable to get price & listings data on this!',
                        color: 'danger',
                        duration: 8000,
                    });
                }

                // graph latest point...
                // for (let t in tableData) {
                //     if (tableData[t].token === token && tableData[t].floorPrice) {
                //         labels.push('a few seconds ago');
                //         discordAllData.push(tableData[t].floorPrice);
                //         tweetInteractionsData.push(tableData[t].totalTokenListings);
                //         discordOnlineData.push(tableData[t].totalTokenListings);
                //         break;
                //     }
                // }
                let datasetsAry = [
                    {
                        type: 'line' as const,
                        yAxisID: 'y0',
                        label: 'Discord All',
                        borderColor: lineColorSelected,
                        data:discordAllData,
                        // data: [44,20,45,14,70,10,35,48,32,54,7,5,4],
                        fill: {
                            target: 'origin',
                            above: shadedAreaColorSelected,
                        },
                    },
                    {
                        type: 'line' as const,
                        yAxisID: 'y1',
                        label: 'Discord Online',
                        borderColor: '#9052F8' ,
                        
                        data:discordOnlineData,
                        // data: [44,20,45,14,70,10,35,48,32,54,7,5,4],
                        fill: {
                            target: 'origin',
                            above: shadedAreaColorSelected,
                        },
                    },
                    {
                        type: 'line' as const,
                        yAxisID: 'y2',
                        label: 'Tweet Interactions',
                        borderColor:'#0052FF',
                        data:tweetInteractionsData,
                        // data: [44,20,45,14,70,10,35,48,32,54,7,5,4],
                        fill: {
                            target: 'origin',
                            above: shadedAreaColorSelected,
                        },
                    },
                ];
                setFoxLineData({
                    labels: labels,
                    // labels: [0,1,2,3,4,5,6,7,8,9,8,78,],
                    datasets: datasetsAry,
                });
            })
            .catch((err) => {
                console.error( 'error when getting fox token history data: ' + err );
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
            <div className="foxTokenCharts px-5  default-chart-theme " css={css` background-color: var(--ion-color-step-50); `} ref={chartsRef} >
                <div className="chart">
                    <Chart type="line" data={foxLineData} height={tableHeight}
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            plugins: {
                                legend: { display: true},
                                tooltip: { mode: 'index', intersect: false, },
                            },
                            scales: {
                                y0: {
                                    stacked: true,
                                    type: 'linear',
                                    position: 'right',
                                    grid: {
                                        color: '#b3b3ff',
                                    },
                                    suggestedMin: 0,
                                },
                                y1: {
                                    stacked: true,
                                    type: 'linear',
                                    position: 'right',
                                    grid: {
                                        color: '#9052F8',
                                    },
                                    suggestedMin: 0,
                                },
                                y2: {
                                    stacked: true,
                                    type: 'linear',
                                    position: 'right',
                                    grid: {
                                        color: '#C74AE3',
                                    },
                                    suggestedMin: 0,
                                },
                                x: {
                                    ticks: {
                                        autoSkip: true,
                                        maxTicksLimit: 8,
                                    },
                                },
                            },
                            // get rid of points on graph
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
