import { ChartData } from 'chart.js';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { instance } from '../axios';
import { environment } from '../environments/environment';
import { FoxTokenData } from '../types/FoxTokenTypes';
import Style from './Style';
import Cookies from "universal-cookie";
import {useIonToast} from "@ionic/react";

import { Chart } from 'react-chartjs-2';
// import { Chart, Interaction } from 'chart.js';
// import {CrosshairPlugin,Interpolate} from 'chartjs-plugin-crosshair';

function FoxTokenCharts({ token , name, floorPrice, totalTokenListings,} : FoxTokenData) {

    /**
     * States & Variables
     */
    const [present, dismiss] = useIonToast();

    // resize window
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        function resizeWidth() {
            setWidth(window.innerWidth);
        }

        window.addEventListener('resize', resizeWidth);
        return () => window.removeEventListener('resize', resizeWidth);
    }, []);

    // for setting height of chart, depending on what width browser is
    const tableHeight = useMemo(() => {
        if (width > 1536) return 100;
        if (width > 1280) return 105;
        if (width > 1024) return 120;
        if (width > 768) return 160;
        if (width > 640) return 180;
        return 200;
    }, [width]);

    const [tableData, setTableData] = useState<FoxTokenData[]>([]);
    // const [fullTableData, setFullTableData] = useState<FoxTokenData[]>([]);
    const [tokenClickedOn, setTokenClickedOn] = useState();

    // const [mySolBalance, setMySolBalance] = useState("");
    // const [mySplTokens, setMySplTokens]: any = useState([]);
    // const [viewMyTokensClicked, setViewMyTokensClicked] = useState(false);
    // const smallWidthpx = 768;

    const defaultGraph: ChartData<any, string> = {
        labels: [],
        datasets: [],
    };
    const [foxLineData, setFoxLineData] = useState(defaultGraph);
    const [foxSalesData, setFoxSalesData] = useState(defaultGraph);
    // const [foxLineListingsData, setFoxLineListingsData] = useState(defaultGraph);

    const chartsRef = useRef<HTMLDivElement | null>(null);

    const firstUpdate = useRef(true);

    const cookies = useMemo(() => new Cookies(), []);

    // # purple #9945FF - for listings
    const lineColorSelected = "#14F195"; // green - for price
    // color repeated on App.css & FoxTokenCharts.tsx
    const shadedAreaColorSelected = "rgba(67, 192, 187, 0.1)"; // "rgba(26, 255, 163, 0.1)"; // lighter shade of green

    // user clicked change colour
    // const [lineColorSelected, setLineColorSelected] = useState<string>(
    //     cookies.get('lineColorSelected2') ?
    //         cookies.get('lineColorSelected2') : "#14F195"); // #195e83
    // const [shadedAreaColorSelected, setShadedAreaColorSelected] = useState<string>(
    //     cookies.get('shadedAreaColorSelected2') ?
    //         cookies.get('shadedAreaColorSelected2') : "rgba(26, 255, 163, 0.1)") // #01FF6F
    // // when above clicked, will redraw the chart
    // useEffect(() => {
    //     if (firstUpdate.current) {
    //         firstUpdate.current = false;
    //         return;
    //     }
    //
    //     // (IF doing this) re-enable these, after you can get the code to NOT call this on page load
    //     // cookies.set('lineColorSelected2', lineColorSelected);
    //     // cookies.set('shadedAreaColorSelected2', shadedAreaColorSelected);
    //
    //     // redraw the chart
    //     // viewChart();
    //
    //     // (IF doing this) I used to have the below code in a use effect (in the “customize” button on fox table) in “}, [lineColorSelected, shadedAreaColorSelected]);” — well I still do but you removed it for whatever reason. We need a better ui/ux  (or need below to work) — to tell a user what to do after they are changing the color in the chart
    //     // present({
    //     //     message: 'After setting a valid color, load a new chart to see it',
    //     //     color: 'success',
    //     //     duration: 5000
    //     // });
    //
    // }, [lineColorSelected, shadedAreaColorSelected]);

    // user clicked the radio for the dates in the chart
    const [chartDateSelected, setChartDateSelected] = useState<string>(cookies.get('chartDateFormat') ? cookies.get('chartDateFormat') : 'fromNow');
    // when above radio clicked, will redraw the chart
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }

        cookies.set('chartDateFormat', chartDateSelected);

        // redraw the chart
        viewChart();
    }, [chartDateSelected]);


    // viewing the chart for a token
    const viewChart = () => { // token: string, name: string
        // reset the chart
        setFoxLineData(defaultGraph);

        // @ts-ignore
        setTokenClickedOn(name ? `${name} (${token})` : token);

        // console.log(token);

        // get the price/listings history for a SINGLE token
        instance
            .get(environment.backendApi + '/receiver/foxTokenHistory?token=' + token)
            .then((res) => {

                const labels = res.data.map((el: { createdAt: any; }) => {

                    // user can set this in the chart
                    if(chartDateSelected === 'fromNow'){
                        return moment(el.createdAt).fromNow()
                    }else{
                        return moment(el.createdAt).format('MM-DD HH:MM');
                    }

                });
                const lineData = res.data.map((el: { floorPrice: any; }) => {
                    return parseFloat(el.floorPrice);
                });

                const listingsData = res.data.map((el: { totalTokenListings: any; }) => parseInt(el.totalTokenListings));

                if(lineData.length === 0 && listingsData.length === 0){
                    present({
                        message: 'Unable to get price & listings data on this!',
                        color: 'danger',
                        duration: 8000
                    });
                }

                // graph latest point...
                for(let t in tableData){
                    if(tableData[t].token === token && tableData[t].floorPrice){
                        labels.push('a few seconds ago');
                        lineData.push(tableData[t].floorPrice);
                        listingsData.push(tableData[t].totalTokenListings);
                        break;
                    }
                }

                let datasetsAry = [
                    {
                        type: 'line' as const,
                        yAxisID: 'y1',
                        label: 'Listings',
                        borderColor: '#9945FF',
                        data: listingsData,
                    },
                    {
                        type: 'line' as const,
                        label: 'Price',
                        yAxisID: 'y0',
                        borderColor: lineColorSelected,
                        fill: {
                            target: 'origin',
                            above: shadedAreaColorSelected,
                        },
                        data: lineData,
                    },
                ];

                // console.log(labels);
                // console.log(datasetsAry);

                setFoxLineData({
                    labels: labels,
                    datasets: datasetsAry
                });

            })
            .catch((err) => {
                console.error("error when getting fox token history data: " + err);

                present({
                    message: 'Error - unable to load chart data. Please refresh and try again',
                    color: 'danger',
                    duration: 8000
                });
            });

        // also get the sales history for that token, from FF
        instance
            .post(environment.backendApi + '/receiver/foxSales', {token: token})
            .then((res) => {

                // now graph it!
                setFoxSalesData({
                    labels: res.data.labels,
                    datasets: [
                        {
                            type: 'line' as const,
                            label: 'Price',
                            yAxisID: 'y0',
                            borderColor: lineColorSelected,
                            // tension: 0.1,
                            data: res.data.data,
                            showLine: false
                        },
                    ]
                });

                if(res.data.data.length === 0){
                    present({
                        message: 'No sales data found!',
                        color: 'danger',
                        duration: 5000
                    });
                }

            });

            // TODO: when test_vehn is run ... need to point to test DB...

            instance
                .post(`${environment.backendApi}/receiver/foxTokenLatestSale`, { tokens: [token] })
                .then((res) => {
                    // (nice to have) Update table data with the last listing date
                    // sales = res.data.data.sales
                });
        }

    // need to call it duh...
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }

        viewChart();
    }, []);

    return (
        <>
		<Style>
			{`
				.foxTokenCharts {
					background-color: var(--ion-color-step-50);
				}

			`}
		</Style>
        	<div className="foxTokenCharts px-5 gap-4 grid grid-cols-12" ref={chartsRef}>

                <div className="chart">
                    <Chart
                        type="line"
                        data={foxLineData}
                        height={tableHeight}
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                legend: {
                                    display: true,
                                },
                                title: {
                                    display: false,
                                    text: tokenClickedOn
                                        ? tokenClickedOn + ' - Price' : 'Price  ',
                                },
                                // tooltip: {
                                //     enabled: true,
                                //     usePointStyle: true,
                                //     callbacks: {
                                //         // To change title in tooltip
                                //         title: (data: any) => { return data[0].parsed.x },
                                //
                                //         // To change label in tooltip
                                //         label: (data: any) => {
                                //             console.log(data);
                                //             return data.parsed.y === 2 ? "Good" : "Critical"
                                //         }
                                //     },
                                // },
                            },
                            scales: {
                                // https://www.chartjs.org/docs/latest/axes/cartesian/
                                // https://stackoverflow.com/questions/51296950/charts-js-graph-with-multiple-y-axes
                                'y0': {
                                    // stacked: true,
                                    type: 'linear',
                                    position: 'left',
                                    // label:{
                                    //     display: true,
                                    //     labelString: 'Listings'
                                    // },
                                    // scaleLabel: {
                                    //     display: true,
                                    //     labelString: 'Listings'
                                    // },
                                    grid: {
                                        color: '#b3b3ff'
                                    },
                                    suggestedMin: 0,
                                },
                                'y1': {
                                    type: 'linear',
                                    position: 'right',
                                    // scaleLabel: {
                                    //     display: true,
                                    //     labelString: 'Price'
                                    // },
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
                                point:{
                                    radius: 0
                                }
                            }
                        }}
                    />

                    {/*sales data*/}
                    <Chart
                        hidden={foxSalesData?.labels?.length === 0}
                        type="line"
                        data={foxSalesData}
                        height={tableHeight / 1.5}
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                title: {
                                    display: true,
                                    text: 'Sales (note the Sales & Price graph do NOT start at the same time)',
                                },
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        autoSkip: true,
                                        maxTicksLimit: 8,
                                    },
                                },
                            },
                            elements: {
                                point:{
                                    radius: 3
                                }
                            }
                        }}
                    />
                </div>

	        </div>
        </>
    );
}

export default FoxTokenCharts;
