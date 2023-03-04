import {Composer, InlineKeyboard} from "grammy";
import {TTSContext} from "../bot.js";
import {database} from "../../database/database.js";

export const language = new Composer<TTSContext>();

export async function handle(ctx: TTSContext) {
    const keyboard = new InlineKeyboard()
        .text("🇺🇸", "language_en")
        .text("🇮🇹", "language_it")
        .row()
        .text(ctx.t("back_button"), "menu");

    await ctx.i18n.renegotiateLocale();
    const message = ctx.t("language");

    await ctx.editOrReplyWithHTML(message, {
        reply_markup: keyboard
    });
}

async function changeLanguage(ctx: TTSContext) {
    if (!ctx.match) {
        return;
    }

    const language = ctx.match[1];

    ctx.user = await database.user.update({
        where: {
            id: ctx.user.id
        },
        data: {
            language
        }
    });

    await ctx.answerCallbackQuery();
    await handle(ctx);
}

language.callbackQuery("language", async (ctx) => {
    await ctx.answerCallbackQuery();
    await handle(ctx);
})

language.callbackQuery(/^language_(\w\w)$/, async (ctx) => {
    await changeLanguage(ctx);
});
