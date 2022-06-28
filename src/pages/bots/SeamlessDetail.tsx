import React, { useEffect, useMemo ,useState} from 'react';
import { instance } from '../../axios';
import { AppComponentProps } from '../../components/Route';
import { IonLabel, IonButton, useIonToast, IonGrid, IonRow, IonCol, IonCard, IonText, IonItem, IonSelect, IonSelectOption, IonInput, IonTextarea, IonDatetime, IonSpinner, } from '@ionic/react';
import './SeamlessDetail.scss';
import discordImage from '../../images/discord.png';
import twitterImage from '../../images/twitter.png';
import {  useHistory, useLocation, useParams } from 'react-router';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import isAxiosError from '../../util/isAxiosError';
import { AxiosError } from 'axios';
import { TextFieldTypes } from '@ionic/core';
import { IWhitelist } from '../../types/IWhitelist';
import { useQuery } from 'react-query';
import moment from 'moment';

/**
 * The page they see when they've clicked "initiate seamless" ... then clicked on a guild
 *
 * This lists the form for them to fill out
 */

interface FormFields {
    image: File & { path: string;};
    target_server: number;
    max_users: number;
    expiration_date: string;
    type: 'raffle' | 'fcfs';
    whitelist_role: string;
    description: string;
    required_role: string;
    twitter: string;
    discordInvite:string;
    magicEdenUpvoteUrl:string;
}
const SeamlessDetail: React.FC<AppComponentProps> = () => {

    const server:any = useLocation();

    // new mint / source server --- comes from params
    const { serverId } = useParams<any>();

    let history = useHistory();
    const { control, handleSubmit,  watch, reset,  setError, formState: { isSubmitting }, } = useForm<FormFields, any>();
    const [present] = useIonToast();
    const now = useMemo(() => new Date(), []);
    const [whiteListRole,setWhiteListRole] = useState<any>([])
    const [whiteListRequireRole,setWhiteListRequireRole] = useState<any>([])
    const [isLoading, setIsLoading] = useState(false);

    const [formField,setFromFiled] = useState({
        image: '',
        target_server:'',
        max_users: '',
        expiration_date: '',
        type:'',
        whitelist_role: '',
        description: '',
        required_role: '',
        twitter: '',
        discordInvite:'',
        })
    const [formFieldEdit,setFromFiledEdit] = useState({
        image: false,
        max_users: false,
        expiration_date: false,
        type:false,
        whitelist_role: false,
        description: false,
        required_role: false,
        twitter: false,
        discordInvite:false,
        })


    const todayEnd = useMemo(() => {
        const date = new Date( + now + 86400 * 1000 );
        date.setHours(23,59,59,999);
        return date;
    }, [now]);

    let fileObject:any
    const getUrlExtension = (url:any) => {
        return url
          .split(/[#?]/)[0]
          .split(".")
          .pop()
          .trim();
      }
    
    const onImageEdit = async (imgUrl: any) => {
        var imgExt = getUrlExtension(imgUrl);
        const response = await fetch(imgUrl);
        const blob = await response.blob();
        fileObject = new File([blob], "botProfile." + imgExt, { type: blob.type, });
    }



    const { data: whitelists = []  } = useQuery( ['whitelistPartnerships'],
        async () => {
            try {
                setIsLoading(true)
                const { data: whitelists } = await instance.get<IWhitelist[]>( '/getWhitelistPartnerships/me' );
                onImageEdit(whitelists[whitelists.length-1]?.image);
                setFromFiled({
                    image: fileObject || '',
                    target_server:'',
                    max_users: whitelists[whitelists.length-1]?.max_users.toString() || '',
                    // expiration_date: moment(whitelists[whitelists.length-1]?.expiration_date).add(1,'days').format('ll'),
                    expiration_date:whitelists[whitelists.length-1]?.expiration_date || '',
                    type:whitelists[whitelists.length-1]?.type || '',
                    whitelist_role: whitelists[whitelists.length-1]?.whitelist_role || '',
                    description: whitelists[whitelists.length-1]?.description || '',
                    required_role: whitelists[whitelists.length-1]?.required_role || '',
                    twitter: whitelists[whitelists.length-1]?.twitter?.toString() || '',
                    discordInvite:whitelists[whitelists.length-1]?.discordInvite?.toString() || '',
                    })
                return whitelists;
            } catch (error) {

            }
            finally {
                setIsLoading(false)
            }

        }
    );
    // get roles for the WL role we will give to people --- new mint --- source server
    const getWhiteListRole = async() =>{
        const errMsg = () => {
            present({
                message: 'Unable to get the roles from the new mint server. Please make sure the SOL Decoder bot is in that server!',
                color: 'danger',
                duration: 1000,
            });
        }

        try{
            // console.log("server id  line number 147",serverId);
            const  data = await instance.get(`/getAllRoles/${serverId}`);
            if(data?.data?.data){
                setWhiteListRole(data.data.data);
            }else{
                errMsg();
            }
        }catch(err){
            errMsg();
        }

    }

    // get roles for what is required to enter the collab
    const getWhiteListRequireRole = async() =>{
        const errMsg = () => {
            present({
                message: 'Unable to get the roles from the new mint server. Please make sure the SOL Decoder bot is in that server!',
                color: 'danger',
                duration: 1000,
            });
        }

        try{
            // console.log("discordGuildId  line number 171",server.state);
            const data = await instance.get(`/getAllRoles/${server.state.discordGuildId}`);
            if(data?.data?.data){
                setWhiteListRequireRole(data.data.data);
            }else{
                errMsg();
            }
        }catch(err){
            errMsg();
        }

    }


    // load it on load...
    useEffect(() => {
        getWhiteListRole();
        getWhiteListRequireRole();
        
    }, [])

    return (
        <IonGrid>
            <IonRow>
                <IonCol size="12"><h2 className="ion-no-margin font-bold text-xl"> Seamless - fill out whitelist details</h2> </IonCol>

                <IonCol ize-xl="12" size-md="12" size-sm="12" size-xs="12" />

                {/* TODO: this is 100% copy/pasted from seamless.tsx (Which I heavily updated - not acceptable!!!*/}
                <IonCol size-xl="4" size-md="6" size-sm="6" size-xs="12" >
                    <IonCard className='ion-no-margin'>

                        <div className="cardImage relative">

                            {/* image */}
                            <img src={server?.state?.icon} className={server?.state?.icon ? 'cardMainImage' : 'cardNoImage'}  alt='' />

                            <div className="cardOverlay-content py-1 px-4">

                                <div className='text-md'>{server.state.name}</div>

                                <div className="socialMediaIcon">

                                    {/*discord*/}
                                    <img hidden={!discordImage} src={discordImage} style={{ height: '18px' }} className='cursor-pointer' onClick={(event)=>{
                                        event.stopPropagation();
                                        if(server.state.discord_link){
                                            window.open(server.state.discord_link)
                                        }}} />

                                    {/*twitter*/}
                                    <img hidden={!twitterImage} src={twitterImage} style={{ height: '18px' }} className='cursor-pointer' onClick={(event)=>{
                                        event.stopPropagation();
                                        if(server.state.twitter_link){
                                            window.open(server.state.twitter_link)
                                        }}} />
                                </div>
                            </div>

                        </div>
                        <IonGrid className="py-4 px-4">
                            <IonRow hidden={!server?.state?.twitter_followers}>
                                <IonCol size="8">
                                    <IonText className='text-white'>Twitter Followers</IonText>
                                </IonCol>
                                <IonCol size="4" className="ion-text-end">
                                    <IonText className="greenText">{server?.state?.twitter_followers || 0 } </IonText>
                                </IonCol>
                            </IonRow>
                            <IonRow hidden={!server?.state?.twitter_interactions}>
                                <IonCol size="8">
                                    <IonText className='text-white'>Twitter Interaction</IonText>
                                </IonCol>
                                <IonCol size="4" className="ion-text-end">
                                    <IonText className="BlueText">{server?.state?.twitter_interactions || 0}</IonText>
                                </IonCol>
                            </IonRow>
                            <div className="content-extra-space"></div>

                            <IonRow hidden={!server?.state?.discord_members}>
                                <IonCol size="8">
                                    <IonText className='text-white'>Discord Members</IonText>
                                </IonCol>
                                <IonCol size="4" className="ion-text-end">
                                    <IonText className="greenText">{server?.state?.discord_members || 0}</IonText>
                                </IonCol>
                            </IonRow>
                            <IonRow hidden={!server?.state?.discord_online}>
                                <IonCol size="8">
                                    <IonText className='text-white'>Online</IonText>
                                </IonCol>
                                <IonCol size="4" className="ion-text-end">
                                    <IonText className="BlueText">{server?.state?.discord_online || 0}</IonText>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCard>
                </IonCol>

                <IonCol size-xl="8" size-md="6" size-sm="6" size-xs="12">
                    <form className="space-y-3"
                     // when submitting the form...
                     onSubmit={  handleSubmit(async (data) => {
                            const { image, ...rest } = data;
                            const rawData = {
                                ...rest,
                                source_server: serverId,
                                target_server:server.state.discordGuildId,
                            };
                            const formData = new FormData();

                            Object.entries(rawData).forEach(([key, value]) => {
                                if (value) formData.append(key, value as string);
                            });
                            formData.append('image', image);

                            try {
                                await instance.post( '/createNewWhitelistPartnership', formData );

                                history.push(`/whitelistmarketplace`);
                                present({
                                    message: 'Whitelist partnership created successfully!',
                                    color: 'success',
                                    duration: 10000,
                                });
                                reset();

                            } catch (error) {
                                console.error(error);

                                if (isAxiosError(error)) {
                                    const { response: { data } = { errors: [] } } =
                                        error as AxiosError<{ errors: { location: string; msg: string; param: string; }[]; }>;

                                    if (!data || data.hasOwnProperty('error')) {
                                        present({
                                            message: ( data as unknown as { body: string } ).body,
                                            color: 'danger',
                                            duration: 10000,
                                        });
                                    } else if (data.hasOwnProperty('errors')) {
                                        data.errors.forEach(({ param, msg }) => {
                                            if (param !== 'source_server') {
                                                setError( param as keyof FormFields, { message: msg, type: 'custom',});
                                            } else {
                                                present({
                                                    message: msg,
                                                    color: 'danger',
                                                    duration: 10000,
                                                });
                                            }
                                        });
                                    }
                                }else{
                                    /**
                                     * TODO: this doesn't work when there is a 400 error - need to tell the user what went wrong
                                     * get a 400 error when error like "{"errors":[{"value":"456","msg":"Invalid discord id","param":"target_server","location":"body"}]}" - so need to show this
                                     *
                                     * after fixing the error in the form - I click submit again but it doesn't work, nothing in network
                                     */
                                    present({
                                        message: 'An error occurred, please try again later or contact us',
                                        color: 'danger',
                                        duration: 10000,
                                    });
                                }
                            }
                        })}>

                        <IonCard className="ion-no-margin rounded-md ion-padding mb-2">

                            <div className='mb-5'>
                                <IonLabel className="text-white">Giveaway Type</IonLabel>
                                <IonItem className="ion-item-wrapper mt-1">
                                    <Controller name="type" rules={{ required: true, }} defaultValue="fcfs" control={control}
                                    render={({  field: { onChange, onBlur, value, name, ref, }, fieldState: { error }, }) => (
                                        <>
                                            <IonSelect   onIonChange={(e) => {
                                                 ( e.target as HTMLInputElement ).value = e.detail.value;
                                                 onChange(e);
                                                 }} 
                                                  name={name} value={formFieldEdit.type ? value : formField.type}  onIonBlur={onBlur} ref={ref} >
                                                <IonSelectOption value="fcfs"> FCFS </IonSelectOption>
                                                <IonSelectOption  value="raffle" disabled  > Raffle (Coming soon) </IonSelectOption>
                                            </IonSelect>
                                        </>
                                    )}  />
                                </IonItem>
                            </div>

                            <div>
                                <IonLabel className="text-white">Expiration Date</IonLabel>
                                <IonItem className="ion-item-wrapper mt-1">
                                    <Controller
                                    name="expiration_date"
                                    control={control}
                                    rules={{  required: true, }}
                                    defaultValue={todayEnd.toISOString()}
                                    render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                        <>
                                            <IonDatetime
                                                value={value}
                                                onIonChange={(e) => {
                                                    const value = new Date(e.detail.value as string);
                                                    value.setHours(23,59,59,999);
                                                    ( e.target as HTMLInputElement ).value =  value.toISOString();
                                                    onChange(e);
                                                }}
                                                name={name}
                                                ref={ref}
                                                onIonBlur={onBlur}
                                                min={new Date(  +now + 86400 * 1000 ).toISOString()}
                                                max={new Date(  +now + 86400 * 365 * 1000 ).toISOString()} />
                                            <p className="formError"> {error?.message} </p>
                                        </>
                                    )} />
                                </IonItem>
                            </div>
                        </IonCard>

                        <IonCard className="ion-no-margin rounded-md ion-padding mb-2">
                            <div className='mb-5'>
                                <IonLabel className="text-white">Max Users</IonLabel>
                                <IonItem className="ion-item-wrapper mt-1">
                                <Controller
                                name="max_users"
                                control={control}
                                render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => {
                                    return (
                                        <>
                                            <IonInput
                                                onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string;  onChange(e); }}
                                                required
                                                type="number"
                                                min="1"
                                                name={name}
                                                value={value}
                                                onIonBlur={onBlur}
                                                ref={ref}
                                                placeholder='ie. 25'
                                            />
                                            <p className="formError"> {error?.message} </p>
                                        </>
                                    )
                                }} />
                                </IonItem>
                            </div>

                            <div className='mb-5'>
                                <IonLabel className="text-white">Whitelist Role (role they will get once Whitelisted in your new mint server)</IonLabel>
                                <IonItem className="ion-item-wrapper mt-1">
                                <Controller
                                    name="whitelist_role"
                                    rules={{ required: true, }}
                                    control={control}
                                    render={({ field: { onChange, onBlur, value, name, ref },  fieldState: { error }, }) =>{
                                    return (
                                        <>
                                            <select className='w-full h-10 ' style={{backgroundColor : 'transparent'}}
                                                onChange={onChange}
                                                name={name}
                                                value={value}
                                                onBlur={onBlur}
                                                ref={ref}
                                                required
                                                placeholder='Select a Whitelist Role' >
                                              <option value=''>Select a Whitelist Role</option>
                                                {whiteListRole && whiteListRole.map((role:any) =>{ return (<option  key={role.id} value={role.id}> {role.name} </option>)}  )}
                                            </select>
                                            <p className="formError"> {error?.message} </p>
                                        </>
                                    )}}
                                />

                                </IonItem>
                            </div>

                            <div>
                                <IonLabel className="text-white">Required Role (role required of them in the existing DAO server, to enter)</IonLabel>
                                <IonItem className="ion-item-wrapper mt-1">
                                <Controller
                                    name="required_role"
                                    rules={{ required: true, }}
                                    control={control}
                                    render={({ field: { onChange, onBlur, value, name, ref },  fieldState: { error }, }) => (
                                        <>
                                            <select className='w-full h-10 ' style={{backgroundColor : 'transparent'}}
                                                onChange={onChange}
                                                name={name}
                                                onBlur={onBlur}
                                                ref={ref}
                                                placeholder='Select a Required Role'
                                                value={value}
                                                required 
                                                >
                                                    <option value=''>Select a Required Role</option>
                                                    {whiteListRequireRole && whiteListRequireRole.map((role:any) =>{ return (<option  key={role.id}  value={role.id} > {role.name} </option>)} )}
                                            </select>
                                            <p className="formError"> {error?.message} </p>
                                        </>
                                    )}
                                />
                                </IonItem>
                            </div>
                        </IonCard>

                        <IonCard className="ion-no-margin rounded-md ion-padding mb-2">
                            <div className='mb-5'>
                                <IonLabel className="text-white">Image to represent your DAO</IonLabel>
                                <IonItem className="ion-item-wrapper mt-1">
                                    <Controller
                                    name="image"
                                    control={control}
                                    rules={{ required: true, }}
                                    render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                        <>
                                            <IonInput
                                                value={value as unknown as string}
                                                onIonChange={(e) => {
                                                    const target = ( e.target as HTMLIonInputElement ).getElementsByTagName('input')[0];
                                                    const file = target .files?.[0] as FieldValues['image'];
                                                    if (file)
                                                        file.path =  URL.createObjectURL(file);
                                                    ( e.target as HTMLInputElement ).value = file as unknown as string;
                                                    onChange(e);
                                                }}
                                                name={name}
                                                ref={ref}
                                                required
                                                onIonBlur={onBlur}
                                                type={'file' as TextFieldTypes}
                                                accept="image" />
                                            <p className="formError"> {error?.message} </p>
                                        </>
                                    )} />
                                </IonItem>
                            </div>

                            <div className='mb-5'>
                                <IonLabel className="text-white">Discord Invite Link (never expires, no invite limit)</IonLabel>
                                <IonItem className="ion-item-wrapper mt-1">
                                    <Controller
                                    name="discordInvite"
                                    control={control}
                                    render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                        <>
                                            <IonInput
                                                value={value}
                                                onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                                                type="url"
                                                required
                                                name={name}
                                                ref={ref}
                                                onIonBlur={onBlur}
                                                placeholder='Discord Invite Link' />
                                            <p className="formError"> {error?.message} </p>
                                        </>
                                    )} />
                                </IonItem>
                            </div>

                            <div className='mb-5'>
                                <IonLabel className="text-white">Twitter Link</IonLabel>
                                <IonItem className="ion-item-wrapper mt-1">
                                    <Controller
                                    name="twitter"
                                    control={control}
                                    render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                        <>
                                            <IonInput
                                                value={value}
                                                onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                                                type="url"
                                                required
                                                name={name}
                                                ref={ref}
                                                onIonBlur={onBlur}
                                                placeholder='Twitter Link' />
                                            <p className="formError"> {error?.message} </p>
                                        </>
                                    )} />
                                </IonItem>
                            </div>
                            <div className='mb-5'>
                                <IonLabel className="text-white">Magic Eden upvote URL</IonLabel>
                                <IonItem className="ion-item-wrapper mt-1">
                                    <Controller
                                    name="magicEdenUpvoteUrl"
                                    control={control}
                                    render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                        <>
                                            <IonInput
                                                value={value}
                                                onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                                                type="url"
                                                required
                                                name={name}
                                                ref={ref}
                                                onIonBlur={onBlur}
                                                placeholder='Magic Eden upvote URL' />
                                            <p className="formError"> {error?.message} </p>
                                        </>
                                    )} />
                                </IonItem>
                            </div>

                            <div>
                                <IonLabel className="text-white">Description</IonLabel>
                                <IonItem className="ion-item-wrapper mt-1">
                                    <Controller
                                    name="description"
                                    control={control}
                                    render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                        <>
                                            <IonTextarea
                                                value={value}
                                                onIonChange={(e:any) => {
                                                    ( e.target as HTMLInputElement ).value = e.detail.value as string;
                                                     onChange(e);
                                                    }}
                                                required
                                                name={name}
                                                ref={ref}
                                                onIonBlur={onBlur}
                                                placeholder='Description'
                                                maxlength={2000} />
                                            <p className="formError"> {error?.message} </p>
                                        </>
                                    )}/>

                                </IonItem>
                                 <p className='mt-2'>Max character limit is 2000</p>
                            </div>
                        </IonCard>
                        <div className='ion-text-right'>
                            <IonButton className="cardButton" type={'submit'} disabled={isSubmitting}>
                                {isSubmitting ? ( <IonSpinner /> ) : ('Submit')}
                            </IonButton>
                        </div>
                    </form>
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

// @ts-ignore
export default SeamlessDetail;
