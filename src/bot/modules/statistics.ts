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

    const characters = await database.audio.aggregate({
        _sum: {
            length: true
        }
    });

    const charactersToday = await database.audio.aggregate({
        _sum: {
            length: true
        },
        where: {
            created_at: {
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
        activeToday,
        characters: characters._sum.length || 0,
        charactersToday: charactersToday._sum.length || 0
    }), {
        parse_mode: "HTML",
        reply_markup: keyboard
    });
});
