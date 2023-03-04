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
export const language = new Composer();
export function handle(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const keyboard = new InlineKeyboard()
            .text("🇺🇸", "language_en")
            .text("🇮🇹", "language_it")
            .row()
            .text(ctx.t("back_button"), "menu");
        yield ctx.i18n.renegotiateLocale();
        const message = ctx.t("language");
        yield ctx.editOrReplyWithHTML(message, {
            reply_markup: keyboard
        });
    });
}
function changeLanguage(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!ctx.match) {
            return;
        }
        const language = ctx.match[1];
        ctx.user = yield database.user.update({
            where: {
                id: ctx.user.id
            },
            data: {
                language
            }
        });
        yield ctx.answerCallbackQuery();
        yield handle(ctx);
    });
}
language.callbackQuery("language", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.answerCallbackQuery();
    yield handle(ctx);
}));
language.callbackQuery(/^language_(\w\w)$/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield changeLanguage(ctx);
}));
