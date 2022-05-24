import React, { Children, useCallback, useEffect, useMemo, useState } from 'react';
import { instance } from '../../axios';
import { AppComponentProps } from '../../components/Route';
import { environment } from '../../environments/environment';
import { Calendar, momentLocalizer, SlotInfo } from 'react-big-calendar'
import './Schedule.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment';
import { IonButton, IonContent, IonHeader, IonIcon, IonModal, IonPopover,  IonRippleEffect,  IonToolbar, useIonToast } from '@ionic/react';
import { useHistory, useParams, useLocation } from 'react-router';
import MintChart from './MintChart';
import Loader from '../../components/Loader';
import { logoDiscord, logoTwitter, link, close } from 'ionicons/icons';




const ScheduleCalendar: React.FC<AppComponentProps> = () => {
    /**
     * States & Variables
     */
    const history = useHistory();
    const localizer = momentLocalizer(moment)
    const [present, dismiss] = useIonToast();
    const [isMobile, setIsMobile] = useState(false);
    const [selectDate, setSelectDate] = useState<any>(moment().toDate())
    const [myEvents, setEvents] = useState<any>()
    const [openEventModal, setOpenEventModal] = useState<any>(false)
    const [mints, setMints] = useState<any>([])
    const [isLoading, setIsLoading] = useState(false);
    const [selectedEvent,setSelectedEvent] = useState<any>()
    const [showMorePopup, setShowMorePopup] = useState<boolean>(true)
    const [eventGraphData, setEventGraphData] = useState<any>()
    const [showGraph, setShowGraph] = useState<boolean>(false)

    /**
     * Use Effects
     */
    useEffect(() => {
        fetchMintsData();
    }, []);

    useEffect(() => {
        let tempArray = []
        if(mints?.length>0){
            for (let index = 0; index < mints.length; index++) {
                if(mints[index].mints.length>0){
                    for (let i = 0; i < mints[index].mints.length; i++) {
                        tempArray.push({
                            id: mints[index].mints[i].id,
                            title: mints[index].mints[i].name,
                            start: moment (mints[index].date,'DD MM YYYY').toDate(),
                            end: moment(mints[index].date,'DD MM YYYY' ).toDate()
                        })
                    }
                }
            }
        }
        setEvents(tempArray)
    }, [mints])

    
    useEffect(() => {
        if (window.innerWidth < 525) {
            setIsMobile(true);
        }
    }, [window.innerWidth]);


   /**
     * Functions
     */ 
    const fetchMintsData = () => {
        setIsLoading(true);

        instance
            .get(environment.backendApi + '/getAllMints')
            .then(async (res) => {
                setMints(res.data.data);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                let msg = '';
                if (error?.response) {
                    msg = String(error.response.data.body);
                } else {
                    msg = 'Unable to connect. Please try again later';
                }
                present({
                    message: msg,
                    color: 'danger',
                    duration: 5000,
                    buttons: [{ text: 'X', handler: () => dismiss() }],
                });
            })
    }

    // viewing the chart for a calendar
    const viewChart = async(id: any) => {
        // setmintLineData(defaultGraph);

        await instance
            .get( environment.backendApi + '/mintInfo?mintId=' + id )
            .then((res) => {
                setEventGraphData(res)
                if(res.data.data.length > 1){
                    setShowGraph(true)
                }else {
                    setShowGraph(false)
                }
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

 
    const handleSlotSelect = (slotInfo: SlotInfo) => {
        onNavigate(moment(slotInfo?.slots[0]).toDate());
     };

     // select event handler
    const handleSelectEvent = useCallback((event) => {
         setSelectedEvent(event)
         viewChart(event.id);
         setOpenEventModal(true)
         setShowMorePopup(false)
    },[])


    // next previous day and month

   const NextPrevMonth = (type:string) => {
       if(type === "prevMonth"){
           onNavigate(moment(selectDate).add(-1,'months').toDate())
       } else if(type === "currentMonth"){
           onNavigate(moment().toDate())
       } else if (type === "nextMonth"){
           onNavigate(moment(selectDate).add(1,'months').toDate())
       }
   }
   const NextPrevDate = (type:string) => {
       if(type === "prevDay"){
           onNavigate(moment(selectDate).add(-1,'days').toDate())
       } else if(type === "today"){
           onNavigate(moment().toDate())
       } else if (type === "nextDay"){
           onNavigate(moment(selectDate).add(1,'days').toDate())
       }
   }

   const onNavigate = (action: Date) =>{
       setSelectDate(action)
   }

  // calendar custom toolbar button
   const CustomCalenderToolbar  = () => {
       return (
           <div className='rbc-toolbar flex justify-between mt-4'>
               <div >
                   <button type="button" style={{fontSize:isMobile ? '12px' : '', width:isMobile? '20px' : ''}} onClick={()=> NextPrevMonth('prevMonth')} >{"<"}</button>
                   <button type="button" style={{fontSize:isMobile ? '12px' : ''}} onClick={()=> NextPrevMonth('currentMonth')}>{moment(selectDate).format('MMM')}</button>
                   <button type="button" style={{fontSize:isMobile ? '12px' : '', width:isMobile? '20px' : ''}} onClick={()=> NextPrevMonth('nextMonth')} >{">"}</button>
               </div>
               <div >
                   <button type="button" style={{fontSize:isMobile ? '12px' : '', width:isMobile? '20px' : ''}}  onClick={()=> NextPrevDate('prevDay')}>{"<"}</button>
                   <button type="button" style={{fontSize:isMobile ? '12px' : ''}}  onClick={()=> NextPrevDate('today')} >{moment(selectDate).format('LL')}</button>
                   <button type="button" style={{fontSize:isMobile ? '12px' : '', width:isMobile? '20px' : ''}}  onClick={()=> NextPrevDate('nextDay')} >{">"}</button>
               </div>
           </div>
         );
   }

    return (
            <>
            {isLoading ? 
                <div className='flex justify-center items-center mt-4'><Loader/></div>
                 : 
                 <>
                    <div className= {`${isMobile ? "text-center" : 'text-left' } text-2xl `}>
                        Mint Calendar
                        <a className="float-right text-base underline cursor-pointer "onClick= {() => history.push( { pathname: '/schedule'})}>
                            <IonIcon icon={close} className="text-3xl " />
                        </a>
                    </div>
                    <div className={ isMobile ? 'ml-1 mr-1' :"ml-3 mr-3"}>
                        <Calendar
                                defaultDate={ moment().add(-1, "days").toDate()}
                                className={isMobile ? 'show-more-btn custome-event' : ''}
                                views={['month']}
                                events={myEvents}
                                components = {{
                                    toolbar : CustomCalenderToolbar,
                                }}
                                localizer={localizer}
                                onSelectEvent={handleSelectEvent}
                                onSelectSlot={(e: any)=>{handleSlotSelect(e)}}
                                selectable
                                onNavigate = {(action: Date)=> onNavigate(action)}
                                style={{ height: isMobile ? '80vh' : 700, width:isMobile? '90vw' : '' }}
                                startAccessor='start'
                                endAccessor='end'
                                date={selectDate}
                                popup={showMorePopup}
                        />
                    </div>
                    <IonModal isOpen={openEventModal} onDidDismiss={() => {setOpenEventModal(false); setShowMorePopup(true)}} cssClass={isMobile ? 'calender-modal-mobile' :'calender-modal-web'} >
                        <IonHeader>
                            <IonToolbar className='flex items-center justify-between'>
                                <div className='float-left ml-3 font-bold'>
                                    {selectedEvent?.title}
                                </div>
                                <div>
                                    <a className="float-right text-base cursor-pointer mr-3" onClick={() => {setOpenEventModal(false); setShowMorePopup(true)}}>
                                        <IonIcon icon={close} className="h-6 w-6" />
                                    </a>
                                </div>
                            </IonToolbar>
                        </IonHeader>

                        <IonContent  >
                            <div className='ml-4 mt-4 mr-4'>
                                {showGraph ? <MintChart eventGraphData = {eventGraphData}/> : <div className='text-center opacity-40 h-10 bg-slate-500 items-center flex justify-center'> No chart history available</div>}
                                
                            </div>
                            
                            <div className='mt-5 ml-4 mb-2'>
                                <div className="flex space-x-3">
                                    {/*discord*/}
                                    <a href={eventGraphData?.data?.data?.discordLink} target="_blank" style={{ pointerEvents: eventGraphData?.data?.data?.discordLink  ? "initial" : "none" }} className={eventGraphData?.data?.data?.discordLink ? "schedule-link" : "schedule-link-disabled"}>
                                        <IonIcon icon={logoDiscord} className="big-emoji" />
                                        <IonRippleEffect />
                                    </a>
                                    {/*twitter*/}
                                    <a href={eventGraphData?.data?.data?.twitterLink} className="schedule-link" target="_blank">
                                        <IonIcon icon={logoTwitter} className="big-emoji" />
                                        <IonRippleEffect />
                                    </a>
                                </div>

                                    {eventGraphData?.data?.data[0]?.mintName && <span><b>Name : </b>{eventGraphData?.data?.data[0]?.mintName}</span>}
                                    {eventGraphData?.data?.data[0]?.price && <div className='flex flex-row'><b>Price : </b>{eventGraphData?.data?.data[0]?.price}</div>}
                                    {eventGraphData?.data?.data[0]?.discord_all && <span><b>Discord (all) : </b>{eventGraphData?.data?.data[0]?.discord_all.toString()}</span>}
                                    {eventGraphData?.data?.data[0]?.discord_online && <span><br /><b>Discord (online) : </b>{eventGraphData?.data?.data[0]?.discord_online.toString()}</span>}
                                    {eventGraphData?.data?.data[0]?.tweetInteractions && <span><br /><b>Twitter : </b>{eventGraphData?.data?.data[0]?.tweetInteractions.toString()}</span>}
                                
                            </div> 
                            
                    
                        </IonContent>
                    </IonModal>
                </> 
            }
            </>
    );
};

export default ScheduleCalendar;