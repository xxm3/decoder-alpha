import { css } from "@emotion/react";
import React from "react";

const Loader: React.FC = () => {
    return (
        <div className="h-48 w-48">

           <img src="/assets/site-logos/Logo_Sol_decoder/Terminados/Gif/logo.gif" />

            <div className="mt-3 text-gray-200 dark:text-gray-700 font-mono font-bold pl-14" css={css`
				
			`}>Loading...</div>
            {/*text-sm sm:text-xs*/}

        </div>
    );
}
export default Loader;

