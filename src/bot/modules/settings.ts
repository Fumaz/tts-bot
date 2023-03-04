import {Composer, InlineKeyboard} from "grammy";
import {TTSContext} from "../bot.js";
import {database} from "../../database/database.js";

export const settings = new Composer<TTSContext>();

export async function handle(ctx: TTSContext) {
    const keyboard = new InlineKeyboard()
        .text(ctx.t("language_button"), "language")
        .text(ctx.t("slow_mode_button"), "slow_mode")
        .row()
        .text(ctx.t("back_button"), "menu");

    const message = ctx.t("settings");

    await ctx.editOrReplyWithHTML(message, {
        reply_markup: keyboard
    });
}

settings.callbackQuery("settings", async (ctx) => {
    await ctx.answerCallbackQuery();
    await handle(ctx);
})

settings.callbackQuery("slow_mode", async (ctx) => {
    await ctx.answerCallbackQuery();

    ctx.user = await database.user.update({
        where: {
            id: ctx.user.id
        },
        data: {
            slow_mode: !ctx.user.slow_mode
        }
    });

    await handle(ctx);
});
