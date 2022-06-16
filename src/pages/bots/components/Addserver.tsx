import { IonButton, IonIcon, useIonToast } from '@ionic/react';
import {
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
} from '@material-ui/core';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { arrowBack } from 'ionicons/icons';
import { AppComponentProps } from '../../../components/Route';
import PersonIcon from '@material-ui/icons/Person';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { instance } from '../../../axios';
import Loader from '../../../components/Loader';
import { IonRow, IonCol } from '@ionic/react';

type props = {
    addServerFlag: boolean;
    setAddServerFlag: Dispatch<SetStateAction<boolean>>;
    serverId?: string;
};

const Addserver: React.FC<props> = (props) => {
    let { addServerFlag, setAddServerFlag, serverId } = props;

    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
    const [present, dismiss] = useIonToast();
    const [adminsList, setAdminsList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [AssigenAdmin, setAssigenAdmin] = React.useState<string[]>([]);

    // TODO: update rds...

    // TODO: need to put name of server on top (on both pages)
    if (!addServerFlag) {
        return (
            <IonButton
                color="primary"
                className="text-sm space-x-1"
                onClick={() => {
                    setAddServerFlag(!addServerFlag);
                }}
            >
                Add Admin for Your Server
            </IonButton>
        );
    }
    if (addServerFlag) {
        useEffect(() => {
            if (serverId) {
                setIsLoading(true);
                instance
                    .get(`/guilds/${serverId}/getAllGuildAdmins`)
                    .then(({ data }) => {
                        if (data.success) {
                            setAdminsList(data.admins);

                            // console.log("admins",data.admins)
                        } else {
                            let msg = '';
                            if (data?.message) {
                                msg = String(data.message);
                            } else {
                                msg =
                                    'Unable to connect. Please try again later';
                            }
                            present({
                                message: msg,
                                color: 'danger',
                                duration: 5000,
                                buttons: [
                                    { text: 'X', handler: () => dismiss() },
                                ],
                            });
                        }
                    })
                    .catch((error: any) => {
                        let msg = '';
                        if (error?.response) {
                            msg = String(error.response.data.message);
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
                    .finally(() => {
                        setIsLoading(false);
                        // setBackdrop(false);
                    });
            }
        }, [serverId]);

        let getRoleType = async (roleList: any, id: string) => {
            // console.log("roleList",roleList);
            setIsLoading(true);
            instance
                .post(
                    `getRoleType`,
                    { roles: roleList },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )
                .then(({ data }) => {
                    if (data.roleType !== 'No Roles') {
                        SetAdmin(id);
                    } else {
                        present({
                            message: 'This admin has no NFTS available.',
                            color: 'danger',
                            duration: 5000,
                            buttons: [{ text: 'X', handler: () => dismiss() }],
                        });
                    }
                })
                .catch((error: any) => {
                    console.error('error', error);

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
                .finally(() => {
                    setIsLoading(false);
                    // console.log("done")
                });
        };

        // Set Admin

        let SetAdmin = (id: string) => {
            setIsLoading(true);

            instance
                .post(
                    `/guilds/${serverId}/setUserAdminGuild`,
                    { adminId: id },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )
                .then(({ data }) => {
                    setAssigenAdmin((old) => [...old, id]);
                    present({
                        message: data.message,
                        color: 'success',
                        duration: 5000,
                        buttons: [{ text: 'X', handler: () => dismiss() }],
                    });
                })
                .catch((error: any) => {
                    console.log('error', error);

                    let msg = '';
                    if (error && error.response) {
                        msg = String(error.response.data.message);
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
                .finally(() => {
                    setIsLoading(false);
                });
        };

        if (isLoading) {
            return (
                <div className="pt-10 flex justify-center items-center">
                    <Loader />
                </div>
            );
        }

        return (
            <div>
                <div>
                    <IonButton
                        color="primary"
                        className="text-sm space-x-1"
                        onClick={() => setAddServerFlag(!addServerFlag)}
                    >
                        <IonIcon icon={arrowBack} />
                        <p>Back</p>
                    </IonButton>
                </div>
                <List dense={dense}>
                    {adminsList.map((admin: any, index) => {
                        return (
                            <IonRow>
                                <IonCol size-lg="5" size-md="9" size="12">
                                <ListItem key={index}>
                                <ListItemAvatar>
                                    <Avatar>
                                        {admin?.user?.avatar ? (
                                            <img
                                                src={`https://cdn.discordapp.com/icons/${admin.user.id}/${admin.user.icon}.webp`}
                                                alt="avtar"
                                            />
                                        ) : (
                                            <PersonIcon />
                                        )}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={admin?.user.username}
                                    secondary={
                                        secondary ? 'Secondary text' : null
                                    }
                                />
                                <ListItemSecondaryAction>
                                    {!AssigenAdmin.includes(
                                        admin?.user?.id
                                    ) && (
                                        <IonButton
                                            color="primary"
                                            className="text-sm space-x-1"
                                            onClick={() =>
                                                getRoleType(admin.roles,admin?.user?.id)
                                            }
                                        >
                                            <p>Assign</p>
                                        </IonButton>
                                    )}
                                </ListItemSecondaryAction>
                            </ListItem>
                                </IonCol>
                                <IonCol></IonCol>
                                </IonRow>

                        );
                    })}
                </List>
            </div>
        );
    }
    return null;
};

export default Addserver;
