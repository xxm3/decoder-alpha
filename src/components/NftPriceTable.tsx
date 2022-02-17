import {
    IonButton,
    IonList,
    IonLabel, IonItem, IonCheckbox, IonInput
} from '@ionic/react';
import React, {KeyboardEvent, KeyboardEventHandler, useEffect, useMemo, useState} from 'react';
import {Table} from 'antd' // https://ant.design/components/table/
import { ColumnsType } from 'antd/es/table';
import Loader from "./Loader";
import {instance} from "../axios";
import {environment} from "../environments/environment";

interface NftPriceTableProps {
    foo?: string;
    onSubmit(bar: string): unknown;
}

function NftPriceTable({ foo, onSubmit }: NftPriceTableProps) {

    /**
     * States & Variables
     */
    const [tableData, setTableData] = useState([])

    const columns: ColumnsType<any> = [
        {
            title: 'Name',
            key: 'name',
            render: record => (
                <span
                    // className='cursor-pointer underline'
                    // onClick={() => handleProjectClick(record)}
                >
              {record.name}
            </span>
            ),
            sorter: (a, b) => a.name.localeCompare(b.name),
            width: 180,
            // fixed: 'left',
            // responsive: ['xs', 'sm'], // Will be displayed on every size of screen
        },
        { title: 'Mint Date', key: 'createdAt',
            render: record => (
                <span>{record.createdAt.substring(0, 10)}</span>
            ),
            sorter: (a:any, b:any) =>  a.createdAt.substring(0, 10).split("-").join("") - b.createdAt.substring(0, 10).split("-").join(""),
            width: 130,
            // responsive: ['xs', 'sm'], // Will be displayed on every size of screen
        },
        { title: 'Mint Price', dataIndex: 'mintPrice', key: 'mintPrice',
            width: 130,
            sorter: (a, b) => a.mintPrice - b.mintPrice,
            // responsive: ['xs', 'sm'], // Will be displayed on every size of screen
        },
        { title: 'Highest Price', dataIndex: 'highestPrice', key: 'highestPrice',
            width: 150,
            sorter: (a, b) => a.highestPrice - b.highestPrice,
            // responsive: ['xs', 'sm'], // Will be displayed on every size of screen
         },
        { title: '% change', key: 'pctChange', width: 130,
            sorter: (a, b) => a.pctChange - b.pctChange,
            render: record => (
                <span className={record.pctChange > 0 ? 'greenPctChange' : 'redPctChange'} hidden={!record.pctChange}>{record.pctChange ? record.pctChange.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''}%</span>
            ),
            // responsive: ['xs', 'sm'], // Will be displayed on every size of screen
        },
        { title: '# Discords Alerted on', dataIndex: 'numDiscordsAlerted', key: 'numDiscordsAlerted', width: 200,
            sorter: (a, b) => a.numDiscordsAlerted - b.numDiscordsAlerted,
            // responsive: ['md'], // Will not be displayed below 768px
        },
        { title: 'Meta', dataIndex: 'meta', key: 'meta',
            width: 200,
            sorter: (a, b) => a.meta ? a.meta.localeCompare(b.meta) : 0,
            // responsive: ['xs', 'sm'], // Will be displayed on every size of screen
        },
        { title: 'Comments',key: 'comments',
            render: record => (
                // <span>{(record.comments.length > 90) ? record.comments.substr(0, 90 - 1) + '...' : record.comments}</span>
                <span>{record.comments}</span>
            ),
            width: 400,
            // responsive: ['md'], // Will not be displayed below 768px
        },
        { title: 'ME URL', key: 'meUrl', width: 100,
            render: record => (
                <a href={record.meUrl} target="_blank" hidden={!record.meUrl}>view</a>
            ),
            // responsive: ['md'], // Will not be displayed below 768px
        },
        { title: 'Mint URL', key: 'mintUrl', width: 100,
            render: record => (
                <a href={record.mintUrl} target="_blank" hidden={record.mintUrl.length < 5}>view</a>
            ),
            // responsive: ['md'], // Will not be displayed below 768px
        },
        // stillBeingTracked
    ];


    /**
     * Use Effects
     */
    useEffect(() => {
        const fetchTableData = async () => {

            setTableData([]);

            instance
                .get(environment.backendApi + '/mintAlertsAutomatedStats')
                .then((res) => {
                    setTableData(res.data);
                })
                .catch((err) => {
                    console.error("error when getting mint alerts automated: " + err);
                });
        }
        fetchTableData();
    }, []);

    /**
     * Functions
     */

    /**
     * Renders
     */

    return (
        <>
            <div className={`w-full bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4`}>

                <div className={`font-bold pb-1 w-full`}>Mint Alerts Automated - Statistics</div>
                <p>These are mints that were posted in at least two discords, and sent to the #mint-alerts-automated channel</p>

                <div>
                {
                    !tableData.length
                        ?   <div className="pt-10 flex justify-center items-center">
                                <Loader />
                            </div>
                        : <div className=" "> {/* max-w-fit mx-auto */}

                            <br />

                            <Table
                                className=''
                                key={'name'}
                                dataSource={tableData}
                                columns={columns}
                                bordered
                                scroll={{x: 'max-content'}}
                                // This both x & y aren't working together properly in our project. I tested out on codesandbox. It works perfectly there!!!
                                // scroll={{x: 'max-content', y: 500}}
                                pagination={false}
                                style={{width: '100%', margin: '0 auto', textAlign: 'center'}}
                            />
                        </div>
                }
                </div>
            </div>
            <br/>


            <div hidden={true}
                className={`w-full bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4`}>
                <div className={`font-bold pb-3 w-full text-lg`}>Mint Alerts Automated - Custom Alerts</div>
                <div>Note: for 3 NFT holders only</div>

                <div>
                    <label className={`font-bold pb-1 w-full`} htmlFor="">Get an alert when the below meta gets alerted in #mint-alerts-automated</label>

                    <IonList>
                        <IonItem>
                            <IonLabel>Staking/Token/Low Supply</IonLabel>
                            <IonCheckbox slot="start" value="biff" />
                        </IonItem>

                        <IonItem>
                            <IonLabel>Metaverse</IonLabel>
                            <IonCheckbox slot="start" value="griff" />
                        </IonItem>

                        <IonItem>
                            <IonLabel>Casino</IonLabel>
                            <IonCheckbox slot="start" value="buford" />
                        </IonItem>

                        <IonItem>
                            <IonLabel>P2E</IonLabel>
                            <IonCheckbox slot="start" value="buford" />
                        </IonItem>

                        <IonItem>
                            <IonLabel>Bot / Sniper</IonLabel>
                            <IonCheckbox slot="start" value="buford" />
                        </IonItem>

                        <IonItem>
                            <IonLabel>Asian / Hong Kong devs</IonLabel>
                            <IonCheckbox slot="start" value="buford" />
                        </IonItem>
                    </IonList>

                    <IonButton color="success" className="text-sm" >
                        Submit
                    </IonButton>
                    <br/><br/>


                </div>

            </div>

        </>
    );
}
export default NftPriceTable;

