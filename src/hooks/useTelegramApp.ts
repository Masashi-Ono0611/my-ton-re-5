import { useEffect, useState } from 'react';

export function useTelegramApp() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // window.Telegramオブジェクトの存在を確認
    const webApp = window.Telegram?.WebApp;
    if (webApp) {
      setIsReady(true);
      try {
        // Telegram Web Appの準備完了を通知
        webApp.ready();
        // 背景色を設定
        webApp.setBackgroundColor(webApp.backgroundColor);
        // MainButtonを非表示に
        webApp.MainButton.hide();
      } catch (error) {
        console.error('Telegram Web App initialization error:', error);
      }
    } else {
      console.log('Telegram Web App is not available - running in browser mode');
    }
  }, []);

  return {
    isReady,
    webApp: window.Telegram?.WebApp,
  };
} 