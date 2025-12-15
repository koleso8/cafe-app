import { Request, Response, NextFunction } from "express";
import { validateTelegramInitData } from "../utils/validateTelegram";

export function telegramAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const initData = req.headers["x-telegram-init-data"];

  if (!initData || typeof initData !== "string") {
    return res.status(401).json({ error: "No Telegram initData" });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN!;
  const data = validateTelegramInitData(initData, botToken);

  if (!data) {
    return res.status(401).json({ error: "Invalid Telegram initData" });
  }

  // user приходит строкой JSON
  if (data.user) {
    try {
      req.telegramUser = JSON.parse(data.user);
    } catch {
      return res.status(400).json({ error: "Invalid user data" });
    }
  }

  next();
}
