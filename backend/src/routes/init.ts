import { Router } from "express";
import { prisma } from "../prisma";
import { telegramAuth } from "../middleware/telegramAuth";

const router = Router();

router.post("/", telegramAuth, async (req, res) => {
  const telegramUser = req.telegramUser;
  try {
    const { cafeSlug } = req.body;

    if (!cafeSlug && !telegramUser) {
      return res.status(400).json({ error: "No cafe identifier" });
    }

    // 1️⃣ Определяем кафе
    const cafe = cafeSlug
      ? await prisma.cafe.findUnique({
          where: { slug: cafeSlug },
          include: { settings: true },
        })
      : null;

    if (!cafe) {
      return res.status(404).json({ error: "Cafe not found" });
    }

    // 2️⃣ Пользователь (если есть Telegram)
    let user = null;

    if (telegramUser?.id) {
      user = await prisma.user.upsert({
        where: { telegramId: BigInt(telegramUser.id) },
        update: { name: telegramUser.first_name },
        create: {
          telegramId: BigInt(telegramUser.id),
          name: telegramUser.first_name,
        },
      });
    }

    // 3️⃣ Роль пользователя
    let role = "CLIENT";

    if (user) {
      const cafeUser = await prisma.cafeUser.findUnique({
        where: {
          cafeId_userId: {
            cafeId: cafe.id,
            userId: user.id,
          },
        },
      });

      if (cafeUser) role = cafeUser.role;
    }

    return res.json({
      cafe: {
        id: cafe.id,
        name: cafe.name,
        settings: cafe.settings,
      },
      user,
      role,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
