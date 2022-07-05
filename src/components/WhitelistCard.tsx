import { css } from '@emotion/react';
import {IonButton, IonIcon, IonSpinner, useIonToast} from '@ionic/react';
import {useEffect, useState} from 'react';
import { useQueryClient } from 'react-query';
import { instance } from '../axios';
import { IWhitelist } from '../types/IWhitelist';
import isAxiosError from '../util/isAxiosError';
import TimeAgo from './TimeAgo';
import "./WhitelistCard.scss"
import ConfettiExplosion from 'react-confetti-explosion';
import {logoDiscord, logoTwitter} from 'ionicons/icons';
import MagicEden from '../../src/images/me-white.png'

/**
 * The page they see when they are on /seamless, and browsing for whitelists etc..
 *
 * These are individual cards
 *
 * Parent is "WhitelistMarketplace.tsx"
 */

function WhitelistCard({
    image,
    max_users,
    twitter,
    discordInvite,
    sourceServer,
    targetServer,
    type,
    description,
	required_role_name,
	expiration_date,
	id,
    active,
    showLive,
    isExpired,
	claimed,
	claimCounts,
    claims,
    magicEdenUpvoteUrl,
    won,
    myLiveDAO
}: IWhitelist) {

	const [expired, setExpired] = useState<boolean | undefined>(undefined);
	const [claiming, setClaiming] = useState<boolean>(false);
	const queryClient = useQueryClient();
	const [present] = useIonToast();
	const full = type==='fcfs' ? claimCounts >= max_users : false;
    const [isExploding, setIsExploding] = useState<boolean>(false);
    const uid  = localStorage.getItem('uid');

    // what to show in each button
    const getButtonText = (
        expired : boolean,
        claiming : boolean,
        claimed : boolean, // undefined...
        full : boolean,
        claims:any,
        showLive: any) => {

        // console.log(showLive);
        // if(name === 'Ready Set Trade'){
        //     console.log(expired, claiming, claimed, full , claims);
        //     console.log(claims[0]);
        //     console.log(uid);
        // }

        if(claimed){
            return type==='fcfs' ? 'Claimed' : 'Entered'
        }else if(expired){
            return "Already expired"
        }else if(full){
            return "Full"
        }else  if(claiming){
            return <IonSpinner />
        // }else if(claims[0] && claims[0].user && uid){
            // these should always match, so just returning it here. Query is on whitelistRouter.js.getQueryOptions()
            // if(claims[0].user.discordId === JSON.parse(uid)){
            //     return type==='fcfs' ? 'Claimed' : 'Entered'
            // }else{
            //     return type==='fcfs' ? 'Claimed' : 'Entered'
            // }
        }else {
            return type==='fcfs' ? 'Obtain whitelist' : 'Enter raffle'
        }
    }

    // check whether current user won the whitelist in the raffle right after the event is expired
    useEffect(() => {
        const updateCardState = async () => {
            try {
                const {data: { won }} = await instance.post("/getRaffledState", {
                    whitelist_id : id,
                    type: type
                });

                if(won) {
                    setIsExploding(true);
                    present({
                        message: 'You\'ve won whitelist raffle. You are now whitelisted in ' + sourceServer.name,
                        color: 'success',
                        duration: 10000,
                    });
                }
            } catch {
            }
        }

        if(!expired && myLiveDAO && type === 'raffle') {
            updateCardState().catch(console.error);
        }        
    }, [expired]);

    // for confetti
    useEffect(() => {
        if(claimed && type==='fcfs') {
            setIsExploding(true);
        } else if(won && type==='raffle') {
            setIsExploding(true);
            present({
                message: 'You\'ve won whitelist raffle. You are now whitelisted in ' + sourceServer.name,
                color: 'success',
                duration: 10000,
            });
        }
    },[]);

    return (
		<>

        <div className="border-gray-500 border-[0.5px] rounded-2xl  overflow-clip">

            {/* for confetti */}
            {isExploding && expired !== undefined && <ConfettiExplosion />}

            <div className="relative overflow-y-hidden h-60 ">
                <img src={image} className="h-full w-full object-cover object-left" alt={`${sourceServer?.name} X ${targetServer?.name}`} />
                <div className="absolute flex bottom-0 right-0 justify-between bg-white bg-opacity-50 dark:bg-black dark:bg-opacity-50 py-2 px-5 left-0">

                    <div className="w-full">
                        <p className="text-lg font-bold">{sourceServer?.name}</p>
                        <p className="text-sm italic">must be in "{targetServer?.name}" DAO</p>
                        <p className="text-sm italic"> Type: Whitelist </p>
                    </div>
                    <div className='flex items-center flex-col justify-center mt-2'>
                        <div>
                            {discordInvite && ( <a href={discordInvite} className="hover:opacity-70" target="_blank" > <IonIcon icon={logoDiscord} className="h-6 w-6" /> </a> )}
                        </div>
                        <div>
                            {twitter && ( <a href={twitter} className="hover:opacity-70" target="_blank" > <IonIcon icon={logoTwitter} className="h-6 w-6" /> </a> )}
                        </div>
                        <div>
                            {magicEdenUpvoteUrl && ( <a href={magicEdenUpvoteUrl} className="hover:opacity-70" target="_blank" > <img src={MagicEden} className="h-6 w-6" /> </a> )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-4 px-6 flex-col flex" >

                <div className="mb-3">{description}</div>

                <div className="whitelistInfo grid grid-cols-2">
                    <p>Type </p>
                    <p>{type.toUpperCase()}</p>
                    {
                        type==='fcfs' ? 
                        (<>
                            <p>Slots left </p>
                            <p>{max_users - claimCounts}/{max_users}</p>
                        </>) :
                        expired ?
                        (<>
                            <p>Winners </p>
                            <p>{claimCounts<max_users ? claimCounts : max_users}</p>
                        </>) :
                        (<>
                            <p>Winning spots </p>
                            <p>{max_users}</p>
                            <p>Users entered </p>
                            <p>{claimCounts}</p>
                        </>)
                    }
                    
					<p>Required Role (in "{targetServer?.name}" DAO)</p>
					<p>{required_role_name}</p>
					<p className="timeLeft" hidden={expired || expired === undefined}>Time left</p>
					<span hidden={expired || expired === undefined}><TimeAgo setExpired={setExpired} date={expiration_date}/> </span>
                </div>

                {/* button! */}
				{expired !== undefined && <IonButton css={css`
					--background: linear-gradient(93.86deg, #6FDDA9 0%, #6276DF 100%);
				`} className="my-2 self-center"

                     // when you click the button!
                     onClick={async () => {
                        setClaiming(true);

                        try {

                            // submit form!
                            // await instance.post("/whitelistClaims", {
                            await instance.post("/createWhitelistClaims", {
                                whitelist_id : id,
                                type: type
                            });
                            queryClient.setQueryData(
                                ['whitelistPartnerships'],
                                (queryData) => {
                                    return (queryData as IWhitelist[]).map(
                                        (whitelist) => {
                                            if (whitelist.id === id) {
                                                whitelist.claimed = true;
                                                whitelist.claimCounts += 1
                                            }
                                            return whitelist;
                                        }
                                    );
                                }
                            );

                            // success!
                            if(type==='fcfs') {
                                setIsExploding(true);
                            }

                            const message = type==='fcfs' ? 
                                'Whitelist claimed successfully! You are now whitelisted in ' + sourceServer.name :
                                'Entered whitelist raffle successfully! You are now waiting for whitelist raffle in ' + sourceServer.name;
                            present({
                                message: message,
                                color: 'success',
                                duration: 10000,
                            });

                        // if error!
                        } catch (error) {
                            console.error(error);

                            if(isAxiosError(error) && error.response?.data){
                                present({
                                    message: error.response?.data.body,
                                    color: 'danger',
                                    duration: 5000,
                                });
                            }
                            else {
                                present({
                                    message: "Something went wrong",
                                    color: 'danger',
                                    duration: 5000,
                                });
                            }
                        } finally {
                            setClaiming(false);
                        }
                    }}

                     disabled={expired || claiming || claimed || full || showLive }
                    >
                        {getButtonText(expired,claiming,claimed, full, claims, showLive)}
                    </IonButton>

                }
                {/* end button! */}
                
				</div>

			</div>

		</>
    );
}

export default WhitelistCard;
