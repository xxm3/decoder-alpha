import {IonIcon, IonSearchbar} from '@ionic/react';
import {KeyboardEvent, KeyboardEventHandler, useState} from 'react';
import {search} from 'ionicons/icons';

interface SearchBarProps {
    initialValue?: string;

    onSubmit(query: string): unknown;

    placeholder?: string
}

function SearchBar({initialValue, onSubmit, placeholder}: SearchBarProps) {

    const handleKeyDown: KeyboardEventHandler<HTMLIonSearchbarElement> = (e) => {
        const {target, key} = e as KeyboardEvent<HTMLIonSearchbarElement> & { target: HTMLInputElement }
        if (target && key === 'Enter') {
            setSearchValue(target.value!);
            onSubmit(target.value);
        }
    };
    const [searchValue, setSearchValue] = useState(initialValue ?? '');

    return (
        <div className="w-full flex items-center rounded overflow-hidden">
            <IonSearchbar
                className="text-base !p-0 text-white text-opacity-80 rounded-none flex-grow outline-none"
                type="text"
                value={searchValue}
                onKeyPress={handleKeyDown}
                onIonChange={(e) => setSearchValue(e.detail.value!)}
                animated
                placeholder={placeholder}
            />
            <div
                className="text-2xl flex items-center bg-opacity-10 bg-gray-300 hover:bg-opacity-20 justify-center h-10 w-16 space-x-4 cursor-pointer"
                onClick={() => onSubmit(searchValue)}
            >
                <IonIcon slot="icon-only" icon={search} className=" "/>
            </div>

            <div className="pl-5 underline cursor-pointer" onClick={() => onSubmit('')} hidden={searchValue.length === 0}>Reset</div>
        </div>
    );
}


export default SearchBar;


{/*// <div className="xs:flex items-center rounded-lg overflow-hidden">*/
}
{/*//     /!* search bar  xs-flex text-base text-gray-400 flex-grow outline-none px-2 *!/*/
}
{/*//     <IonSearchbar className={`w-96`} // ${width <= 640 ? 'w-full' : 'w-full'}*/
}
{/*//                   type="text"*/
}
{/*//                   value={searchValueStacked}*/
}

{/*//                 onKeyPress={e => {*/
}
{/*//                     const val = (e.target as HTMLInputElement).value*/
}
{/*//                     if(val && e.key === "Enter") doSearch(val)*/
}
{/*//                 }}*/
}
{/*//                   onIonChange={e => setSearchValueStacked(e.detail.value!)}*/
}
{/*//                   animated placeholder="Type to search"*/
}
{/*//                   disabled={graphStackedLoading}*/
}
{/*//     />*/
}

{/*//     /!* search button, to do the actual search*!/*/
}
{/*//     <div className="w-10 text-2xl xs:flex px-2 rounded-lg space-x-4 bg-success-1 pb-1 pt-1 cursor-pointer"*/
}
{/*//          onClick={() => doSearch(searchValueStacked)}>*/
}
{/*//         <IonIcon slot="icon-only" icon={search} className=" " />*/
}
{/*//     </div>*/
}
{/*// </div>*/
}

