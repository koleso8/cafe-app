import { Router } from "express";
import crypto from "crypto";
import { prisma } from "../prisma";
import { telegramAuth } from "../middleware/telegramAuth";
import { encryptToken } from "../utils/crypto";
import { UserRole } from "@prisma/client";

const router = Router();

function generateSlug(name: string): string {
  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9а-яёіїєґ\s-]/gi, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const suffix = crypto.randomBytes(3).toString("hex");
  return `${normalized || "cafe"}-${suffix}`;
}

function generateStartParam() {
  return `cafe-${crypto.randomBytes(8).toString("hex")}`;
}

async function validateBotToken(botToken: string) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
  if (!response.ok) return null;

  const data = (await response.json()) as {
    ok: boolean;
    result?: { id: number; username?: string };
  };

  if (!data.ok || !data.result?.id || !data.result.username) return null;
  return {
    botId: String(data.result.id),
    botUsername: data.result.username,
  };
}

router.post("/", telegramAuth(), async (req, res) => {
  try {
    const telegramUser = req.telegramUser;

    const { name, botToken, ownerTelegramId, ownerName } = req.body as {
      name?: string;
      botToken?: string;
      ownerTelegramId?: number;
      ownerName?: string;
    };

    if (!name || !botToken) {
      return res.status(400).json({ error: "name and botToken are required" });
    }

    const effectiveTelegramId =
      telegramUser?.id ?? ownerTelegramId;

    if (!effectiveTelegramId) {
      return res.status(401).json({ error: "Owner telegram id required" });
    }

    const botInfo = await validateBotToken(botToken);
    if (!botInfo) {
      return res.status(400).json({ error: "Invalid bot token" });
    }

    const encryptedToken = encryptToken(botToken);
    const slug = generateSlug(name);
    const startParam = generateStartParam();

    const user = await prisma.user.upsert({
      where: { telegramId: BigInt(effectiveTelegramId) },
      update: {
        name: telegramUser?.first_name ?? ownerName ?? undefined,
      },
      create: {
        telegramId: BigInt(effectiveTelegramId),
        name: telegramUser?.first_name ?? ownerName,
      },
    });

    const cafe = await prisma.cafe.create({
      data: {
        name,
        slug,
        startParam,
        botId: botInfo.botId,
        botUsername: botInfo.botUsername,
        botToken: encryptedToken,
        settings: {
          create: {
            language: "ua",
            currency: "UAH",
            themeMode: "LIGHT",
          },
        },
      },
      include: { settings: true },
    });

    await prisma.cafeUser.create({
      data: {
        cafeId: cafe.id,
        userId: user.id,
        role: UserRole.OWNER,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const webAppUrl = `${frontendUrl}/?cafe=${slug}`;

    const links = {
      // Лінк на WebApp саме в боті кафе, а не в головному боті
      webApp: `https://t.me/${cafe.botUsername}?startapp=${startParam}`,
      direct: webAppUrl,
    };

    // ініціалізуємо кнопку меню в боті кафе (best-effort, не ламаємо відповідь при помилці)
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/setChatMenuButton`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menu_button: {
            type: "web_app",
            text: "Меню",
            web_app: {
              url: webAppUrl,
            },
          },
        }),
      });
    } catch (err) {
      console.error(
        "Failed to set chat menu button for cafe bot",
        (err as Error).message
      );
    }

    res.status(201).json({
      cafe: {
        id: cafe.id,
        name: cafe.name,
        slug: cafe.slug,
        startParam: cafe.startParam,
        botUsername: cafe.botUsername,
        settings: cafe.settings,
      },
      links,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

