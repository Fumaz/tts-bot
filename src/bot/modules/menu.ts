import {TTSContext} from "../bot.js";
import {Composer, InlineKeyboard} from "grammy";

export const menu = new Composer<TTSContext>();

async function handle(ctx: TTSContext) {
    const keyboard = new InlineKeyboard()
        .switchInline(ctx.t("inline_button"), "")
        .row()
        .text(ctx.t("language_button"), "language")
        .text(ctx.t("statistics_button"), "statistics");

    const message = ctx.t("menu");

    await ctx.editOrReplyWithHTML(message, {
        reply_markup: keyboard
    });
}

menu.command("start", async (ctx) => {
    await handle(ctx);
});

menu.callbackQuery("menu", async (ctx) => {
    await ctx.answerCallbackQuery();
    await handle(ctx);
});
