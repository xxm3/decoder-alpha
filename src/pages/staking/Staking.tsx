import React, { useState } from 'react';
import './staking.scss';

function Staking() {
    const [model, setModel] = useState(false)
    return (
        <>
            {/* margin top 20 */}
            <div className="sm:mt-10"></div>
            {/*  */}
            <div className="mb-auto staking-wrapper">
                <div className="p-2 sm:p-10 flex flex-col items-center">
                    {/*  */}
                    <div className="flex sm:flex-col flex-col justify-around">
                        <div className="flex flex-col justify-center items-center sm:text-center text-center sm:mb-0 mb-2">
                            <div className="text-2xl">
                                <span className="mt-2 font-geomanist-monospace">
                                    Stake your SOL Decoders for
                                </span>
                                <span
                                    className="forge-text-animation font-geomanist-monospace"
                                    
                                >
                                    {' '}
                                    $DECODER
                                </span>

                                <div>
                                    <button
                                        className="w-max mx-auto mt-2 sm:mt-5 text-base items-center px-5 py-2 font-medium tracking-wide shadow-lg text-white capitalize hover:opacity-75 focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out connect-wallet"
                                        onClick={()=>{
                                            setModel(true)
                                        }}
                                    >
                                        Connect Wallet
                                    </button>
                                    {/* open Model */}
                                    {model &&
                                    <div className="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-gray-600 bg-opacity-40 z-50 staking-model">
                                        <div className="rounded-lg w-auto wallet-bg">
                                            <div className="flex flex-col items-start p-4">
                                                {/* Model header */}
                                                <div className="flex items-center w-full mb-6">
                                                    {/* model title */}
                                                    <div className="text-white font-medium text-md mr-5">
                                                        Select preferred wallet
                                                    </div>
                                                    {/* model close button */}
                                                    <a
                                                        type="button"
                                                        className="cursor-pointer"
                                                        
                                                        onClick={()=>{
                                                            setModel(false)
                                                        }}
                                                    >
                                                        <svg
                                                            className="ml-auto fill-current text-gray-700 w-6 h-6"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 18 18"
                                                            
                                                        >
                                                            <path
                                                                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
                                                                
                                                            ></path>
                                                        </svg>
                                                    </a>
                                                </div>
                                                <hr />
                                                {/* 1 */}
                                                <div
                                                    role="button"
                                                    className="py-3 px-5 mb-2 text-white rounded-md text-sm border border-gray-800 w-full relative cursor-pointer wallet-bg"
                                                >
                                                    <div
                                                        className="flex"
                                                    >
                                                        Phantom
                                                    </div>
                                                    <img
                                                        className="absolute right-3 top-2 w-7 h-7"
                                                        src="./assets/stack-image/phantom.svg"
                                                        alt="phantom"
                                                    ></img>
                                                </div>
                                                {/* 2 */}
                                                <div
                                                    role="button"
                                                    className="py-3 px-5 mb-2 text-white rounded-md text-sm border border-gray-800 w-full relative cursor-pointer wallet-bg"
                                                >
                                                    <div
                                                        className="flex"
                                                    >
                                                        Solflare
                                                    </div>
                                                    <img
                                                        className="absolute right-3 top-2 w-7 h-7"
                                                        src="./assets/stack-image/solflare.svg"
                                                        alt="phantom"
                                                    ></img>
                                                </div>
                                                {/* 3 */}
                                                <div
                                                    role="button"
                                                    className="py-3 px-5 mb-2 text-white rounded-md text-sm border border-gray-800 w-full relative cursor-pointer wallet-bg"
                                                >
                                                    <div
                                                        className="flex"
                                                    >
                                                        Sollet
                                                    </div>
                                                    <img
                                                        className="absolute right-3 top-2 w-7 h-7"
                                                        src="./assets/stack-image/sollet.svg"
                                                        alt="phantom"
                                                    ></img>
                                                </div>
                                                {/* 4 */}
                                                <div
                                                    role="button"
                                                    className="py-3 px-5 mb-2 text-white rounded-md text-sm border border-gray-800 w-full relative cursor-pointer wallet-bg"
                                                >
                                                    <div
                                                        className="flex"
                                                    >
                                                        Solflare Extension
                                                    </div>
                                                    <img
                                                        className="absolute right-3 top-2 w-7 h-7"
                                                        src="./assets/stack-image/solflare_extension.svg"
                                                        alt="phantom"
                                                    ></img>
                                                </div>
                                                {/* 5 */}
                                                <div
                                                    role="button"
                                                    className="py-3 px-5 mb-2 text-white rounded-md text-sm border border-gray-800 w-full relative cursor-pointer wallet-bg"
                                                >
                                                    <div
                                                        className="flex"
                                                    >
                                                        Sollet Extension
                                                    </div>
                                                    <img
                                                        className="absolute right-3 top-2 w-7 h-7"
                                                        src="./assets/stack-image/sollet_extension.png"
                                                        alt="phantom"
                                                    ></img>
                                                </div>
                                                {/*  */}
                                            </div>
                                        </div>
                                        {/*  */}
                                    </div>}

                                    {/*  */}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*  */}
                    <div className="flex justify-center m-14">
                        <div className="justify-center w-full flex flex-col">
                            <div className="flex flex-col sm:flex-row justify-center flex-wrap">
                                {/* 1 */}
                                <div className="w-60 h-80 rounded-lg m-5 bg-sections-bslgray relative text-center mb-10">
                                    <img
                                        className="w-14 mx-auto -mt-8"
                                        src="./assets/stack-image/bslred.1b260e07.png"
                                        
                                    />
                                    <div
                                        className="text-4xl bsl-red-gradient mt-20"
                                        
                                    >
                                        $14,880,072
                                    </div>
                                    <div
                                        className="text-xl mt-28 text-white"
                                    >
                                        Minimum Value Locked
                                    </div>
                                </div>

                                {/* 2 */}
                                <div className="w-60 h-80 rounded-lg m-5 bg-sections-bslgray relative text-center mb-10">
                                    <img
                                        className="w-14 mx-auto -mt-8"
                                        src="./assets/stack-image/bslblue.0f0e5b1c.png"
                                        
                                    />
                                    <div
                                        className="text-4xl bsl-blue-gradient mt-20"
                                        
                                    >
                                        4246
                                    </div>
                                    <div
                                        className="text-xl mt-28 text-white"
                                    >
                                        Total Smiths Staked
                                    </div>
                                </div>
                                {/* 3 */}
                                <div className="w-60 h-80 rounded-lg m-5 bg-sections-bslgray relative text-center mb-10">
                                    <img
                                        className="w-14 mx-auto -mt-8"
                                        src="./assets/stack-image/bslgreen.afdfee18.png"
                                        
                                    />
                                    <div
                                        className="text-4xl bsl-green-gradient mt-20"
                                        
                                    >
                                        95.5%
                                    </div>
                                    <div
                                        className="text-xl mt-28 text-white"
                                    >
                                        % of Smiths Staked
                                    </div>
                                </div>
                                {/*  */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Staking;
