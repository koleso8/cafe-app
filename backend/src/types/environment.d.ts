declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TELEGRAM_BOT_TOKEN?: string;          // може бути головним токеном
      TELEGRAM_BOT_TOKEN_MAIN?: string;     // окремий токен головного бота (необов’язково)
      BOT_TOKEN_ENC_KEY: string;            // ключ для шифрування токенів ботів кафе
      TELEGRAM_BOT_USERNAME_MAIN?: string;  // @username головного бота
      FRONTEND_URL?: string;                // базова URL фронтенда
      NODE_ENV: 'development' | 'production' | 'test';
      DATABASE_URL: string;
      PORT?: string;
    }
  }
}

export {};