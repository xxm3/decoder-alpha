import React from 'react'
import { useHistory } from 'react-router'

function ConnectWalletPage() {
    const history = useHistory()
  return (
    <>
    <div>ConnectWalletPage</div>
    <br />
    <button onClick={()=>{
        history.push('/create-wallet-account')
    }}>Create Account</button>
    </>
  )
}

export default ConnectWalletPage