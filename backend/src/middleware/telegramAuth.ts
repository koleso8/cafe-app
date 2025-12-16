import { Request, Response, NextFunction } from "express";
import { validateTelegramInitData } from "../utils/validateTelegram";
import { prisma } from "../prisma";
import { decryptToken } from "../utils/crypto";

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

interface TelegramAuthOptions {
  /**
   * Если true — не использовать токен конкретного кафе, только главный бот.
   */
  forceMainBot?: boolean;
  /**
   * Если true — при отсутствии initData вернём 401.
   */
  required?: boolean;
}

async function resolveCafeBotToken(req: Request): Promise<string | null> {
  const { startParam, cafeSlug } = (req.body || {}) as {
    startParam?: string | null;
    cafeSlug?: string | null;
  };

  if (!startParam && !cafeSlug) return null;

  const cafe = await prisma.cafe.findFirst({
    where: {
      OR: [
        startParam ? { startParam } : undefined,
        cafeSlug ? { slug: cafeSlug } : undefined,
      ].filter(Boolean) as any,
    },
  });

  if (!cafe?.botToken) return null;

  return decryptToken(cafe.botToken);
}

export function telegramAuth(options?: TelegramAuthOptions) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const initData = req.headers["x-telegram-init-data"];

    // Если заголовок отсутствует
    if (!initData || typeof initData !== "string") {
      if (options?.required) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      return next();
    }

    const mainBotToken =
      process.env.TELEGRAM_BOT_TOKEN_MAIN || process.env.TELEGRAM_BOT_TOKEN;

    if (!mainBotToken) {
      res.status(500).json({ error: "Main bot token not configured" });
      return;
    }

    const candidateTokens: string[] = [];

    if (!options?.forceMainBot) {
      const cafeToken = await resolveCafeBotToken(req);
      if (cafeToken) candidateTokens.push(cafeToken);
    }

    candidateTokens.push(mainBotToken);

    let parsedUser: any = null;
    let isValid = false;

    for (const token of candidateTokens) {
      const data = validateTelegramInitData(initData, token);
      if (!data) continue;

      if (data.user) {
        try {
          parsedUser = JSON.parse(data.user);
        } catch {
          continue;
        }
      }

      isValid = true;
      break;
    }

    if (!isValid) {
      res.status(401).json({ error: "Invalid Telegram initData" });
      return;
    }

    if (parsedUser) {
      req.telegramUser = parsedUser;
    }

    next();
  };
}