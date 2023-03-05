var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Composer, InlineKeyboard } from "grammy";
import { database } from "../../database/database.js";
export const statistics = new Composer();
statistics.callbackQuery("statistics", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield database.user.count();
    const audios = yield database.audio.count();
    const usersToday = yield database.user.count({
        where: {
            created_at: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
        }
    });
    const audiosToday = yield database.audio.count({
        where: {
            created_at: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
        }
    });
    const activeToday = yield database.user.count({
        where: {
            updated_at: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
        }
    });
    const characters = yield database.audio.aggregate({
        _sum: {
            length: true
        }
    });
    const charactersToday = yield database.audio.aggregate({
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
    yield ctx.editMessageText(ctx.t("statistics", {
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
}));
