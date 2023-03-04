import {NextFunction} from "grammy";
import {TTSContext} from "../bot.js";

export async function editOrReply(ctx: TTSContext, next: NextFunction) {
    ctx.editOrReplyWithHTML = async (text: string, options: any) => {
        if (ctx?.callbackQuery?.message?.from?.id === ctx.me.id) {
            return ctx.editMessageText(text, {
                parse_mode: "HTML",
                ...options
            });
        } else {
            return ctx.replyWithHTML(text, options);
        }
    };

    await next();
}
