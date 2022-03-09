import { ChartData } from 'chart.js';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { instance } from '../axios';
import { environment } from '../environments/environment';
import { FoxTokenData } from '../types/FoxTokenTypes';
import Style from './Style';
import Cookies from "universal-cookie";
import axios from "axios";


function FoxTokenCharts({ token , name, floorPrice, totalTokenListings,} : FoxTokenData) {


    /**
     * States & Variables
     */

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
        if (width > 1024) return 160; // TODO: test 1280 and below
        if (width > 768) return 200;
        if (width > 640) return 220;
        return 250;
    }, [width]);

    const [tableData, setTableData] = useState<FoxTokenData[]>([]);
    const [fullTableData, setFullTableData] = useState<FoxTokenData[]>([]);
    const [tokenClickedOn, setTokenClickedOn] = useState();
    const [mySolBalance, setMySolBalance] = useState("");

    const [mySplTokens, setMySplTokens]: any = useState([]);

    const [viewMyTokensClicked, setViewMyTokensClicked] = useState(false);

    const smallWidthpx = 768;

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


    // user clicked change colour
    const [lineColorSelected, setLineColorSelected] = useState<string>(
        cookies.get('lineColorSelected2') ?
            cookies.get('lineColorSelected2') : "#14F195"); // #195e83
    const [shadedAreaColorSelected, setShadedAreaColorSelected] = useState<string>(
        cookies.get('shadedAreaColorSelected2') ?
            cookies.get('shadedAreaColorSelected2') : "rgba(26, 255, 163, 0.1)") // #01FF6F
    // when above clicked, will redraw the chart
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }

        // TODO: renable these, after you can get the code to NOT call this on page load
        // cookies.set('lineColorSelected2', lineColorSelected);
        // cookies.set('shadedAreaColorSelected2', shadedAreaColorSelected);

        // redraw the chart
        // viewChart();


        // present({
        //     message: 'After setting a valid color, load a new chart to see it',
        //     color: 'success',
        //     duration: 5000
        // });

    }, [lineColorSelected, shadedAreaColorSelected]);


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
        // setFoxLineListingsData(defaultGraph);

        // @ts-ignore
        setTokenClickedOn(name ? `${name} (${token})` : token);

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
                // console.log(listingsData);

                // graph latest point...
                for(let t in tableData){
                    if(tableData[t].token === token && tableData[t].floorPrice){
                        labels.push('a few seconds ago');
                        lineData.push(tableData[t].floorPrice);
                        listingsData.push(tableData[t].totalTokenListings);
                        break;
                    }
                }

                // console.log(labels);
                // console.log(lineData);

                let datasetsAry = [
                    {
                        type: 'line' as const,
                        yAxisID: 'y1',
                        label: 'Listings',
                        borderColor: '#9945FF', // # purple #9945FF    #14F195
                        // borderWidth: 2,
                        // tension: 0.1,
                        data: listingsData,
                    },
                    {
                        type: 'line' as const,
                        label: 'Price',
                        yAxisID: 'y0',
                        borderColor: lineColorSelected,
                        // tension: 0.1,
                        fill: {
                            target: 'origin',
                            above: shadedAreaColorSelected,
                        },
                        data: lineData,
                    },

                ];

                // let datasetsAryListings = [];

                // console.log(labels);
                // console.log(datasetsAry);
                // console.log(datasetsAryListings);

                setFoxLineData({
                    labels: labels,
                    datasets: datasetsAry
                });
                // setFoxLineListingsData({
                //     labels: labels,
                //     datasets: datasetsAryListings
                // });

                // contentRef?.scrollToPoint(0, chartsRef.current?.offsetTop ?? 0, 800)

            })
            .catch((err) => {
                console.error("error when getting fox token history data: " + err);
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
            });
    }




    // old stuff from parth...

	// const defaultGraph: ChartData<any, string> = {
    //     labels: [],
    //     datasets: [],
    // };
	// const [foxLineData, setFoxLineData] = useState(defaultGraph);
    // const [foxLineListingsData, setFoxLineListingsData] = useState(defaultGraph);
    //
    //
	// const chartsRef = useRef<HTMLDivElement | null>(null);
    //
    //
	// useEffect(() => {
	// 	if(token){
	// 		viewChart(token)
	// 	}
	// }, [token])
    // // viewing the chart for a token
    // const viewChart = (token : string) => {
    //     // token: string, name: string
    //
    //     setFoxLineData(defaultGraph);
    //     setFoxLineListingsData(defaultGraph);
    //
    //     instance
    //         .get(
    //             environment.backendApi +
    //                 '/receiver/foxTokenHistory?token=' +
    //                 token
    //         )
    //         .then((res) => {
    //             const labels = res.data.map((el: { createdAt: any }) => {
    //                 return moment(el.createdAt).fromNow();
    //             });
    //             const lineData = res.data.map((el: { floorPrice: any }) => {
    //                 return parseFloat(el.floorPrice);
    //             });
    //
    //             const listingsData = res.data.map(
    //                 (el: { totalTokenListings: any }) =>
    //                     parseInt(el.totalTokenListings)
    //             );
    //
    //
	// 			labels.push('a few seconds ago');
	// 			lineData.push(floorPrice);
	// 			listingsData.push(totalTokenListings);
    //
    //             let datasetsAry = [
    //                 {
    //                     type: 'line' as const,
    //                     label: 'Floor Price',
    //                     borderColor: '#195e83', // #14F195
    //                     borderWidth: 2,
    //                     fill: {
    //                         target: 'origin',
    //                     },
    //                     data: lineData,
    //                 },
    //             ];
    //
    //             let datasetsAryListings = [
    //                 {
    //                     type: 'line' as const,
    //                     label: 'Total Token Listings',
    //                     borderColor: '#195e83', // #14F195
    //                     borderWidth: 2,
    //                     fill: {
    //                         target: 'origin',
    //                     },
    //                     data: listingsData,
    //                 },
    //             ];
    //
    //             // console.log(labels);
    //             // console.log(datasetsAry);
    //             // console.log(datasetsAryListings);
    //
    //             setFoxLineData({
    //                 labels: labels,
    //                 datasets: datasetsAry,
    //             });
    //             setFoxLineListingsData({
    //                 labels: labels,
    //                 datasets: datasetsAryListings,
    //             });
	// 			chartsRef.current?.scrollIntoView({ behavior: 'smooth' });
    //
    //         })
    //         .catch((err) => {
    //             console.error(
    //                 'error when getting fox token history data: ' + err
    //             );
    //         });
    //
    //
    // };


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

                {/*TODO*/}
                {/*--{width}--*/}

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
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Listings'
                                    },
                                    grid: {
                                        color: '#b3b3ff'
                                    },
                                    suggestedMin: 0,
                                },
                                'y1': {
                                    type: 'linear',
                                    position: 'right',
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Price'
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
                                point:{
                                    radius: 0
                                }
                            }
                        }}
                    />

                    {/*sales data*/}
                    <Chart
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


                {/*old stuff from parth...*/}

                {/*<div className="chart sm:col-span-12 lg:col-span-6">*/}
	            {/*    <Chart*/}
	            {/*        type="line"*/}
	            {/*        // @ts-ignore*/}
	            {/*        data={foxLineData}*/}
	            {/*        height={150}*/}
	            {/*        options={{*/}
	            {/*            responsive: true,*/}
	            {/*            maintainAspectRatio: true,*/}
	            {/*            plugins: {*/}
	            {/*                legend: {*/}
	            {/*                    display: false,*/}
	            {/*                },*/}
	            {/*                title: {*/}
	            {/*                    display: true,*/}
	            {/*                    text: 'Price',*/}
	            {/*                },*/}
	            {/*                // tooltip: {*/}
	            {/*                //     enabled: true,*/}
	            {/*                //     usePointStyle: true,*/}
	            {/*                //     callbacks: {*/}
	            {/*                //         // To change title in tooltip*/}
	            {/*                //         title: (data: any) => { return data[0].parsed.x },*/}
	            {/*                //*/}
	            {/*                //         // To change label in tooltip*/}
	            {/*                //         label: (data: any) => {*/}
	            {/*                //             console.log(data);*/}
	            {/*                //             return data.parsed.y === 2 ? "Good" : "Critical"*/}
	            {/*                //         }*/}
	            {/*                //     },*/}
	            {/*                // },*/}
	            {/*            },*/}
	            {/*            scales: {*/}
	            {/*                x: {*/}
	            {/*                    ticks: {*/}
	            {/*                        autoSkip: true,*/}
	            {/*                        maxTicksLimit: 8,*/}
	            {/*                    },*/}
	            {/*                },*/}
	            {/*                y: {*/}
	            {/*                    suggestedMin: 0,*/}
	            {/*                },*/}
	            {/*            },*/}
	            {/*        }}*/}
	            {/*    />*/}
	            {/*</div>*/}
	            {/*<div className="chart sm:col-span-12 lg:col-span-6">*/}
	            {/*    <Chart*/}
	            {/*        type="line"*/}
	            {/*        data={foxLineListingsData}*/}
	            {/*        height={150}*/}
	            {/*        options={{*/}
	            {/*            responsive: true,*/}
	            {/*            maintainAspectRatio: true,*/}
	            {/*            plugins: {*/}
	            {/*                legend: {*/}
	            {/*                    display: false,*/}
	            {/*                },*/}
	            {/*                title: {*/}
	            {/*                    display: true,*/}
	            {/*                    text: 'Total Token Listings',*/}
	            {/*                },*/}
	            {/*            },*/}
	            {/*            scales: {*/}
	            {/*                x: {*/}
	            {/*                    ticks: {*/}
	            {/*                        autoSkip: true,*/}
	            {/*                        maxTicksLimit: 8,*/}
	            {/*                    },*/}
	            {/*                },*/}
	            {/*                y: {*/}
	            {/*                    suggestedMin: 0,*/}
	            {/*                },*/}
	            {/*            },*/}
	            {/*        }}*/}
	            {/*    />*/}
	            {/*</div>*/}


	        </div>
        </>
    );
}

export default FoxTokenCharts;
