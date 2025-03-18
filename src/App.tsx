import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useMainContract } from './hooks/useMainContract';
import { useTonConnect } from './hooks/useTonConnect';

function App() {
  const { value, address, sendIncrement } = useMainContract();
  const { connected } = useTonConnect();

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />
        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address}</div>
        </div>
        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>
        {connected && (
          <a
            className='Button'
            onClick={() => {
              sendIncrement();
            }}
          >
            Increment
          </a>
        )}
      </div>
    </div>
  );
}

export default App;
