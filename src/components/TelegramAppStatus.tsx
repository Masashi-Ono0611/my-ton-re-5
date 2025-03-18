import { useTelegramApp } from '../hooks/useTelegramApp';

export function TelegramAppStatus() {
  const { isReady, webApp } = useTelegramApp();

  return (
    <div style={{ padding: '1rem', marginBottom: '1rem', border: '1px solid #ccc' }}>
      <h3>Telegram Web App Status</h3>
      <p>Ready: {isReady ? 'Yes' : 'No'}</p>
      {webApp && (
        <div>
          <p>Background Color: {webApp.backgroundColor}</p>
        </div>
      )}
    </div>
  );
} 