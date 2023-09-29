import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react'
import { useTestingStepik } from './hooks/useTestingStepik'
import { useTonConnect } from './hooks/useTonConnect'
import { fromNano } from 'ton-core'
import WebApp from '@twa-dev/sdk'

function App() {

  const { 
    contract_address,
    counter_value,
    contract_balance,
    sendIncrement,
    sendDeposit,
    sendWithdraw
   } = useTestingStepik()

   const { connected } = useTonConnect()

   const showAlert = () => {
    WebApp.showAlert("hey there!!!")
   }

  return (
    <div>
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className='Card'>
          <b>{WebApp.platform}</b>
          <b>Our contract Address</b>
          <div className='Hint'>{contract_address?.slice(0, 30) + "..."}</div>
          <b>Our contract Balance</b>
          <div className='Hint'>{fromNano(contract_balance || 0)}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>

        {connected && (
          <a
            onClick={() => {
              showAlert();
            }}
          >
          Show alert
          </a>
        )}

        <br />

        {connected && (
          <a
            onClick={() => {
              sendIncrement();
            }}
          >
          Increment by 13
          </a>
        )}

        <br />

        {connected && (
          <a
            onClick={() => {
              sendDeposit();
            }}
          >
          deposit 0.1 TON
          </a>
        )}

        <br />

        {connected && (
          <a
            onClick={() => {
              sendWithdraw();
            }}
          >
          withdraw 0.07 TON
          </a>
        )}

      </div>
    </div>
  )

}

export default App
