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
export const menu = new Composer();
function handle(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const keyboard = new InlineKeyboard()
            .switchInline(ctx.t("inline_button"), "")
            .row()
            .text(ctx.t("language_button"), "language")
            .text(ctx.t("statistics_button"), "statistics");
        const message = ctx.t("menu");
        yield ctx.editOrReplyWithHTML(message, {
            reply_markup: keyboard
        });
    });
}
menu.command("start", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield handle(ctx);
}));
menu.callbackQuery("menu", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.answerCallbackQuery();
    yield handle(ctx);
}));
