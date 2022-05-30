import React, { Children, useCallback, useEffect, useMemo, useState } from 'react';
import './Schedule.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment';
import { IonButton, IonContent, IonHeader, IonIcon, IonModal, IonPopover,  IonRippleEffect,  IonSearchbar,  IonToolbar, useIonToast } from '@ionic/react';
import { useHistory, useParams, useLocation } from 'react-router';
import { logoDiscord, logoTwitter, link, close } from 'ionicons/icons';



const CommonMintsData = (record1: any) => {
    const history = useHistory();

    let record:any = record1.record

console.log('record',record)
    return (
            <>
            <div>
                     <div className="flex space-x-3">
                         {/*discord*/}
                         <a href={record?.discordLink} target="_blank" style={{ pointerEvents: (record?.discordLink && record?.numbersOfDiscordMembers) ? "initial" : "none" }} className={(record?.discordLink && record?.numbersOfDiscordMembers) ? "schedule-link" : "schedule-link-disabled"}>
                             <IonIcon icon={logoDiscord} className="big-emoji" />
                             <IonRippleEffect />
                         </a>
                         {/*twitter*/}
                         <a href={record?.twitterLink} className="schedule-link" target="_blank">
                             <IonIcon icon={logoTwitter} className="big-emoji" />
                             <IonRippleEffect />
                         </a>
                         {/* Link */}
                         <a href={record?.projectLink} className={(record?.projectLink && record?.projectLink) ? "schedule-link" : "schedule-link-disabled"} target="_blank">
                             <IonIcon icon={link} className="big-emoji" />
                             <IonRippleEffect />
                         </a>
                     </div>

                     {/*DATA REPEATED ON SCHEDULE.TSX AND CALENDAR.TSX*/}
                     <div>
                         { <><b>Name : </b> <img className={`avatarImg ${!record?.image ? 'hiddenImg' : ''}`} key={record?.image} src={record?.image} />{record?.project || record?.mintName }</> }
                         {record?.time && <span><br /><b>Time : </b> <span>{record?.updateTime || record?.time.replace('UTC', '')}<span hidden={record?.mintExpiresAt.indexOf('Invalid') !== -1}>{record?.mintExpiresAt}</span></span></span>}
                         {<div className='flex flex-row'><b>Price : </b> {record?.price ? record?.price :<div onClick={(e) => record?.wlPrice ? history.push( { pathname: '/foxtoken',search: record?.wlTokenAddress }) : '' } className={'flex flex-row ml-1 ' + (record?.wlPrice ? ' cursor-pointer underline' : '') } dangerouslySetInnerHTML={{__html: record?.wlPrice ? `${record?.price.replace(/public/gi, "<br>public").replace('SOL', '')} (<img src="/assets/icons/FoxTokenLogo.svg" class="h-5 pr-1 foxImg" /> ${record?.wlPrice}) ◎` : record?.price &&  `${record?.price?.replace(/public/gi, "<br>public").replace('SOL', '')} ◎`}}></div>}</div>}
                         {record?.count && <span><b>Supply : </b>{record?.count?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>}
                         {<span>{record?.count ? <br /> :'' }<b>Discord (all) : </b>{record?.discord_all ? record?.discord_all : record?.numbersOfDiscordMembers?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>}
                         {<span><br /><b>Discord (online) : </b>{ record?.discord_online ? record?.discord_online : record?.DiscordOnlineMembers?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>}
                         {<span><br /><b>Twitter : </b>{ record?.twitter_all ? record?.twitter_all : record?.numbersOfTwitterFollowers?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>}
                         {<span><br /><b>Twitter Interaction : </b>{ record?.tweetInteractions ? record?.tweetInteractions : record?.tweetInteraction?.total}</span>}
                     </div>
                 </div>
            </>
    );
};

export default CommonMintsData;
