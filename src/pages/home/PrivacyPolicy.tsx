import {useQuery} from 'react-query';
import {AxiosResponse} from 'axios';
import {instance} from '../../axios';
import {environment} from '../../environments/environment';
import Loader from '../../components/Loader';
import moment from "moment";
import {Link, useLocation} from "react-router-dom";
import {IonButton, IonCard, IonIcon, IonItem, useIonToast} from "@ionic/react";
import {alertOutline, helpOutline, notifications, notificationsOutline, wallet} from "ionicons/icons";
import {Tooltip} from "react-tippy";
import {useHistory} from "react-router";
import './Home.css'
import { useEffect, useState } from 'react';

const PrivacyPolicy = (props:any) => {

    /**
     *
     */
    return (
        <>

            <style>{`
                .bodystuff{
                    padding-left: 10px;
                }
                h4, h2{
                    font-weight: bold;
                    font-size: 110%;
                    padding-bottom: 10px;
                    padding-top: 10px;
                }
                h2{
                    font-size: 140%;
                }
                // p{
                //     font-size: 80%;
                // }
            `}</style>

            <div className='secondary-bg-forced m-1 p-4 rounded-xl'>
                <div className={`font-bold pb-1`}>
                    Privacy Policy
                </div>
            </div>

            {/*<div className="bodystuff">*/}
                <p>Last Modified: April 22, 2022</p>
                <br/>

                <p>
                    <strong>In brief:</strong> SOL Decoder will never share or sell your personal information.
                </p>
                <br/>

                <h4>About Us</h4>
                <p>SOL Decoder (“SOL Decoder” or “We” or “Us”) is the sole owner of soldecoder.app website (“Website”) and all of the information collected on it. Our website collects information from our users in several ways through our Website.</p>
                <p>By using our Website, you consent to our Website’s Privacy Policy.</p>
                <p>We do not knowingly contact or collect personal information from children under 13. If you believe We have inadvertently collected such information, please contact Us so We can either obtain parental consent or delete the information.</p>

                <h4>Online Privacy Policy Only</h4>
                <p>This Policy applies only to information collected through our Website and is not related to any information collected offline.</p>

                <h4>Policy Updates</h4>
                <p>We may update this Policy at our discretion from time to time by posting a new version on our Website. You should check our Website occasionally to ensure any changes made are suitable for you.</p>

                <h2>Which personal information is collected?</h2>

                <h4>Registration - Discord Account</h4>
                <p>In order to access certain features of the Website, you must first login with your Discord account. During registration you will be
                    required to login with Discord, and we will store your Discord username and user ID</p>

                <h4>Opt-in information</h4>
                <p>You may choose to store 1-3 wallets by manually entering them yourself, on the Fox Token page (which we store in our database). You may also choose to subscribe to alerts on a specific wallet, and we then store all of the tokens on your wallet as well as store a unique Firebase messaging identifier if you choose web alerts. All of these features are opt-in and completely optional</p>

                {/*<h4>Cookies</h4>*/}
                {/*<p>We do not use cookies for tracking purposes.</p>*/}
                {/*<p><strong>You have the ability to accept or decline cookies*/}
                {/*    by modifying the settings in your browser. However, you may not be able to use all the interactive features*/}
                {/*    of the Website.</strong></p>*/}

                {/*<h4>Log Files</h4>*/}
                {/*<p>Like most websites, We use web server log files. Records*/}
                {/*    in our log files include internet protocol (IP) addresses, browser types, internet service providers*/}
                {/*    (ISP's), referring pages, exit pages, platform types, and date/time stamps. We use web server log files to*/}
                {/*    administer the site, to provide broad traffic information for site planning purposes, and to ensure that our*/}
                {/*    terms of service agreement are being adhered to. IP addresses are not tied to personally identifiable*/}
                {/*    information in our web server log files.</p>*/}

                <h4>Web beacons (Clear GIFs)</h4>
                <p>Web beacons are tiny graphics with a unique identifier
                    that allow Us to track usage patterns, count users who have visited a particular page, etc. Web beacons only
                    collect limited information, including a cookie number, time and date of a page view, and a description of
                    the page on which the web beacon resides. These beacons do not carry any personally identifiable information
                    and are only used to track the effectiveness of Website. We use web beacons in connection with Google
                    Analytics service. The information generated related to our Website is used to create reports about the use
                    of the Website. Google will store this information. Please refer to Google's privacy policy to get more
                    information.</p>


                <h4>Security</h4>
                <p>We use Secure Socket Layer (SSL) encryption technology in
                    order to protect certain information that you submit. This type of technology protects you from having your
                    information intercepted by anyone while it is being transmitted to our Website. While on a secure
                    page the “lock” icon in the browser window is displayed, confirming that a secure,
                    encrypted connection has been established with the Website. We work hard to ensure that our Website is
                    secure and that we meet industry standards.</p>


                <h4>Links to other sites</h4>
                <p>At our discretion We can add links (web links) to other
                    websites from our Website. These websites can be run by third parties with separate and independent privacy
                    policies. We, therefore, have no responsibility or liability for the content, activities or privacy policies
                    of those linked sites. We suggest you read the privacy policy of each and every site that you visit. We
                    remind you that this Privacy Policy applies only to information collected by our Website.</p>

                {/*<h4>Announcements and Newsletters</h4>*/}
                {/*<p>*/}
                {/*    On rare occasions it is necessary to send out service-related announcements or important newsletters. For*/}
                {/*    instance, if our service is interrupted for a prolonged period or major functionality upgrade is released,*/}
                {/*    We might send all users an email message.*/}
                {/*</p>*/}

                {/*<h4>Customer Service</h4>*/}
                {/*<p>*/}
                {/*    In response to a user's direct support inquiry, We may send email(s) providing assistance with regards to his/her questions.*/}
                {/*</p>*/}

            {/*</div>*/}


        </>
    )
}

export default PrivacyPolicy;
