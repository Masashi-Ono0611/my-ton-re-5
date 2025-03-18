import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useMainContract } from './hooks/useMainContract';
import { useTonConnect } from './hooks/useTonConnect';
import { useState } from 'react';
import WebApp from '@twa-dev/sdk';

function App() {
  const { value, balance, address, sendIncrement, sendDeposit, sendNoCodeDeposit, sendWithdrawal } = useMainContract();
  const { connected } = useTonConnect();
  const [incrementBy, setIncrementBy] = useState<number>(1);
  const [amount, setAmount] = useState<string>('0.1');

  const showAlert = () => {
    WebApp.showAlert("Hey there!");
  };

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />
        
        <div className='Card'>
          <b>Platform: {WebApp.platform}</b>
        </div>

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>

        <div className='Card'>
          <b>Contract Balance</b>
          <div>{balance !== null ? `${balance} nanoTON` : 'Loading...'}</div>
        </div>

        <a className='Button' onClick={showAlert}>
          Show Alert
        </a>

        {connected && (
          <div className='ActionGroup'>
            <div className='Card'>
              <b>Increment Counter</b>
              <div className='Actions'>
                <input
                  type="number"
                  value={incrementBy}
                  onChange={(e) => setIncrementBy(parseInt(e.target.value))}
                  min="1"
                />
                <a
                  className='Button'
                  onClick={() => sendIncrement(incrementBy)}
                >
                  Increment by {incrementBy}
                </a>
              </div>
            </div>

            <div className='Card'>
              <b>Deposit TON</b>
              <div className='Actions'>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.1"
                  step="0.1"
                />
                <a
                  className='Button'
                  onClick={() => sendDeposit(amount)}
                >
                  Deposit with code
                </a>
                <a
                  className='Button'
                  onClick={() => sendNoCodeDeposit(amount)}
                >
                  Deposit without code
                </a>
              </div>
            </div>

            <div className='Card'>
              <b>Withdraw TON</b>
              <div className='Actions'>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.1"
                  step="0.1"
                />
                <a
                  className='Button'
                  onClick={() => sendWithdrawal(amount)}
                >
                  Withdraw
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
