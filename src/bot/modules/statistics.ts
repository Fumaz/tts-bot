import {Composer, InlineKeyboard} from "grammy";
import {TTSContext} from "../bot.js";
import {database} from "../../database/database.js";

export const statistics = new Composer<TTSContext>();

statistics.callbackQuery("statistics", async (ctx) => {
    const users = await database.user.count();
    const audios = await database.audio.count();

    const usersToday = await database.user.count({
        where: {
            created_at: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
        }
    });

    const audiosToday = await database.audio.count({
        where: {
            created_at: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
        }
    });

    const activeToday = await database.user.count({
        where: {
            updated_at: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
        }
    });

    const keyboard = new InlineKeyboard()
        .text(ctx.t("back_button"), "menu");

    await ctx.editMessageText(ctx.t("statistics", {
        users,
        audios,
        usersToday,
        audiosToday,
        activeToday
    }), {
        parse_mode: "HTML",
        reply_markup: keyboard
    });
});
