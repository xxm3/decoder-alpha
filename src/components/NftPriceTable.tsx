import {
    IonButton,
    IonList,
    IonLabel, IonItem, IonCheckbox, IonInput
} from '@ionic/react';
import { useEffect, useState} from 'react';
import Loader from "./Loader";
import {instance} from "../axios";
import {environment} from "../environments/environment";
import meLogo from '../images/me.png';
import { Column  } from '@material-table/core';
import Table from './Table';
import Style from './Style';
import moment from 'moment';

interface NftPriceTableProps {
    foo?: string;
    onSubmit(bar: string): unknown;
}

interface MintData {
	name : string;
	mintPrice: string;
	highestPrice: string;
	pctChange: number;
	meta : string|null;
	comments: string|null;
	meUrl : string;
	mintUrl: string;
	createdAt : string;
	updatedAt : string;
	numDiscordsAlerted : number;
	stillBeingTracked: number;
}
function NftPriceTable({ foo, onSubmit }: NftPriceTableProps) {

    /**
     * States & Variables
     */
    const [tableData, setTableData] = useState<MintData[]>([]);
    const [hideComments, setHideComments] = useState(true);
    const [width, setWidth] = useState(window.innerWidth);
    const smallWidthpx = 768;

    const columns: Column<MintData>[] = [
        {
            title: 'Name',
            render: (record) => (
                <span
				
                >
                    {record.name}
                </span>
            ),
            customSort: (a, b) => a.name.localeCompare(b.name),
			searchable: true,
			customFilterAndSearch: (term, rowData) => rowData.name.toLowerCase().includes(term.toLowerCase()),
        },
        {
            title: 'Mint Date',
            render: (record) => (
                <span>
                    {moment(record.createdAt).fromNow()}
                </span>
            ),
            customSort: (a, b) =>
                +new Date(a.createdAt) - +new Date(b.createdAt),
        },
        {
            title: 'Mint Price',
            customSort: (a, b) => +a.mintPrice - +b.mintPrice,
			render: (record) => <span>{record.mintPrice}</span>,

        },
        {
            title: 'High Price',
            customSort: (a, b) => +a.highestPrice - +b.highestPrice,
			render: (record) => <span>{record.highestPrice ?? "-"}</span>,

        },
        {
            title: '% change',
            customSort: (a, b) => a.pctChange - b.pctChange,
            render: (record) => (
                <span
                    className={
                        record.pctChange > 0 ? 'greenPctChange' : 'redPctChange'
                    }
                    hidden={!record.pctChange}
                >
                    {record.pctChange
                        ? record.pctChange
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        : ''}
                    %
                </span>
            ),
        },
        {
            title: 'Meta',
			sorting: false,
			render: (record) => <span>{record.meta}</span>,
        },
        {
            title: 'ME URL',
            render: (record) => (
                <a
                    href={record.meUrl}
                    target="_blank"
                    className="big-emoji"
                    hidden={!record.meUrl || record.meUrl.length < 5}
                >
                    <img src={meLogo} className="me-logo" />
                </a>
            ),
			sorting: false
        },
        {
            title: 'Mint URL',
            render: (record) => (
                <a
                    href={record.mintUrl}
                    target="_blank"
                    className="big-emoji"
                    hidden={record.mintUrl.length < 5}
                >
                    🌐
                </a>
            ),
			sorting: false
        },
        {
            title: 'Comments',
            render: (record) => (
                // <span>{(record.comments.length > 90) ? record.comments.substr(0, 90 - 1) + '...' : record.comments}</span>
                <span hidden={hideComments}>{record.comments}</span>
            ),
			sorting: false
        },
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

               

                {
                    !tableData.length
                        ?   <div className="pt-10 flex justify-center items-center">
                                <Loader />
                            </div>
                        : <div className=" "> {/* max-w-fit mx-auto */}

                            <Table
                                data={tableData}
                                columns={columns}
								title={"Mint Alerts Automated - Stats"}
                            />
                        </div>
                }
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

