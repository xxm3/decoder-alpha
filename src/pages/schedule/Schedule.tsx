import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { instance } from '../../axios';
import { environment } from '../../environments/environment';
import Header from "../../components/header/Header";
import Loader from '../../components/Loader';
import {Table} from 'antd'
import { ColumnsType } from 'antd/es/table';
import {IonContent, IonModal, IonPage} from '@ionic/react';

import './Schedule.css'

const Schedule = () => {
    /**
     * States & Variables.
     */
    const [mints, setMints] = useState([])
    const [date, setDate] = useState('')
    const [splitCollectionName, setSplitCollectionName] = useState([])

    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false)
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
        tenDaySearchResults: any
    }

    const dataSource = mints

    // Get today's mints
    const fetchMintsData = () => {
      setIsLoading(true)

      instance
          .get(environment.backendApi + '/getTodaysMints')
          .then((res) => {
            setMints(res.data.data.mints)
            setDate(res.data.data.date)
            setIsLoading(false)
          })
          .catch((err) => {
            setIsLoading(false)
            console.error("error when getting mints: " + err)
          })
    }

    useEffect(() => {
        fetchMintsData()
    }, [])


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
      setSplitCollectionName(!project.tenDaySearchResults ? project['10DaySearchResults'] : project.tenDaySearchResults );
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
          width: 220,
          fixed: 'left',
          align: 'left'
        //   responsive: ['xs', 'sm'], // Will be displayed on every size of screen
        },
        {
          title: 'Time',
          dataIndex: 'time',
          key: 'time',
          sorter: (a:any, b:any) => a.time.split(" ")[0].split(":").join("") - b.time.split(" ")[0].split(":").join(""),
          width: 150,
          align: 'left'
        //   responsive: ['xs', 'sm'], // Will be displayed on every size of screen
        },
        {
            title: 'Time',
            key: 'tillTheMint',
            width: 200,
            render: record => (
                // (record.time)
                <span>
                    {record.time !== "No time specified yet." && moment.utc(record.time, 'hh:mm:ss').fromNow()}
                </span>
            ),
            align: 'left'
            // responsive: ['md'], // Will not be displayed below 768px
        },
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
          sorter: (a:any, b:any) => a.count - b.count,
          width: 150,
          align: 'left'
        //   responsive: ['md'], // Will not be displayed below 768px
        },
        {
            title: 'Links',
            key: 'connections',
            render: record => (
                <>
                    <a href={record.discordLink}>Discord</a> <br />
                    <a href={record.twitterLink}>Twitter</a>
                </>
            ),
            width: 100,
            align: 'left'
            // responsive: ['md'], // Will not be displayed below 768px
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
            width: 100,
            align: 'left'
            // responsive: ['md'], // Will not be displayed below 768px
        },
        {
            title: '# Tweet Interaction',
            key: 'numbersOfTwitterFollowers',

            render: record => (
                <>
                <span>
                    likes: {record.tweetInteraction?.likes} <br />
                    comments: {record.tweetInteraction?.comments} <br />
                    retweets: {record.tweetInteraction?.retweets}
                </span>
                </>
            ),
            width: 120,
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
    <IonPage>
        <IonContent  fullscreen>

            <Header />

            <div className="bg-gradient-to-b from-bg-primary to-bg-secondary justify-center items-center p-4 pt-2 sticky">

                {/*TODO-later: remove below once done, plus remove pl-10 */}
                <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full ">
                    WIP
                </span>

                <div className={`font-bold pb-1 pl-10`}>Today's Mints - {date}</div>

                {
                    isLoading
                    ?   <div className="pt-10 flex justify-center items-center">
                            <Loader />
                        </div>
                    :

                    <div className="max-w-fit mx-auto mb-10">
                        <br />
                        <Table
                            className='w-full mx-auto'
                            rowKey='project'
                            dataSource={dataSource}
                            columns={columns}
                            bordered
                            scroll={{x: 'max-content'}}
                            // This both x & y aren't working together properly in our project. I tested out on codesandbox. It works perfectly there!!!
                            // scroll={{x: 'max-content', y: 500}} 
                            pagination={false}
                        />

                        {/* <IonModal isOpen={isOpen}>
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
        </IonContent>

    </IonPage>
  )
}

// @ts-ignore
export default Schedule;
