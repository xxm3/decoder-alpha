import React from 'react'

function CreateWalletPage() {
  return (
    <>
      <div className="grid grid-cols-2">
        <div className="row-span-4">
          <div className="w-1/2 h-30 rounded-lg m-5 bg-sections-bslgray relative text-center mb-10">
            <div className="text-xl pt-2">Your Wallet</div>
            <div className="text-2xl bsl-green-gradient mt-4">FB4X....TAg8</div>
          </div>
          <div className="w-1/2 h-30 rounded-lg m-5 bg-sections-bslgray relative text-center mb-10">
            <div className="text-xl pt-2">SOL decoder stacked</div>
            <div className="text-2xl bsl-blue-gradient mt-4">1</div>
          </div>
          <div className="w-1/2 h-30 rounded-lg m-5 bg-sections-bslgray relative text-center mb-10">
            <div className="text-xl pt-2">Estimated Rewards</div>
            <div className="text-2xl bsl-red-gradient mt-4">9.9736 $FORGE</div>
          </div>
          <div className="w-1/2 h-30 rounded-lg m-5 bg-sections-bslgray relative text-center mb-10">
            <div className="text-xl pt-2">Reward Date</div>
            <div className="text-2xl bsl-blue-gradient mt-4">10 $FORGE/day</div>
          </div>
        </div>
        <div >
          <button className="w-32 ml-2 mt-2 sm:mt-5 text-base px-5 py-2 font-medium tracking-wide shadow-lg text-white capitalize hover:opacity-75 focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out tab-btn-second">
           UNSTAKE ALL
          </button>
           <button className="w-32 ml-2 mt-2 sm:mt-5 text-base px-5 py-2 font-medium tracking-wide shadow-lg text-white capitalize hover:opacity-75 focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out tab-btn">
           CLAIM $FORGE
          </button>
        </div>
        <div className="w-1/2 h-30 rounded-lg m-5 bg-sections-bslgray relative text-center mb-10">
            <div className="pt-2">Your Wallet</div>
            <div className="mt-4">You have no SOL decoder in your wallet</div>
          </div>
      
        <div className="...">
          <div>Stacked SOL decoder</div>
          <div>
            <div>ID</div>
            <div>2256</div>
          </div>
           <div>
            <div>RANK</div>
            <div>3722</div>
          </div>
          <div>
            <button>UNSTAKE</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateWalletPage
