import express, { Request, Response, NextFunction } from "express";
import { validateTelegramInitData } from "../utils/validateTelegram";

// Расширяем типы Express для добавления telegramUser
declare global {
  namespace Express {
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
}

export function telegramAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const initData = req.headers["x-telegram-init-data"];

  // Если заголовок отсутствует — не требуем авторизацию, продолжаем как аноним
  if (!initData || typeof initData !== "string") {
    return next();
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!botToken) {
    res.status(500).json({ error: "Bot token not configured" });
    return;
  }

  const data = validateTelegramInitData(initData, botToken);

  if (!data) {
    res.status(401).json({ error: "Invalid Telegram initData" });
    return;
  }

  // user приходит строкой JSON
  if (data.user) {
    try {
      req.telegramUser = JSON.parse(data.user);
    } catch {
      res.status(400).json({ error: "Invalid user data" });
      return;
    }
  }

  next();
}