var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function editOrReply(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        ctx.editOrReplyWithHTML = (text, options) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (((_c = (_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.from) === null || _c === void 0 ? void 0 : _c.id) === ctx.me.id) {
                return ctx.editMessageText(text, Object.assign({ parse_mode: "HTML" }, options));
            }
            else {
                return ctx.replyWithHTML(text, options);
            }
        });
        yield next();
    });
}
