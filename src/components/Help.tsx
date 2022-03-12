
import { IonIcon, IonItem } from '@ionic/react'
import { Tooltip } from 'react-tippy'
import { helpOutline } from "ionicons/icons"
import Style from './Style'

interface Props {
	description: string;
}
function Help({ description } : Props) {
  return (
	<>
		<Style>{`
			.help-tooltip {
				--background : var(--ion-color-step-300);
				background-color: var(--background);
				--padding-top: 0.5rem;
				--padding-bottom: var(--padding-top);
			}
		`}</Style>
		<Tooltip trigger="mouseenter" position="bottom" html={<IonItem lines="none" className='max-w-[320px] rounded help-tooltip whitespace-pre-line'>{description}</IonItem>}>
			<IonIcon className="rounded-full help-tooltip p-1 text-lg" icon={helpOutline} />
		</Tooltip>
	</>

  )
}

export default Help