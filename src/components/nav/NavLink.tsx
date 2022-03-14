import {IonIcon, IonItem} from "@ionic/react";
import {Link, useLocation} from "react-router-dom";
import {Tooltip} from "react-tippy";
import Style from "../Style";

interface Props {
    to: string;
    icon: string;
    title: string;
    isIconSvg?: boolean;
    external: boolean;
}

function NavLink({to, icon, title, isIconSvg = false, external = false}: Props) {
    const location = useLocation();

    const goExternal = () => {
        if(external){
            window.open(to, "_blank");
        }
    };

    return (
        <>
            <Style>
                {`
                    ion-item.active {
                        --background : var(--ion-color-primary);
                    }

                    ion-item {
                        --padding-horizontal : 1rem;
                        --padding-start: var(--padding-horizontal);
                        --padding-end: var(--padding-horizontal);
                    }
                    span.tooltip-title {
                        background-color: var(--ion-color-step-150)
                    }
                `}
            </Style>

            <Link to={to} onClick={() => goExternal()}>
                <Tooltip
                    html={
                        <span className="hidden md:block lg:hidden tooltip-title px-4 py-2 rounded text-[15px]">
                          {title}
                      </span>
                    }
                    trigger="mouseenter"
                >
                    <IonItem
                        className={`items-center ${location.pathname === to ? "active" : ""}  hover:opacity-80 space-x-3 my-6 rounded`}>
                        {isIconSvg ? <img src="/assets/icons/FoxTokenLogo.svg" className="h-6 w-6" alt="FoxToken"/> :
                            <IonIcon color="inherit" icon={icon} title={undefined}/>
                        }
                        <p className="block md:hidden lg:block">{title}</p>
                    </IonItem>
                </Tooltip>
            </Link>
        </>
    );
}

export default NavLink;
