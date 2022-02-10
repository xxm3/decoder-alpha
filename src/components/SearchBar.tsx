import { IonIcon, IonSearchbar } from '@ionic/react';
import { KeyboardEvent, KeyboardEventHandler, useState } from 'react';
import { search } from 'ionicons/icons';

interface SearchBarProps {
    initialValue?: string;
    onSubmit(query: string): unknown;
}

function SearchBar({ initialValue, onSubmit }: SearchBarProps) {
    const handleKeyDown : KeyboardEventHandler<HTMLIonSearchbarElement> = (e) => {
		const { target, key } = e as KeyboardEvent<HTMLIonSearchbarElement> & { target : HTMLInputElement}
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
                    placeholder="Type to search"
                />
                <div
                    className="text-2xl flex items-center bg-opacity-10 bg-gray-300 hover:bg-opacity-20 justify-center h-10 w-16 space-x-4 cursor-pointer"
                    onClick={() => onSubmit(searchValue)}
                >
                    <IonIcon slot="icon-only" icon={search} className=" " />
                </div>
        </div>
    );
}

export default SearchBar;
