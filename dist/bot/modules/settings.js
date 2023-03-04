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
export const settings = new Composer();
export function handle(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const keyboard = new InlineKeyboard()
            .text(ctx.t("language_button"), "language")
            .text(ctx.t("slow_mode_button"), "slow_mode")
            .row()
            .text(ctx.t("back_button"), "menu");
        const message = ctx.t("settings");
        yield ctx.editOrReplyWithHTML(message, {
            reply_markup: keyboard
        });
    });
}
settings.callbackQuery("settings", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.answerCallbackQuery();
    yield handle(ctx);
}));
settings.callbackQuery("slow_mode", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.answerCallbackQuery();
    ctx.user = yield database.user.update({
        where: {
            id: ctx.user.id
        },
        data: {
            slow_mode: !ctx.user.slow_mode
        }
    });
    yield handle(ctx);
}));
