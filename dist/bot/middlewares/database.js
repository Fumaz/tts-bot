var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { database as db } from "../../database/database.js";
export function database(ctx, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!ctx.from) {
            return;
        }
        let user = yield db.user.findUnique({
            where: {
                id: ctx.from.id
            }
        });
        if (!user) {
            user = yield db.user.create({
                data: {
                    id: ctx.from.id,
                    first_name: ctx.from.first_name,
                    last_name: ctx.from.last_name,
                    username: ctx.from.username,
                    language: (_a = ctx.from.language_code) === null || _a === void 0 ? void 0 : _a.substring(0, 2),
                }
            });
        }
        ctx.user = user;
        yield next();
    });
}
