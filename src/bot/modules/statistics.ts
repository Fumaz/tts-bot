import {Composer, InlineKeyboard} from "grammy";
import {TTSContext} from "../bot.js";
import {database} from "../../database/database.js";
import dayjs from "dayjs";

export const statistics = new Composer<TTSContext>();
const cached = {
    timestamp: 0,
    users: 0,
    audios: 0,
    usersToday: 0,
    audiosToday: 0,
    activeToday: 0,
    characters: 0,
    charactersToday: 0
};

statistics.callbackQuery("statistics", async (ctx) => {
    if (new Date(cached.timestamp) < dayjs().subtract(5, "minutes").toDate()) {
        cached.timestamp = dayjs().toDate().getTime();

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

        cached.users = users;
        cached.audios = audios;
        cached.usersToday = usersToday;
        cached.audiosToday = audiosToday;
        cached.activeToday = activeToday;
        cached.characters = characters._sum.length || 0;
        cached.charactersToday = charactersToday._sum.length || 0;
    }

    const keyboard = new InlineKeyboard()
        .text(ctx.t("back_button"), "menu");

    await ctx.editMessageText(ctx.t("statistics", {
        users: cached.users,
        audios: cached.audios,
        usersToday: cached.usersToday,
        audiosToday: cached.audiosToday,
        activeToday: cached.activeToday,
        characters: cached.characters,
        charactersToday: cached.charactersToday
    }), {
        parse_mode: "HTML",
        reply_markup: keyboard
    });
});
