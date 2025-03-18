interface TelegramWebApp {
  ready: () => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  MainButton: {
    hide: () => void;
    show: () => void;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
  };
}

interface Telegram {
  WebApp: TelegramWebApp;
}

declare global {
  interface Window {
    Telegram?: Telegram;
  }
} 