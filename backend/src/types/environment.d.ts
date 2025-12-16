declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TELEGRAM_BOT_TOKEN: string;
      NODE_ENV: 'development' | 'production' | 'test';
      DATABASE_URL: string;
      PORT?: string;
    }
  }
}

export {};