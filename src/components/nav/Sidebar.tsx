import { IonList } from "@ionic/react"
import {book, calendarClearOutline, homeOutline, logoFirefox, search, statsChart} from "ionicons/icons"
import Style from "../Style";
import NavLink from "./NavLink"

function Sidebar() {
  return (
      <>
		<Style>
			{`
				ion-list {
					border-color: var(--ion-color-step-150)
				}
			`}
		</Style>
          <IonList
              lines="none"
              className={`px-2 h-full border-r md:max-w-max lg:max-w-none`}
          >
              <NavLink
                  title="Home"
                  icon={homeOutline}
                  to="/"
                  external={''}
              />
              <NavLink
                  title="Today's Mints"
                  icon={calendarClearOutline}
                  to="/schedule"
                  external={''}
              />
              <NavLink
                  title="WL Token Market"
                  icon="/assets/icons/FoxTokenLogo.svg"
                  to="/foxtoken"
                  isIconSvg={true}
                  external={''}
              />
              <NavLink
                  title="Mint Stats"
                  icon={statsChart}
                  to="/mintstats"
                  external={''}
              />
              <NavLink
                  title="Stacked Line Search"
                  icon={search}
                  to="/stackedsearch"
                  external={''}
              />
              <NavLink
                  title="Docs"
                  icon={book}
                  to="#"
                  external={'https://docs.soldecoder.app/books/site-and-discord-overview/page/sol-decoder-overview'}
              />

          </IonList>
      </>
  );
}

export default Sidebar
