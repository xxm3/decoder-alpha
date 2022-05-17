import React, { Children, useCallback, useEffect, useMemo, useState } from 'react';
import { instance } from '../../axios';
import { AppComponentProps } from '../../components/Route';
import { environment } from '../../environments/environment';
import { Calendar, momentLocalizer, SlotInfo } from 'react-big-calendar'
import { close } from 'ionicons/icons';
import './Schedule.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment';
import { IonButton, IonContent, IonHeader, IonIcon, IonModal, IonPopover,  IonToolbar, useIonToast } from '@ionic/react';
import { useHistory} from "react-router";
import MintChart from './MintChart';



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
    const [width, setWidth] = useState(window.innerWidth);


    /**
     * Use Effects
     */
     const chartHeight = useMemo(() => {
        if (width > 1536) return 100;
        if (width > 1280) return 115;
        if (width > 1024) return 135;
        if (width > 768) return 180;
        if (width > 640) return 225;
        return 140;
    }, [width]);

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
        // setIsLoading(true);

        instance
            .get(environment.backendApi + '/getAllMints')
            .then(async (res) => {
                setMints(res.data.data);
            })
            .catch((error) => {
                // setIsLoading(false);
                let msg = '';
                if (error && error.response) {
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
//  add new event in calendar 
//    const handleSelectSlot = useCallback(
//      ({ start, end }) => {
//        const title = window.prompt('New Event Name')
//        if (title) {
//          setEvents((prev: any) => [...prev, { start, end, title }])
//        }
//      },
//      [setEvents]
//    )
 
    const handleSlotSelect = (slotInfo: SlotInfo) => {
        onNavigate(moment(slotInfo.slots[0]).toDate());
     };

    const handleSelectEvent = useCallback((event) => {
         setOpenEventModal(true)
         setSelectedEvent(event)
         setShowMorePopup(false)
    },[])

    // change event color function 
    // const  eventPropGetter = (event: any) => {
    //     const backgroundColor = event.id ===1 ? 'green' :'blue' ;
    //     return { style: { backgroundColor } }
    // }
    

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
               <div>
                   <button type="button" className={isMobile ? 'w-2.5 ml-2' : ''} onClick={()=> NextPrevMonth('prevMonth')} >{"<"}</button>
                   <button type="button"  onClick={()=> NextPrevMonth('currentMonth')}>{moment(selectDate).format('MMM')}</button>
                   <button type="button" className={isMobile ? 'w-2.5' : ''} onClick={()=> NextPrevMonth('nextMonth')} >{">"}</button>
               </div>
               <div>
                   <button type="button" className={isMobile ? 'w-2.5 ' : ''} onClick={()=> NextPrevDate('prevDay')}>{"<"}</button>
                   <button type="button" onClick={()=> NextPrevDate('today')} >{moment(selectDate).format('LL')}</button>
                   <button type="button" className={isMobile ? 'w-2.5' : ''} onClick={()=> NextPrevDate('nextDay')} >{">"}</button>
               </div>
           </div>
         );
   }

   const ShowMorePopup = (events: any[], date: Date) => {
       
       return(
           <div>
        <IonButton id="trigger-button">Click to open popover</IonButton>
        <IonPopover  isOpen={true}>
          <IonContent>Popover Content</IonContent>
        </IonPopover>
        </div>
       )

   }

//    change event date colot channge
    // const ColoredDateCellWrapper = (props: any) => React.cloneElement(Children.only(props.children), {
    //     style: {
    //         ...props.children.style,
    //         backgroundColor: props.value < selectDate && props.value !== selectDate  ?  'green' : 'red',
    //     },
    // });

    return (
            <>
                <div className= {`${isMobile ? "text-center" : 'text-left' } text-2xl `}>
                    Mint Calendar
                    <a className="float-right text-base underline cursor-pointer "onClick= {() => history.push( { pathname: '/schedule'})}>
                        <IonIcon icon={close} className="text-3xl " />
                    </a>
                </div>
                <div className="ml-3 mr-3">
                    <Calendar
                            defaultDate={ moment().add(-1, "days").toDate()}
                            views={['month']}
                            events={myEvents}
                            components = {{
                                toolbar : CustomCalenderToolbar,
                                // dateCellWrapper: ColoredDateCellWrapper,
                            }}
                            localizer={localizer}
                            onSelectEvent={handleSelectEvent}
                            onSelectSlot={(e: any)=>{handleSlotSelect(e)}}
                            selectable
                            onNavigate = {(action: Date)=> onNavigate(action)}
                            style={{ height: isMobile ? 420 : 700 }}
                            startAccessor='start'
                            endAccessor='end'
                            date={selectDate}
                            popup={showMorePopup}
                            onShowMore={(events: any[], date: Date) => ShowMorePopup(events, date)}
                            // eventPropGetter={eventPropGetter}
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
                        <div className='ml-4 mt-4'>
                            {/* <MintChart {...{
                                chartDataDailyCount: '',
                                // chartDataPerSource: '',
                                chartHeight,
                                // isLoadingChart: '',
                                totalCount: 5
                            }}/> */}
                            <MintChart selectedEvent = {selectedEvent}/>
                        </div>
                    
                    </IonContent>
                </IonModal>
                
           
            </>
    );
};

export default ScheduleCalendar;


                        {/* <div className='ml-4 mt-4' > */}
                        {/* <div className="flex space-x-3 "> */}
                            {/*discord*/}
                            {/* <a href={mints[index]?.discordLink} target="_blank" style={{ pointerEvents: (mints[index]?.discordLink && mints[index]?.numbersOfDiscordMembers) ? "initial" : "none" }} className={(mints[index]?.discordLink && mints[index]?.numbersOfDiscordMembers) ? "schedule-link" : "schedule-link-disabled"}>
                                <IonIcon icon={logoDiscord} className="big-emoji" />
                                <IonRippleEffect />
                            </a> */}
                            {/*twitter*/}
                            {/* <a href={mints[index]?.twitterLink} className="schedule-link" target="_blank">
                                <IonIcon icon={logoTwitter} className="big-emoji" />
                                <IonRippleEffect />
                            </a> */}
                            {/* Link */}
                            {/* <a href={mints[index]?.projectLink} className={(mints[index]?.projectLink && mints[index]?.projectLink) ? "schedule-link" : "schedule-link-disabled"} target="_blank">
                                <IonIcon icon={link} className="big-emoji" />
                                <IonRippleEffect />
                            </a> */}
                        {/* </div> */}

                        {/* <div className="mt-1" >
                            {mints[index]?.project && <span><b>Name : </b>{mints[index].project}</span>}
                            {mints[index]?.mintExpiresAt && <span><br /><b>Time : </b> <span>{mints[index].updateTime || mints[index].time.replace('UTC', '')}<span hidden={mints[index].mintExpiresAt.indexOf('Invalid') !== -1}>{mints[index]?.mintExpiresAt}</span></span></span>}
                            {mints[index]?.price && <div className='flex flex-row'><b>Price : </b><div onClick={(e) => mints[index]?.wlPrice ? history.push( { pathname: '/foxtoken',search: mints[index]?.wlTokenAddress }) : '' } className={'flex flex-row ml-1 ' + (mints[index]?.wlPrice ? ' cursor-pointer underline' : '') } dangerouslySetInnerHTML={{__html: mints[index]?.wlPrice ? `${mints[index]?.price.replace(/public/gi, "public").replace('SOL', '')} (<img src="/assets/icons/FoxTokenLogo.svg" class="h-5 pr-1 foxImg" /> ${mints[index]?.wlPrice}) ◎` : `${mints[index]?.price.replace(/public/gi, "public").replace('SOL', '')} ◎`}}></div></div>}
                            {mints[index]?.count && <span> {mints[index]?.price ? '' : <br/> }<b>Supply : </b>{mints[index].count?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>}
                            {mints[index]?.numbersOfDiscordMembers && <span><br /><b>Discord (all) : </b>{mints[index].numbersOfDiscordMembers?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>}
                            {mints[index]?.DiscordOnlineMembers && <span><br /><b>Discord (online) : </b>{mints[index].DiscordOnlineMembers?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>}
                            {mints[index]?.numbersOfTwitterFollowers && <span><br /><b>Twitter : </b>{mints[index].numbersOfTwitterFollowers?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>}
                            {mints[index]?.tweetInteraction?.total && <span><br /><b>Twitter Interaction : </b>{mints[index].tweetInteraction.total}</span>}
                        </div> */}
                    {/* </div> */}