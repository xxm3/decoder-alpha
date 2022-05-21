import React from 'react'

function CreateWalletPage() {
  return (
    <>
      <div className=' mx-auto container'>
        <div className='w-full flex xl:flex-row flex-col justify-evenly mt-20 px-5 lg:px-0'>
          <div className='basis-1/2 mt-2'>
            <div className="max-w-sm h-30 rounded-lg mx-auto mb-10 p-4 bg-sections-bslgray relative text-center ">
              <div className="text-lg">Your Wallet</div>
              <div className="text-2xl bsl-green-gradient mt-2">FB4X....TAg8</div>
            </div>

            <div className="max-w-sm h-30 rounded-lg mx-auto mb-10 p-4 bg-sections-bslgray relative text-center ">
              <div className="text-lg">SOL Decoders staked</div>
              <div className="text-2xl bsl-blue-gradient mt-2">1</div>
            </div>

            <div className="max-w-sm h-30 rounded-lg mx-auto mb-10 p-4 bg-sections-bslgray relative text-center ">
              <div className="text-lg">Estimated Rewards</div>
              <div className="text-2xl bsl-red-gradient mt-2">20 $DECODE</div>
            </div>

            <div className="max-w-sm h-30 rounded-lg mx-auto mb-10 p-4 bg-sections-bslgray relative text-center ">
              <div className="text-lg">Reward Date</div>
              <div className="text-2xl bsl-blue-gradient mt-2">20 $DECODE/day</div>
            </div>
          </div>
          <div className='basis-1/2'>

            <div className="max-w-sm h-30 rounded-lg mx-auto p-4 bg-sections-bslgray relative text-center ">
              <div className="pt-2 text-xl">Your Wallet</div>
              <div className="mt-4 text-md">You have no SOL Decoders in your wallet</div>

                <button className="mx-2 text-base px-5 py-2 font-medium tracking-wide shadow-lg text-white capitalize hover:opacity-75 focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out tab-btn-second">
                    STAKE ALL
                </button>

            </div>

            <div className='mx-aut0 my-5 flex justify-center'>
              <button className="mx-2 text-base px-5 py-2 font-medium tracking-wide shadow-lg text-white capitalize hover:opacity-75 focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out tab-btn-second">
                UNSTAKE ALL
              </button>
              <button className="mx-2 text-base px-5 py-2 font-medium tracking-wide shadow-lg text-white capitalize hover:opacity-75 focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out tab-btn">
                CLAIM $DECODE
              </button>
            </div>




            <div className='w-full text-center my-3 text-xl'>Staked SOL Decoders</div>

            <div className="w-72 card pb-4 rounded-2xl mx-auto">
              <div className='image-wrapper rounded-tl-2xl rounded-tr-2xl'>
                <img src="./assets/market-place/nft.png" alt="" />
              </div>


              <div className='w-full card-content px-4'>

                <div className='flex justify-evenly my-5 items-center'>
                  <div className='flex flex-col items-center'>
                    <div>ID</div>
                    <div>2256</div>
                  </div>
                  <div className='flex flex-col items-center'>
                    <div>RANK</div>
                    <div>3722</div>
                  </div>
                </div>

                <div className='flex w-full rounded-lg border-2 text-center border-rose-600 '>
                  <button className='p-2 text-center w-full'>UNSTAKE</button>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateWalletPage
