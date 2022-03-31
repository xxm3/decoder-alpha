import {
    IonButton,
    IonList,
    IonLabel, IonItem, IonCheckbox, IonInput, IonIcon, useIonToast
} from '@ionic/react';
import React, { useEffect, useState} from 'react';
import Loader from "../components/Loader";
import {instance} from "../axios";
import {environment} from "../environments/environment";
import meLogo from '../images/me.png';
import { Column  } from '@material-table/core';
import Table from '../components/Table';
import moment from 'moment';
import {eye, eyeOff, eyeOffOutline, eyeOutline, notifications} from "ionicons/icons";
import {useHistory} from "react-router";

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
    image : string;
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
    const [present, dismiss] = useIonToast();
    const history = useHistory();

    const [tableData, setTableData] = useState<MintData[]>([]);
    const [hideComments, setHideComments] = useState(true);
    const [width, setWidth] = useState(window.innerWidth);
    const smallWidthpx = 768;

    const columns: Column<MintData>[] = [
        {
            title: 'Name',
            render: (record) => (
               <>
                   <img  className ={`avatarImg ${!record?.image?'hiddenImg': ''}`} key={record?.image} src={record?.image} />
                <span>
                    {record.name.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}
                </span>
               </>
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
                .catch((error) => {
                    console.error("error when getting mint alerts automated: " + error);

                    let msg = '';
                    if (error && error.response) {
                        msg = String(error.response.data.body);
                    } else {
                        msg = 'Unable to connect. Please try again later';
                    }

                    present({
                        message: msg,
                        color: 'danger',
                        duration: 5000
                    });
                    // if(msg.includes('logging in again')){
                    //     history.push("/login");
                    // }
                });
        }
        fetchTableData();
    }, []);

    // resize window
    useEffect(() => {
        function resizeWidth() {
            setWidth(window.innerWidth);
        }

        window.addEventListener('resize', resizeWidth);
        return () => window.removeEventListener('resize', resizeWidth);
    }, []);

    /**
     * Functions
     */

    /**
     * Renders
     */

    return (
        <>
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
								description="These are mints that were posted in at least two discords, and sent to the #mint-alerts-automated channel"
								actions={[
                                    {
                                        icon: () => <IonIcon icon={notifications}/>,
                                        tooltip: 'Alerts for new links',
                                        onClick: () => history.push('/alerts#ma'),
                                        isFreeAction: true,
                                    },
									{
										icon : hideComments ? () => <IonIcon icon={eye}/> :  () => <IonIcon icon={eyeOff}/>,
										tooltip : hideComments ? "Show Comments" : "Hide comments",
										onClick : () => setHideComments(!hideComments),
										isFreeAction : true
									}
								]}
                            />
                        </div>
                }


            {/*<div hidden={true}*/}
            {/*    className={`w-full bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4`}>*/}
            {/*    <div className={`font-bold pb-3 w-full text-lg`}>Mint Alerts Automated - Custom Alerts</div>*/}
            {/*    <div>Note: for 3 NFT holders only</div>*/}

            {/*    <div>*/}
            {/*        <label className={`font-bold pb-1 w-full`} htmlFor="">Get an alert when the below meta gets alerted in #mint-alerts-automated</label>*/}

            {/*        <IonList>*/}
            {/*            <IonItem>*/}
            {/*                <IonLabel>Staking/Token/Low Supply</IonLabel>*/}
            {/*                <IonCheckbox slot="start" value="biff" />*/}
            {/*            </IonItem>*/}

            {/*            <IonItem>*/}
            {/*                <IonLabel>Metaverse</IonLabel>*/}
            {/*                <IonCheckbox slot="start" value="griff" />*/}
            {/*            </IonItem>*/}

            {/*            <IonItem>*/}
            {/*                <IonLabel>Casino</IonLabel>*/}
            {/*                <IonCheckbox slot="start" value="buford" />*/}
            {/*            </IonItem>*/}

            {/*            <IonItem>*/}
            {/*                <IonLabel>P2E</IonLabel>*/}
            {/*                <IonCheckbox slot="start" value="buford" />*/}
            {/*            </IonItem>*/}

            {/*            <IonItem>*/}
            {/*                <IonLabel>Bot / Sniper</IonLabel>*/}
            {/*                <IonCheckbox slot="start" value="buford" />*/}
            {/*            </IonItem>*/}

            {/*            <IonItem>*/}
            {/*                <IonLabel>Asian / Hong Kong devs</IonLabel>*/}
            {/*                <IonCheckbox slot="start" value="buford" />*/}
            {/*            </IonItem>*/}
            {/*        </IonList>*/}

            {/*        <IonButton color="success" className="text-sm" >*/}
            {/*            Submit*/}
            {/*        </IonButton>*/}
            {/*        <br/><br/>*/}


            {/*    </div>*/}

            {/*</div>*/}

        </>
    );
}
export default NftPriceTable;

