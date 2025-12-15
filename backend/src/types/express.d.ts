import "express";

declare module "express-serve-static-core" {
  interface Request {
    telegramUser?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
    };
  }
}
