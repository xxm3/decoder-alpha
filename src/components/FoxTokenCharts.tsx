import { ChartData } from 'chart.js';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { instance } from '../axios';
import { environment } from '../environments/environment';
import { FoxTokenData } from '../types/FoxTokenTypes';
import Style from './Style';


function FoxTokenCharts({ token , name, floorPrice, totalTokenListings,} : FoxTokenData) {
	const defaultGraph: ChartData<any, string> = {
        labels: [],
        datasets: [],
    };
	const [foxLineData, setFoxLineData] = useState(defaultGraph);
    const [foxLineListingsData, setFoxLineListingsData] = useState(defaultGraph);


	const chartsRef = useRef<HTMLDivElement | null>(null);


	useEffect(() => {
		if(token){
			viewChart(token)
		}
	}, [token])
    // viewing the chart for a token
    const viewChart = (token : string) => {
        // token: string, name: string

        setFoxLineData(defaultGraph);
        setFoxLineListingsData(defaultGraph);

        instance
            .get(
                environment.backendApi +
                    '/receiver/foxTokenHistory?token=' +
                    token
            )
            .then((res) => {
                const labels = res.data.map((el: { createdAt: any }) => {
                    return moment(el.createdAt).fromNow();
                });
                const lineData = res.data.map((el: { floorPrice: any }) => {
                    return parseFloat(el.floorPrice);
                });

                const listingsData = res.data.map(
                    (el: { totalTokenListings: any }) =>
                        parseInt(el.totalTokenListings)
                );


				labels.push('a few seconds ago');
				lineData.push(floorPrice);
				listingsData.push(totalTokenListings);

                let datasetsAry = [
                    {
                        type: 'line' as const,
                        label: 'Floor Price',
                        borderColor: '#195e83', // #14F195
                        borderWidth: 2,
                        fill: {
                            target: 'origin',
                        },
                        data: lineData,
                    },
                ];

                let datasetsAryListings = [
                    {
                        type: 'line' as const,
                        label: 'Total Token Listings',
                        borderColor: '#195e83', // #14F195
                        borderWidth: 2,
                        fill: {
                            target: 'origin',
                        },
                        data: listingsData,
                    },
                ];

                // console.log(labels);
                // console.log(datasetsAry);
                // console.log(datasetsAryListings);

                setFoxLineData({
                    labels: labels,
                    datasets: datasetsAry,
                });
                setFoxLineListingsData({
                    labels: labels,
                    datasets: datasetsAryListings,
                });
				chartsRef.current?.scrollIntoView({ behavior: 'smooth' });
               
            })
            .catch((err) => {
                console.error(
                    'error when getting fox token history data: ' + err
                );
            });
    };
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
	            <div className="chart sm:col-span-12 lg:col-span-6">
	                <Chart
	                    type="line"
	                    // @ts-ignore
	                    data={foxLineData}
	                    height={150}
	                    options={{
	                        responsive: true,
	                        maintainAspectRatio: true,
	                        plugins: {
	                            legend: {
	                                display: false,
	                            },
	                            title: {
	                                display: true,
	                                text: 'Price',
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
	                            x: {
	                                ticks: {
	                                    autoSkip: true,
	                                    maxTicksLimit: 8,
	                                },
	                            },
	                            y: {
	                                suggestedMin: 0,
	                            },
	                        },
	                    }}
	                />
	            </div>
	            <div className="chart sm:col-span-12 lg:col-span-6">
	                <Chart
	                    type="line"
	                    data={foxLineListingsData}
	                    height={150}
	                    options={{
	                        responsive: true,
	                        maintainAspectRatio: true,
	                        plugins: {
	                            legend: {
	                                display: false,
	                            },
	                            title: {
	                                display: true,
	                                text: 'Total Token Listings',
	                            },
	                        },
	                        scales: {
	                            x: {
	                                ticks: {
	                                    autoSkip: true,
	                                    maxTicksLimit: 8,
	                                },
	                            },
	                            y: {
	                                suggestedMin: 0,
	                            },
	                        },
	                    }}
	                />
	            </div>
	        </div>
        </>
    );
}

export default FoxTokenCharts;
