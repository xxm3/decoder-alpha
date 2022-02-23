import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { instance } from '../../axios';
import { environment } from '../../environments/environment';
import Header from "../../components/header/Header";
import Loader from '../../components/Loader';
import {Table} from 'antd'
import { ColumnsType } from 'antd/es/table';
import {IonContent, IonModal } from '@ionic/react';

import './Schedule.css'

const Schedule = () => {
    interface Mint {
        image: string,
        project: string,
        twitterLink: string,
        discordLink: string,
        time: string,
        tillTheMint: string,
        count: string,
        price: string,
        extras: string,
        tenDaySearchResults: any,
        mintExpiresAt: any,
    }

    /**
     * States & Variables.
     */
    const [date, setDate] = useState('')
    const [mints, setMints] = useState<Mint[]>([])
    const [splitCollectionName, setSplitCollectionName] = useState([])

    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    let dataSource = mints

    /**
     * This will call the every minute to update the mints array and assign mintExpiresAt field
     * which is calculated with moment.fromNow()
     * So as we are scrapping the data every hour and since we would have an hour old data
     * this will keep updating the time of when the mint will expire
     */
     const addMintExpiresAt = () => {
        for(let i = 0; i < dataSource.length; i++) {
            if(dataSource[i].time !== "")
            dataSource[i].mintExpiresAt = " (" + moment.utc(dataSource[i].time, 'hh:mm:ss').fromNow() + ")";
        }
          setMints([...dataSource]);
     }

     useEffect(() => {
        dataSource.length && addMintExpiresAt();

        const interval = setInterval(() => {
          for(let i = 0; i < dataSource.length; i++) {
              if(dataSource[i].time !== "")
              dataSource[i].mintExpiresAt = " (" + moment.utc(dataSource[i].time, 'hh:mm:ss').fromNow() + ")"
          }
            setMints([...dataSource])
        }, 60000)

        return () => clearInterval(interval);
    }, [dataSource.length]);


    // Get today's mints
    const fetchMintsData = () => {
        setIsLoading(true);

        instance
            .get(environment.backendApi + '/getTodaysMints')
            .then((res) => {
                setMints(res.data.data.mints);
                setDate(res.data.data.date);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                console.error("error when getting mints: " + err);
            })
    }

    useEffect(() => {
        fetchMintsData();
    }, []);


    // This will call the mintExpiresAt function every minute to update tillTheMint's time
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //       mintExpiresAt(mints)
    //     }, 60000)
    //
    //     return () => clearInterval(interval);
    // }, [mints]);


    /**
     * this function is used to update the time of tillTheMint every minute
     * @param {[]} mints array
     * @return {} update the mints array objects values => tillTheMint to new values
     */
        // const mintExpiresAt = (arr: any) => {
        //   for(let i = 0; i < arr.length; i++) {
        //     if(arr[i].mintExpiresAt || arr[i].mintExpiresAt?.length !== 0) {
        //       const timeNow = moment()
        //       const timeExpiresAt = moment(arr[i].mintExpiresAt)
        //
        //       const diff = (timeExpiresAt.diff(timeNow))
        //
        //       let minutes = Math.floor((diff / (1000 * 60)) % 60)
        //       let hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        //
        //       let splitArr = arr[i].tillTheMint.split(" ") // ['6', 'hours', '23', 'minutes']
        //
        //       splitArr[0] = hours
        //       splitArr[2] = minutes
        //
        //       arr[i].tillTheMint = splitArr.join(" ")
        //     }
        //   }
        // }

    const handleProjectClick = (project: any) => {
            setIsOpen(!isOpen);
            setIsLoading(true);

            // Temporarily set this condition below since old collection has 10DaySearchResults field
            // which is conflicting with new renamed field tenDaySearchResults
            setSplitCollectionName(!project.tenDaySearchResults ? project['10DaySearchResults'] : project.tenDaySearchResults);
            setIsLoading(false);
        }

    const columns: ColumnsType<Mint> = [
        {
            title: 'Name',
            key: 'project',
            render: record => (
                <span
                    className='cursor-pointer'
                    onClick={() => handleProjectClick(record)}
                >
              {record.project}
            </span>
            ),
            sorter: (a, b) => a.project.localeCompare(b.project),
            width: 180,
            // fixed: 'left',
            // align: 'left'
            //   responsive: ['xs', 'sm'], // Will be displayed on every size of screen
        },
        {
            title: 'Time',
            // dataIndex: 'time',
            key: 'time',
            sorter: (a: any, b: any) => a.time.split(" ")[0].split(":").join("") - b.time.split(" ")[0].split(":").join(""),
            width: 200,
            align: 'left',
            render: record => (
                <span>
                    {record.time}
                    {record.mintExpiresAt}
                    {/* {record.time !== "" && " (" + moment.utc(record.time, 'hh:mm:ss').fromNow() + ")"} */}
                    {
                        // setInterval(() => {
                        //     <p>ok</p>
                        //     // updateTime(record.time)
                        // }, 6000)
                    }
                </span>
            ),
            //   responsive: ['xs', 'sm'], // Will be displayed on every size of screen
        },
        // {
        //     title: 'Time',
        //     key: 'tillTheMint',
        //     width: 130,
        //     render: record => (
        //         // (record.time)
        //         <span>
        //             {record.time !== "" && moment.utc(record.time, 'hh:mm:ss').fromNow()}
        //         </span>
        //     ),
        //     align: 'left'
        //     // responsive: ['md'], // Will not be displayed below 768px
        // },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'value',
            sorter: (a: any, b: any) => a.price.split(" ")[0] - b.price.split(" ")[0],
            width: 150,
            align: 'left'
            // responsive: ['xs', 'sm'], // Will be displayed on every size of screen
        },
        {
            title: 'Supply',
            dataIndex: 'count',
            key: 'count',
            sorter: (a: any, b: any) => a.count - b.count,
            width: 100,
            align: 'left'
            //   responsive: ['md'], // Will not be displayed below 768px
        },
        {

            title: '# Twitter',
            // dataIndex: 'numbersOfTwitterFollowers',
            key: 'numbersOfTwitterFollowers',
            render: record => (
                <>
                    {record.numbersOfTwitterFollowers?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </>
            ),
            sorter: (a: any, b: any) => a.numbersOfTwitterFollowers - b.numbersOfTwitterFollowers,
            width: 110,
            align: 'left'
            // responsive: ['md'], // Will not be displayed below 768px
        },
        {
            title: '# Tweet Interactions',
            key: 'tweetInteraction',
            sorter: (a: any, b: any) => a.tweetInteraction.total - b.tweetInteraction.total,
            render: record => (
                <>
                <span>
                    {record.tweetInteraction.total}
                    {/*likes: {record.tweetInteraction?.likes} <br />*/}
                    {/*comments: {record.tweetInteraction?.comments} <br />*/}
                    {/*retweets: {record.tweetInteraction?.retweets}*/}

                </span>
                </>
            ),
            width: 120,
            align: 'left'
            // responsive: ['md'], // Will not be displayed below 768px
        },
        {
            title: 'Links',
            key: 'connections',
            render: record => (
                <>
                    <a href={record.discordLink} target='_blank'>Discord</a> <br/>
                    <a href={record.twitterLink} target='_blank'>Twitter</a>
                </>
            ),
            width: 100,
            align: 'left'
            // responsive: ['md'], // Will not be displayed below 768px
        },
        // {
        //   title: 'Description',
        //   dataIndex: 'extras',
        //   key: 'description',
        //   width: 300,
        //   responsive: ['md'], // Will not be displayed below 768px
        // },
    ];

    // Renders
    return (

        <div className={`w-full bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4 max-w-fit mx-auto mb-10`}>

            <div className="flex space-x-2 items-center">
                <div className={`font-bold pb-1 `}>Today's Mints - {date}</div>
            </div>


            {/* <div className="bg-gradient-to-b from-bg-primary to-bg-primary justify-center items-center p-4 pt-2 sticky">*/}

            <p className="pt-3">Projects must have more than 1,000 twitter followers before showing up on the list.
                <br/>
                "# Tweet Interactions" takes the last five tweets, gets an average of the Comments / Likes / Retweets, and adds them up (the higher the better)</p>
            {
                isLoading
                    ? <div className="pt-10 flex justify-center items-center">
                        <Loader/>
                    </div>
                    :

                    <div className="p-4">
                        <br/>
                        <Table
                            rowKey='project'
                            dataSource={dataSource}
                            columns={columns}
                            bordered
                            // scroll={{y: 500}}
                            scroll={{x: 'max-content'}}
                            // This both x & y aren't working together properly in our project. I tested out on codesandbox. It works perfectly there!!!
                            // scroll={{x: 'max-content', y: 500}}
                            pagination={false}
                            style={{width: '100%', margin: '0 auto', textAlign: 'center'}}
                        />

                        {/* <IonModal isOpen={isOpen}  onDidDismiss={onClose as any} >
                          <IonContent>
                            {
                              splitCollectionName.length
                              && splitCollectionName?.map(name => (
                                  <div key={name} className='text-center'>
                                    <span style={{color: 'white'}}>{name}</span> <br />
                                  </div>
                              ))
                            }
                          </IonContent>
                        </IonModal> */}

                    </div>
            }
        </div>
    )
}

// @ts-ignore
export default Schedule;
