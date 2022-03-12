import React from "react";

const Loader: React.FC = () => {
    return (
        <div className="h-48 w-48">

           <img src="/assets/site-logos/logo-loop-black-bg.gif" />

            <div className="mt-3 text-gray-200 font-mono font-bold pl-14">Loading...</div>
            {/*text-sm sm:text-xs*/}

        </div>
    );
}
export default Loader;

