import path from "path";
import dotenv from "dotenv";

// 1) читаємо .env з поточної робочої директорії (наприклад, backend/.env)
dotenv.config();
// 2) додатково намагаємось прочитати .env з кореня проєкту (../.. від backend)
dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});

import { Telegraf, Context } from "telegraf";
import axios from "axios";

type SessionStep = "idle" | "waiting_name" | "waiting_token";

interface SessionState {
  step: SessionStep;
  cafeName?: string;
}

const sessions = new Map<number, SessionState>();

function getSession(chatId: number): SessionState {
  let s = sessions.get(chatId);
  if (!s) {
    s = { step: "idle" };
    sessions.set(chatId, s);
  }
  return s;
}

const mainBotToken =
  process.env.TELEGRAM_BOT_TOKEN_MAIN || process.env.TELEGRAM_BOT_TOKEN;

if (!mainBotToken) {
  throw new Error(
    "TELEGRAM_BOT_TOKEN_MAIN or TELEGRAM_BOT_TOKEN must be set for main bot"
  );
}

const API_URL = process.env.API_URL || "http://localhost:3000";

const bot = new Telegraf(mainBotToken);

bot.start(async (ctx: Context) => {
  const chatId = ctx.chat?.id;
  if (!chatId) return;

  sessions.set(chatId, { step: "idle" });

  await ctx.reply(
    "Привіт! Я головний бот кафе.\n" +
      "Щоб зареєструвати нове кафе, надішли команду /addcafe"
  );
});

bot.command("addcafe", async (ctx: Context) => {
  const chatId = ctx.chat?.id;
  if (!chatId) return;

  const session = getSession(chatId);
  session.step = "waiting_name";
  session.cafeName = undefined;

  await ctx.reply("Введи назву кафе:");
});

bot.on("text", async (ctx: Context) => {
  const chatId = ctx.chat?.id;
  const from = ctx.from;
  if (!chatId || !from) return;

  const text = ctx.message && "text" in ctx.message ? ctx.message.text : "";
  const session = getSession(chatId);

  if (session.step === "waiting_name") {
    const name = text.trim();
    if (!name) {
      await ctx.reply("Назва не може бути порожньою. Спробуй ще раз.");
      return;
    }

    session.cafeName = name;
    session.step = "waiting_token";

    await ctx.reply(
      "Добре! Тепер надішли токен бота кафе від BotFather.\n" +
        "⚠️ Надсилай його тільки якщо ти довіряєш цьому боту."
    );
    return;
  }

  if (session.step === "waiting_token") {
    const botToken = text.trim();
    if (!botToken) {
      await ctx.reply("Токен не може бути порожнім. Введи токен ще раз.");
      return;
    }

    const cafeName = session.cafeName;
    if (!cafeName) {
      session.step = "idle";
      await ctx.reply("Щось пішло не так, спробуй ще раз команду /addcafe.");
      return;
    }

    await ctx.reply("Створюю кафе, зачекай...");

    try {
      const response = await axios.post(`${API_URL}/api/cafes`, {
        name: cafeName,
        botToken,
        ownerTelegramId: from.id,
        ownerName: from.first_name,
      });

      const { cafe, links } = response.data as {
        cafe: {
          name: string;
          slug: string | null;
          startParam: string;
          botUsername: string | null;
        };
        links: {
          webApp: string;
          direct: string;
        };
      };

      await ctx.reply(
        "✅ Кафе створено!\n\n" +
          `Назва: ${cafe.name}\n` +
          (cafe.botUsername ? `Бот кафе: @${cafe.botUsername}\n` : "") +
          `start_param: ${cafe.startParam}\n\n` +
          "Посилання для вставки в бота кафе (WebApp):\n" +
          `${links.webApp}\n\n` +
          "Пряма веб-версія меню:\n" +
          `${links.direct}`
      );
    } catch (e: any) {
      console.error(e?.response?.data || e.message);
      const msg =
        e?.response?.data?.error ||
        "Сталася помилка при створенні кафе. Спробуй пізніше.";
      await ctx.reply(`⚠️ ${msg}`);
    } finally {
      sessions.set(chatId, { step: "idle" });
    }
    return;
  }

  // Якщо немає активного сценарію
  await ctx.reply(
    "Я тебе не зрозумів.\n" +
      "Щоб зареєструвати нове кафе, надішли команду /addcafe"
  );
});

bot.launch().then(() => {
  console.log("🤖 Main cafe bot started");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));


